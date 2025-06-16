import state from '../../state.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { capitalize } from '../../utils/string.js';
import { currencyFormatter } from '../../utils/format.js';
import { getAccountTypeByName, getSubtypeByName } from '../../utils/accountTypeUtils.js';
import { toggleButtonActive, toggleElementVisible, toggleDisabled } from '../../utils/dom.js';

let reviewTableBody, importBtn, searchInput;
let currentFilter = 'all';
let searchQuery = '';

export default function initAccountReviewView() {
  reviewTableBody = document.getElementById('reviewTableBody');
  importBtn = document.getElementById('importBtn');
  searchInput = document.getElementById('searchInput');

  renderButtons();

  document.getElementById('filterAll').classList.add('bg-blue-500', 'text-white');

  // Search listener
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase();
      renderAccountTable();
    }, 200);
  });

  // Filter listeners
  ['all', 'included', 'excluded'].forEach(filter => {
    document.getElementById(`filter${capitalize(filter)}`).addEventListener('click', () => setFilter(filter));
  });

  // Bulk action bar listeners
  document.getElementById('unselectAllBtn').addEventListener('click', () => updateSelection(false));
  document.getElementById('bulkIncludeBtn').addEventListener('click', () => updateInclusion(true));
  document.getElementById('bulkExcludeBtn').addEventListener('click', () => updateInclusion(false));
  document.getElementById('bulkRenameBtn').addEventListener('click', openBulkRenameModal);
  document.getElementById('bulkTypeBtn').addEventListener('click', openBulkTypeModal);

  // Master checkbox listener
  document.getElementById('masterCheckbox').addEventListener('change', masterCheckboxChange);

  // Navigation listeners
  document.getElementById('backBtn').addEventListener('click', () => navigate('uploadView'));
  importBtn.addEventListener('click', () => navigate('methodView'));

  renderAccountTable();
}

function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.filter-btn').forEach(btn => {
    const isActive = btn.id === `filter${capitalize(currentFilter)}`;
    toggleButtonActive(btn, isActive);
  });

  renderAccountTable();
}

function updateSelection(shouldSelect) {
  Object.values(state.accounts).forEach(acc => {
    if (acc.status !== 'processed') acc.selected = shouldSelect;
  });
  renderAccountTable();
}

function updateInclusion(include) {
  Object.values(state.accounts).forEach(acc => {
    if (acc.selected) acc.included = include;
  });
  renderAccountTable();
}

function renderAccountTable() {
  const fragment = document.createDocumentFragment();
  const accounts = Object.values(state.accounts);
  reviewTableBody.innerHTML = '';

  for (const account of accounts) {
    if (currentFilter === 'included' && !account.included) continue;
    if (currentFilter === 'excluded' && account.included) continue;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) continue;

    fragment.appendChild(createAccountRowElement(account));
  }

  reviewTableBody.appendChild(fragment);
  updateMasterCheckbox(getVisibleAccounts());
  refreshBulkActionBar();
  toggleDisabled(importBtn, !accounts.some(isIncludedAndUnprocessed));
  importBtn.title = importBtn.disabled ? 'At least one account must be included to proceed' : '';
  renderButtons();
}

function isIncludedAndUnprocessed(account) {
  return account.included && account.status !== 'processed';
}

function createAccountRowElement(account) {
  const row = document.createElement('tr');
  row.className = 'border-t border-[#dce1e5]';

  const isProcessed = account.status === 'processed';
  const isFailed = account.status === 'failed';

  // Account checkbox cell
  const checkboxTd = document.createElement('td');
  checkboxTd.className = 'px-2 py-2 text-center';
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  const checkboxId = `account-checkbox-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  checkbox.id = checkboxId;
  checkbox.name = checkboxId;
  checkbox.setAttribute('aria-label', `Select account: ${account.modifiedName}`);
  checkbox.className = 'w-5 h-5';
  toggleDisabled(checkbox, isProcessed);
  checkbox.checked = account.selected;
  checkbox.addEventListener('change', () => {
    account.selected = checkbox.checked;
    refreshBulkActionBar();
    updateMasterCheckbox(getVisibleAccounts());
  });
  checkboxTd.appendChild(checkbox);
  row.appendChild(checkboxTd);

  // Account name cell
  const nameTd = document.createElement('td');
  nameTd.className = 'px-2 py-2 max-w-[300px] truncate';
  nameTd.textContent = account.modifiedName;
  if (!isProcessed) {
    nameTd.classList.add('cursor-pointer');
    nameTd.title = `Click to rename '${account.modifiedName}'`;
    nameTd.addEventListener('click', () => openNameEditor(account, nameTd));
  } else {
    nameTd.classList.add('text-gray-400', 'cursor-default');
  }
  row.appendChild(nameTd);

  // Account Type cell
  const typeTd = document.createElement('td');
  typeTd.className = 'px-2 py-2';
  const typeSelect = document.createElement('select');
  const typeId = `type-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  typeSelect.id = typeId;
  typeSelect.name = typeId;
  typeSelect.title = getAccountTypeByName(account.type)?.typeDisplay || '';
  typeSelect.className = 'border rounded px-2 py-1 w-full';
  typeSelect.disabled = isProcessed;
  if (isProcessed) typeSelect.classList.add('text-gray-300', 'cursor-default');
  else typeSelect.classList.add('cursor-pointer');
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeName;
    opt.textContent = type.typeDisplay;
    if (type.typeName === account.type) opt.selected = true;
    typeSelect.appendChild(opt);
  });
  typeSelect.addEventListener('change', () => {
    account.type = typeSelect.value;
    const selectedType = getAccountTypeByName(account.type);
    account.subtype = selectedType?.subtypes[0]?.name || null;
    renderAccountTable();
  });
  typeTd.appendChild(typeSelect);
  row.appendChild(typeTd);

  // Account Subtype cell
  const subtypeTd = document.createElement('td');
  subtypeTd.className = 'px-2 py-2';
  const subtypeSelect = document.createElement('select');
  const subtypeId = `subtype-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  subtypeSelect.id = subtypeId;
  subtypeSelect.name = subtypeId;
  subtypeSelect.className = 'border rounded px-2 py-1 w-full';
  subtypeSelect.disabled = isProcessed;
  if (isProcessed) subtypeSelect.classList.add('text-gray-300', 'cursor-default');
  else subtypeSelect.classList.add('cursor-pointer');
  const selectedType = getAccountTypeByName(account.type);
  subtypeSelect.title = getSubtypeByName(account.type, account.subtype)?.display || '';
  (selectedType?.subtypes || []).forEach(sub => {
    const opt = document.createElement('option');
    opt.value = sub.name;
    opt.textContent = sub.display;
    if (sub.name === account.subtype) opt.selected = true;
    subtypeSelect.appendChild(opt);
  });
  subtypeSelect.addEventListener('change', () => {
    account.subtype = subtypeSelect.value;
    renderAccountTable();
  });
  subtypeTd.appendChild(subtypeSelect);
  row.appendChild(subtypeTd);

  // Account Transaction Count cell
  const txTd = document.createElement('td');
  txTd.className = 'px-2 py-2 text-center cursor-default';
  txTd.textContent = account.transactionCount;
  txTd.title = `${account.transactionCount} transaction${account.transactionCount !== 1 ? 's' : ''}`;
  if (isProcessed) txTd.classList.add('text-gray-400');
  row.appendChild(txTd);

  // Account Balance cell
  const balanceTd = document.createElement('td');
  balanceTd.className = 'px-2 py-2 text-[#637988] cursor-default';
  balanceTd.textContent = currencyFormatter.format(account.balance);
  balanceTd.title = `Balance: ${currencyFormatter.format(account.balance)}`;
  if (isProcessed) balanceTd.classList.add('text-gray-400');
  row.appendChild(balanceTd);

  // Account Include/Exclude cell
  const includeTd = document.createElement('td');
  includeTd.className = 'px-2 py-2 flex items-center gap-2';
  const toggleBtn = document.createElement('button');
  toggleBtn.classList.add('ui-button');
  toggleBtn.dataset.type = account.included ? 'primary' : 'secondary';
  toggleBtn.dataset.size = 'small';
  toggleBtn.textContent = isProcessed ? 'Processed' : (account.included ? 'Included' : 'Excluded');
  toggleBtn.disabled = isProcessed;
  toggleBtn.title = isProcessed ? 'This account has already been processed' : (account.included ? 'Click to exclude this account' : 'Click to include this account');
  if (!isProcessed) {
    toggleBtn.addEventListener('click', () => {
      account.included = !account.included;
      renderAccountTable();
    });
  }
  includeTd.appendChild(toggleBtn);

  if (isFailed) {
    const errorIcon = document.createElement('span');
    errorIcon.className = 'text-red-600 text-xl cursor-default';
    errorIcon.innerHTML = '⚠️';
    errorIcon.title = 'Previously failed to process';
    includeTd.appendChild(errorIcon);
  }

  row.appendChild(includeTd);
  return row;
}

function updateMasterCheckbox(visibleAccounts) {
  const masterCheckbox = document.getElementById('masterCheckbox');
  const selectedCount = visibleAccounts.filter(acc => acc.selected).length;
  masterCheckbox.checked = selectedCount > 0 && selectedCount === visibleAccounts.length;
  masterCheckbox.indeterminate = selectedCount > 0 && selectedCount < visibleAccounts.length;
}

function getVisibleAccounts() {
  return Object.values(state.accounts).filter(account => {
    if (account.status === 'processed') return false;
    if (currentFilter === 'included' && !account.included) return false;
    if (currentFilter === 'excluded' && account.included) return false;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) return false;
    return true;
  });
}

function masterCheckboxChange(e) {
  const checked = e.target.checked;
  getVisibleAccounts().forEach(acc => {
    acc.selected = checked;
  });
  renderAccountTable();
}

function refreshBulkActionBar() {
  const bar = document.getElementById('bulkActionBar');
  const countSpan = document.getElementById('selectedCount');
  const selectedCount = Object.values(state.accounts).filter(acc => acc.selected).length;
  countSpan.textContent = selectedCount;
  toggleElementVisible(bar, selectedCount > 0);
}

function openNameEditor(account, nameCell) {
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
    nameCell.textContent = account.modifiedName;
    nameCell.title = `Click to rename '${account.modifiedName}'`;
    closeEditor();
  }
}

function openBulkRenameModal() {
  const modal = document.getElementById('bulkRenameModal');
  const renamePattern = document.getElementById('renamePattern');
  const indexStartInput = document.getElementById('indexStart');
  const previewDiv = document.getElementById('renamePreview');
  const cancelBtn = document.getElementById('renameCancel');
  const applyBtn = document.getElementById('renameApply');
  const tokenButtons = modal.querySelectorAll('.token-btn');

  modal.classList.remove('hidden');
  renamePattern.focus();

  const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);

  // Token insert handlers
  tokenButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const token = btn.dataset.token;
      renamePattern.value += token;
      updatePreview();
    });
  });

  // Live preview
  renamePattern.addEventListener('input', updatePreview);
  indexStartInput.addEventListener('input', updatePreview);

  updatePreview();

  function updatePreview() {
    previewDiv.innerHTML = '';

    const pattern = renamePattern.value;
    const indexStart = parseInt(indexStartInput.value, 10) || 1;

    selectedAccounts.slice(0, 3).forEach((acc, i) => {
      const previewName = applyPattern(pattern, acc, i + indexStart);
      const div = document.createElement('div');
      div.textContent = previewName;
      previewDiv.appendChild(div);
    });
  }

  cancelBtn.onclick = () => modal.classList.add('hidden');

  applyBtn.onclick = () => {
    const pattern = renamePattern.value;
    const indexStart = parseInt(indexStartInput.value, 10) || 1;

    selectedAccounts.forEach((acc, i) => {
      acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
    });

    modal.classList.add('hidden');
    renderAccountTable();
  };
}

function applyPattern(pattern, account, index) {
  const today = new Date().toISOString().split('T')[0];
  return pattern
    .replace(/{{YNAB}}/g, account.originalYnabName?.trim() || account.name || 'Account')
    .replace(/{{Index}}/g, index)
    .replace(/{{Upper}}/g, (account.originalYnabName?.trim() || account.name || 'Account').toUpperCase())
    .replace(/{{Date}}/g, today);
}

function openBulkTypeModal() {
  const modal = document.getElementById('bulkTypeModal');
  const typeSelect = document.getElementById('bulkTypeSelect');
  const subtypeSelect = document.getElementById('bulkSubtypeSelect');
  const cancelBtn = document.getElementById('bulkTypeCancel');
  const applyBtn = document.getElementById('bulkTypeApply');

  modal.classList.remove('hidden');

  // Populate Type dropdown
  typeSelect.innerHTML = '';
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeName;
    opt.textContent = type.typeDisplay;
    typeSelect.appendChild(opt);
  });

  // On type change, repopulate subtype dropdown
  function updateSubtypeOptions() {
    const selectedType = getAccountTypeByName(typeSelect.value);
    subtypeSelect.innerHTML = '';

    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      subtypeSelect.appendChild(opt);
    });

    // If no subtypes available, add default empty option
    if ((selectedType?.subtypes || []).length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '-';
      subtypeSelect.appendChild(opt);
    }
  }

  typeSelect.addEventListener('change', updateSubtypeOptions);
  updateSubtypeOptions();

  cancelBtn.onclick = () => modal.classList.add('hidden');

  applyBtn.onclick = () => {
    const typeValue = typeSelect.value;
    const subtypeValue = subtypeSelect.value;

    const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);
    selectedAccounts.forEach(acc => {
      acc.type = typeValue;
      acc.subtype = subtypeValue || null;
    });

    modal.classList.add('hidden');
    renderAccountTable();
  };
}
