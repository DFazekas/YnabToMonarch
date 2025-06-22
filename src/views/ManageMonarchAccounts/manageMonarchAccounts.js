import { monarchApi } from '../../api/monarchApi.js';
import state from '../../state.js';
import { getLocalStorage, getCachedAccounts, saveAccountsToCache } from '../../utils/storage.js';
import { navigate } from '../../router.js';
import { getAccountTypeByDisplayName, getSubtypeByDisplayName } from '../../utils/accountTypeUtils.js';
import { renderButtons } from '../../components/button.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { capitalize } from '../../utils/string.js';
import { updateBulkActionBar } from '../../utils/bulkActionBar.js';
import { toggleButtonActive, toggleDisabled, toggleElementVisible } from '../../utils/dom.js';
import { createAccountRowElement } from '../../components/accountTable.js';

let currentFilter = 'all';
let searchQuery = '';
let accounts = []

// defer DOM queries until init
let $;
let UI;

export default function initManageMonarchAccountsView() {
  // Ensure user is authenticated
  const token = state.credentials.apiToken || getLocalStorage().token;
  if (!token) {
    state.redirectAfterLogin = 'bulkDeleteView';
    return navigate('monarchCredentialsView');
  }

  // bind queries
  $ = id => document.getElementById(id);
  UI = {
    dataTableBody: $('dataTableBody'),
    statusMsg: $('statusMsg'),
    lastSynced: $('lastSynced'),
    refreshBtn: $('refreshBtn'),
    masterCheckbox: $('masterCheckbox'),
    searchInput: $('searchInput'),
    filterAllBtn: $('filterAll'),
    unselectAllBtn: $('unselectAllBtn'),
    bulkRenameBtn: $('bulkRenameBtn'),
    bulkTypeBtn: $('bulkTypeBtn'),
    bulkIncludeBtn: $('bulkIncludeBtn'),
    bulkExcludeBtn: $('bulkExcludeBtn'),
    bulkDeleteBtn: $('bulkDeleteBtn'),
    importBtn: $('importBtn'),
    bulkRenameModal: $('bulkRenameModal'),
    renamePattern: $('renamePattern'),
    indexStartInput: $('indexStart'),
    renamePreview: $('renamePreview'),
    renameCancel: $('renameCancel'),
    renameApply: $('renameApply'),
    bulkTypeModal: $('bulkTypeModal'),
    bulkTypeSelect: $('bulkTypeSelect'),
    bulkSubtypeSelect: $('bulkSubtypeSelect'),
    bulkTypeCancel: $('bulkTypeCancel'),
    bulkTypeApply: $('bulkTypeApply'),
    selectedCount: $('selectedCount'),
    bulkActionBar: $('bulkActionBar'),
  };

  UI.filterAllBtn.classList.add('bg-blue-500', 'text-white');

  // Bulk action bar listeners
  UI.unselectAllBtn.addEventListener('click', () => updateSelection(false));
  UI.bulkIncludeBtn.addEventListener('click', () => updateInclusion(true));
  UI.bulkExcludeBtn.addEventListener('click', () => updateInclusion(false));
  UI.bulkRenameBtn.addEventListener('click', openBulkRenameModal);
  UI.bulkTypeBtn.addEventListener('click', openBulkTypeModal);

  // Master checkbox listener
  UI.masterCheckbox.addEventListener('change', masterCheckboxChange);

  // Navigation listeners
  UI.importBtn.addEventListener('click', () => navigate('methodView'));
  UI.refreshBtn.addEventListener('click', () => syncAccounts(token));

  // Search listener
  let debounceTimer;
  UI.searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = UI.searchInput.value.toLowerCase();
      renderAccountTable(accounts);
    }, 200);
  });

  // Filter listeners
  ['all', 'included', 'excluded'].forEach(filter => {
    document.getElementById(`filter${capitalize(filter)}`).addEventListener('click', () => setFilter(filter));
  });

  // Load cached accounts if available, else fetch
  const initialCache = getCachedAccounts();
  if (initialCache.length) {
    accounts = initialCache;
    renderAccountTable(accounts);
    renderButtons();
    UI.statusMsg.textContent = `Loaded ${accounts.length} accounts from cache.`;
    const storedTs = localStorage.getItem('monarchAccountsTimestamp');
    UI.lastSynced.textContent = `Last synced: ${new Date(parseInt(storedTs, 10)).toLocaleString()}`;
  } else {
    syncAccounts(token);
    renderButtons();
  }
}

async function syncAccounts(token) {
  try {
    UI.statusMsg.textContent = 'Fetching accounts from Monarch...';
    const data = await monarchApi.fetchAccounts(token);

    accounts = data.accounts.map(account => ({
      ...account,
      modifiedName: account.displayName,
      isSelected: false,
      isIncluded: true,
      status: 'unprocessed',
      balance: account.displayBalance || 0,
      type: account.type,
      subtype: account.subtype,
      isProcessed: false,
      isFailed: false,
    }));

    saveAccountsToCache(accounts);
    const newTimestamp = Date.now().toString();
    localStorage.setItem('monarchAccountsTimestamp', newTimestamp);
    UI.lastSynced.textContent = `Last synced: ${new Date(parseInt(newTimestamp, 10)).toLocaleString()}`;
    UI.statusMsg.textContent = `Fetched ${accounts.length} accounts from Monarch.`;
    renderAccountTable(accounts);
    renderButtons();
  } catch (error) {
    console.error("Error fetching accounts:", error);
    UI.statusMsg.textContent = `Error fetching accounts: ${error.message}`;
  }
}

function renderAccountTable(accounts) {
  const fragment = document.createDocumentFragment();
  UI.dataTableBody.innerHTML = '';

  for (const account of accounts) {
    if (currentFilter === 'included' && !account.isIncluded) continue;
    if (currentFilter === 'excluded' && account.isIncluded) continue;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) continue;

    const rowElement = createAccountRowElement(account, {
      showCheckbox: true,
      onCheckboxClick: handleCheckboxClick,
      onNameClick: handleNameClick,
      onTypeChange: handleTypeChange,
      onSubtypeChange: handleSubtypeChange,
      onToggleChange: handleToggleChange
    })
    fragment.appendChild(rowElement);
  }

  UI.dataTableBody.appendChild(fragment);
  updateMasterCheckbox(getVisibleAccounts());
  updateBulkActionBar('bulkActionBar', accounts.filter(acc => acc.isSelected).length);
  toggleDisabled(importBtn, !accounts.some(isIncludedAndUnprocessed));
  UI.importBtn.title = UI.importBtn.disabled ? 'At least one account must be included to proceed' : '';
  renderButtons();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.id === `filter${capitalize(currentFilter)}`;
    toggleButtonActive(btn, isActive);
  });

  renderAccountTable(accounts);
}

function updateSelection(shouldSelect) {
  accounts.forEach(acc => {
    if (acc.status !== 'processed') acc.isSelected = shouldSelect;
  });
  renderAccountTable(accounts);
}

function updatePreview(accounts) {
  UI.renamePreview.innerHTML = '';

  const pattern = UI.renamePattern.value;
  const indexStart = parseInt(UI.indexStartInput.value, 10) || 1;

  Object.values(accounts).filter(acc => acc.isSelected).slice(0, 3).forEach((acc, i) => {
    const previewName = applyPattern(pattern, acc, i + indexStart);
    const div = document.createElement('div');
    div.textContent = previewName;
    UI.renamePreview.appendChild(div);
  });
}

function handleCheckboxClick(account, checkboxElement) {
  account.isSelected = checkboxElement.checked;
  refreshBulkActionBar();
  updateMasterCheckbox(getVisibleAccounts());
}

function handleNameClick(account, nameTd) {
  openNameEditor(account, nameTd)
}

function handleTypeChange(account, newType) {
  const monarchTypeData = getAccountTypeByDisplayName(newType);
  account.type = {
    display: monarchTypeData.typeDisplay,
    name: monarchTypeData.typeName,
  }
  account.subtype = {
    display: monarchTypeData.subtypes[0].display,
    name: monarchTypeData.subtypes[0].name,
  }
  renderAccountTable(accounts);
}

function handleSubtypeChange(account, newSubtype) {
  const selectedSubtype = getSubtypeByDisplayName(account.type.display, newSubtype);
  account.subtype = {
    display: selectedSubtype.display,
    name: selectedSubtype.name,
  }
  renderAccountTable(accounts);
}

function handleToggleChange(account) {
  account.isIncluded = !account.isIncluded;
  renderAccountTable(accounts);
}

function updateMasterCheckbox(visibleAccounts) {
  const selectedCount = visibleAccounts.filter(acc => acc.isSelected).length;
  UI.masterCheckbox.checked = selectedCount > 0 && selectedCount === visibleAccounts.length;
  UI.masterCheckbox.indeterminate = selectedCount > 0 && selectedCount < visibleAccounts.length;
}

function updateInclusion(include) {
  Object.values(accounts).forEach(acc => {
    if (acc.isSelected) acc.isIncluded = include;
  });
  renderAccountTable(accounts);
}

function masterCheckboxChange(e) {
  const checked = e.target.checked;
  getVisibleAccounts().forEach(acc => {
    acc.isSelected = checked;
  });
  renderAccountTable(accounts);
}

function refreshBulkActionBar() {
  const selectedCount = Object.values(accounts).filter(acc => acc.isSelected).length;
  UI.selectedCount.textContent = selectedCount;
  toggleElementVisible(UI.bulkActionBar, selectedCount > 0);
}

function openNameEditor(account, nameElement) {
  const overlay = document.createElement('div');
  overlay.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200';
  document.body.appendChild(overlay);
  requestAnimationFrame(() => overlay.classList.add('opacity-100'));

  const popup = document.createElement('div');
  popup.className = 'bg-white rounded-lg shadow-lg p-5 w-[400px]';

  const title = document.createElement('h2');
  title.className = 'font-bold mb-3 text-lg';
  title.textContent = 'Edit Account Name';
  popup.appendChild(title);

  const input = document.createElement('input');
  input.type = 'text';
  input.value = account.modifiedName;
  input.setAttribute('aria-label', 'Account name input');
  input.className = 'border rounded w-full px-3 py-2 mb-4';
  popup.appendChild(input);

  const buttonRow = document.createElement('div');
  buttonRow.className = 'flex justify-end gap-2';

  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancel';
  cancelBtn.className = 'bg-gray-300 px-4 py-2 rounded';
  cancelBtn.addEventListener('click', () => closeEditor());

  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Save';
  saveBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded font-bold';
  saveBtn.addEventListener('click', save);

  buttonRow.appendChild(cancelBtn);
  buttonRow.appendChild(saveBtn);
  popup.appendChild(buttonRow);
  overlay.appendChild(popup);

  input.focus();
  input.select();

  overlay.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeEditor();
    if (e.key === 'Enter') save();
  });

  function closeEditor() {
    overlay.classList.remove('opacity-100');
    overlay.classList.add('opacity-0');
    setTimeout(() => document.body.removeChild(overlay), 200);
  }

  function save() {
    account.modifiedName = input.value.trim();
    nameElement.textContent = account.modifiedName;
    nameElement.title = `Click to rename '${account.modifiedName}'`;
    closeEditor();
  }
}

function openBulkRenameModal() {
  UI.bulkRenameModal.classList.remove('hidden');
  UI.renamePattern.focus();
  const selectedAccounts = Object.values(accounts).filter(acc => acc.isSelected);

  // Token insert handlers
  const tokenButtons = document.querySelectorAll('.token-btn');
  tokenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const token = btn.dataset.token;
      UI.renamePattern.value += token;
      updatePreview(accounts);
    });
  });

  // Live preview
  UI.renamePattern.addEventListener('input', (accounts) => updatePreview(accounts));
  UI.indexStartInput.addEventListener('input', (accounts) => updatePreview(accounts));
  updatePreview(accounts);

  UI.renameCancel.onclick = () => UI.bulkRenameModal.classList.add('hidden');
  UI.renameApply.onclick = () => {
    const pattern = UI.renamePattern.value;
    const indexStart = parseInt(UI.indexStartInput.value, 10) || 1;
    selectedAccounts.forEach((acc, i) => {
      acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
    });
    UI.bulkRenameModal.classList.add('hidden');
    renderAccountTable(accounts);
  };
}

function applyPattern(pattern, account, index) {
  const today = new Date().toISOString().split('T')[0];
  return pattern
    .replace(/{{YNAB}}/g, account.modifiedName)
    .replace(/{{Index}}/g, index)
    .replace(/{{Upper}}/g, account.modifiedName.toUpperCase())
    .replace(/{{Date}}/g, today);
}

function openBulkTypeModal() {
  UI.bulkTypeModal.classList.remove('hidden');

  // Populate Type dropdown
  UI.bulkTypeSelect.innerHTML = '';
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeName;
    opt.textContent = type.typeDisplay;
    UI.bulkTypeSelect.appendChild(opt);
  });

  // On type change, repopulate subtype dropdown
  function updateSubtypeOptions() {
    const selectedType = getAccountTypeByDisplayName(UI.bulkTypeSelect.value);
    UI.bulkSubtypeSelect.innerHTML = '';

    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      UI.bulkSubtypeSelect.appendChild(opt);
    });

    // If no subtypes available, add default empty option
    if ((selectedType?.subtypes || []).length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '-';
      UI.bulkSubtypeSelect.appendChild(opt);
    }
  }

  UI.bulkTypeSelect.addEventListener('change', updateSubtypeOptions);
  updateSubtypeOptions();

  UI.bulkTypeCancel.onclick = () => UI.bulkTypeModal.classList.add('hidden');
  UI.bulkTypeApply.onclick = () => {
    const typeValue = UI.bulkTypeSelect.value;
    const subtypeValue = UI.bulkSubtypeSelect.value;

    const selectedAccounts = Object.values(accounts).filter(acc => acc.isSelected);
    selectedAccounts.forEach(acc => {
      acc.type = typeValue;
      acc.subtype = subtypeValue || null;
    });

    UI.bulkTypeModal.classList.add('hidden');
    renderAccountTable(accounts);
  };
}

function getVisibleAccounts() {
  return Object.values(accounts).filter(account => {
    if (account.status === 'processed') return false;
    if (currentFilter === 'included' && !account.isIncluded) return false;
    if (currentFilter === 'excluded' && account.isIncluded) return false;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

function isIncludedAndUnprocessed(account) {
  return account.isIncluded && account.status !== 'processed';
}
