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
import { chunkArray } from '../../utils/array.js';

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
    // Table elements
    dataTableBody: $('dataTableBody'),
    statusMsg: $('statusMsg'),
    lastSynced: $('lastSynced'),
    refreshBtn: $('refreshBtn'),
    masterCheckbox: $('masterCheckbox'),
    searchInput: $('searchInput'),
    importBtn: $('importBtn'),
    selectedCount: $('selectedCount'),
    filterAllBtn: $('filterAll'),
    filterUnchangedBtn: $('filterUnchanged'),
    filterModifiedBtn: $('filterModified'),
    filterDeletedBtn: $('filterDeleted'),

    // Action bar elements
    bulkActionBar: $('bulkActionBar'),
    unselectAllBtn: $('unselectAllBtn'),
    bulkRenameBtn: $('bulkRenameBtn'),
    bulkTypeBtn: $('bulkTypeBtn'),
    bulkResetBtn: $('bulkResetBtn'),
    bulkDeleteBtn: $('bulkDeleteBtn'),

    // Bulk rename modal elements
    bulkRenameModal: $('bulkRenameModal'),
    renamePattern: $('renamePattern'),
    renamePreview: $('renamePreview'),
    renameCancel: $('renameCancel'),
    renameApply: $('renameApply'),

    // Bulk type modal elements
    bulkTypeModal: $('bulkTypeModal'),
    bulkTypeSelect: $('bulkTypeSelect'),
    bulkSubtypeSelect: $('bulkSubtypeSelect'),
    bulkTypeCancel: $('bulkTypeCancel'),
    bulkTypeApply: $('bulkTypeApply'),

    // Processing modal
    processingModal: $('processingModal'),
    progressBar: $('progressBar'),
    progressCounters: $('progressCounters'),
    closeProcessingBtnContainer: $('closeProcessingBtnContainer'),
    closeProcessingBtn: $('closeProcessingBtn'),
  };

  UI.filterAllBtn.classList.add('bg-blue-500', 'text-white');

  // Bulk action bar listeners
  UI.unselectAllBtn.addEventListener('click', () => updateSelection(false));
  UI.bulkResetBtn.addEventListener('click', handleBulkReset)
  UI.bulkDeleteBtn.addEventListener('click', handleBulkDeleteClick);
  UI.bulkRenameBtn.addEventListener('click', openBulkRenameModal);
  UI.bulkTypeBtn.addEventListener('click', openBulkTypeModal);

  // Master checkbox listener
  UI.masterCheckbox.addEventListener('change', masterCheckboxChange);

  UI.closeProcessingBtn.addEventListener('click', () => {
    UI.processingModal.classList.add('hidden');
  })

  // Navigation listeners
  UI.importBtn.addEventListener('click', async () => {
    const token = state.credentials.apiToken || getLocalStorage().token;
    UI.processingModal.classList.remove('hidden');
    UI.closeProcessingBtnContainer.classList.add('hidden');

    // Filter accounts to delete and modify
    const toDelete = accounts.filter(a => a.shouldDelete);
    const toModify = accounts.filter(a => a.isModified && !a.shouldDelete);
    // Total counts and progress tracking
    const totalDel = toDelete.length
    const totalMod = toModify.length
    const total = totalDel + totalMod;
    const failDel = [], failMod = [];
    const succDel = [], succMod = [];

    function updateProgress() {
      const done = failDel.length + failMod.length + succDel.length + succMod.length;
      const percentDone = Math.round(done / total * 100);
      UI.progressBar.style.width = `${percentDone}%`;
      UI.progressBar.textContent = `${percentDone}%`;
      UI.progressCounters.innerHTML =
        `<p>Modifications: ${succMod.length} of ${totalMod}</p>` +
        `<p>Deletions:   ${succDel.length} of ${totalDel}</p>` +
        `<p>Failures — Modifications: ${failMod.length}, Deletions: ${failDel.length}</p>`;
    }

    // process batches of deletions
    for (const batch of chunkArray(toDelete, 3)) {
      await Promise.all(batch.map(async acc => {
        try {
          const res = await monarchApi.deleteAccount(token, acc.id);
          if (res.success) succDel.push(acc);
          else failDel.push(acc);
        } catch { failDel.push(acc) }
      }));
      console.log("Successfully deleted accounts:", succDel);
      console.log("Failed to delete accounts:", failDel);
      updateProgress();
      await new Promise(r => setTimeout(r, 2000));
    }

    // process batches of modifications
    for (const batch of chunkArray(toModify, 3)) {
      await Promise.all(batch.map(async acc => {
        try {
          const res = await monarchApi.patchAccount(token, acc);
          if (res.success) succMod.push(acc);
          else failMod.push(acc);
        } catch { failMod.push(acc) }
      }));
      console.log("Successfully modified accounts:", succMod);
      console.log("Failed to modify accounts:", failMod);
      updateProgress();
      await new Promise(r => setTimeout(r, 2000));
    }

    // update cache: remove successes, mark failures
    failDel.forEach(acc => acc.isFailed = true);
    failMod.forEach(acc => acc.isFailed = true);
    accounts = accounts.filter(account => !(account.shouldDelete && !account.isFailed))

    console.log("Final accounts after processing:", accounts);
    saveAccountsToCache(accounts);
    UI.closeProcessingBtnContainer.classList.remove('hidden');
    renderAccountTable(accounts);
  });

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
  ['all', 'unchanged', 'modified', 'deleted'].forEach(filter => {
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



async function handleModifyingAccounts(token, accounts) {
  console.log("Modifying accounts:", accounts);
  const successes = [];
  const failures = [];

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    UI.statusMsg.textContent = `Processing batch ${i + 1} of ${batches.length} (${batch.length} accounts)...`;
    // Execute concurrent API calls
    await Promise.all(batch.map(async account => {
      try {
        const res = await monarchApi.patchAccount(token, account);
        if (res.success) {
          successes.push(account);
        } else {
          failures.push({ account, error: res.error || 'Unknown error' });
        }
      } catch (err) {
        failures.push({ account, error: err.message });
      }
    }));

    // Delay before next batch
    if (i < batches.length - 1) {
      UI.statusMsg.textContent += ' Preparing...';
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  // Update cache by removing successes
  successes.forEach(account => {
    accounts = accounts.filter(acc => acc.id !== account.id);
  });

  // Summary and re-render
  UI.statusMsg.textContent = `Applying changes complete: ${successes.length} succeeded, ${failures.length} failed.`;
  if (failures.length > 0) console.error('Update failures:', failures);
  renderAccountTable(accounts);
  toggleDisabled(UI.bulkDeleteBtn, false);
  toggleDisabled(UI.refreshBtn, false);
}

async function handleDeletingAccounts(token, accounts) {
  console.log("Deleting accounts:", accounts);
  const successes = [];
  const failures = [];

  // Execute concurrent deletions
  await Promise.all(accounts.map(async account => {
    try {
      const res = await monarchApi.deleteAccount(token, account.id);
      if (res.success) {
        successes.push(account);
      } else {
        failures.push({ account, error: res.error || 'Unknown error' });
      }
    } catch (err) {
      failures.push({ account, error: err.message });
    }
  }))

  return {
    successes,
    failures,
  }
}

async function handleApplyChanges(token) {
  UI.processingModal.classList.remove('hidden');

  const toDelete = accounts.filter(a => a.shouldDelete);
  const toModify = accounts.filter(a => a.isModified && !a.shouldDelete);
  const total = toDelete.length + toModify.length
  let doneDel = 0, doneMod = 0;
  const successfullyModifiedAccounts = [];
  const failedToModifyAccounts = [];
  const successfullyDeletedAccounts = [];
  const failedToDeleteAccounts = [];

  console.log(`Processing ${total} accounts: ${toModify.length} to modify, ${toDelete.length} to delete.`);

  const updateProgress = () => {
    const done = doneDel + doneMod;
    const pct = total ? Math.round(done / total * 100) : 100;
    UI.progressBar.style.width = `${pct}%`;
    UI.progressBar.textContent = `${pct}%`;
    UI.progressCounters.innerHTML =
      `<p>Modifying accounts: ${doneMod} of ${totalMod}</p>` +
      `<p>Deleting accounts: ${doneDel} of ${totalDel}</p>`;
  };


  const toDeleteBatches = chunkArray(toDelete, 3);
  const toModifyBatches = chunkArray(toModify, 3);

  for (let i = 0; i < toDeleteBatches.length; i++) {
    const batch = toDeleteBatches[i];
    const { successes, failures } = await handleDeletingAccounts(token, batch)
    successfullyDeletedAccounts.push(...successes);
    doneDel += successes.length;
    updateProgress();
    failedToDeleteAccounts.push(...failures);

    // Delay before next batch
    if (i < toDeleteBatches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  for (let i = 0; i < toModifyBatches.length; i++) {
    const batch = toModifyBatches[i];
    const { successes, failures } = await handleModifyingAccounts(token, batch)
    successfullyModifiedAccounts.push(...successes);
    doneMod += successes.length;
    updateProgress();
    failedToModifyAccounts.push(...failures);

    // Delay before next batch
    if (i < toModifyBatches.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  if (failedToDeleteAccounts.length > 0 || failedToModifyAccounts.length > 0) {
    console.error('Deletion failures:', failedToDeleteAccounts);
    console.error('Modifying failures:', failedToModifyAccounts);
  } else {
    renderAccountTable(accounts);
    UI.processingModal.classList.add('hidden');
    await syncAccounts(token);
  }
}

function handleBulkReset() {
  Object.values(accounts).forEach(acc => {
    if (acc.isSelected) {
      acc.modifiedName = acc.originalName;
      acc.type = acc.originalType;
      acc.subtype = acc.originalSubtype;
      acc.isModified = false;
      acc.shouldDelete = false;
      acc.isFailed = false
    }
  });
  renderAccountTable(accounts);
}

function handleBulkDeleteClick() {
  Object.values(accounts).forEach(acc => {
    if (acc.isSelected) acc.shouldDelete = true;
  });
  renderAccountTable(accounts);
}

async function syncAccounts(token) {
  // TODO: Check against stored accounts, and merge changes if any
  try {
    UI.statusMsg.textContent = 'Fetching accounts from Monarch...';
    const data = await monarchApi.fetchAccounts(token);

    accounts = data.accounts.map(account => ({
      ...account,
      originalName: account.displayName,
      modifiedName: account.displayName,
      balance: account.displayBalance || 0,
      originalType: account.type,
      type: account.type,
      originalSubtype: account.subtype,
      subtype: account.subtype,
      isProcessed: false,
      isFailed: false,
      isSelected: false,
      isIncluded: true,
      shouldDelete: false,
      isModified: false,
      status: 'unprocessed',
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
    if (currentFilter === 'unchanged' && (account.isModified || account.shouldDelete)) continue;
    if (currentFilter === 'modified' && (!account.isModified || account.shouldDelete)) continue;
    if (currentFilter === 'deleted' && !account.shouldDelete) continue;
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) continue;

    const rowElement = createAccountRowElement(account, {
      showCheckbox: true,
      onCheckboxClick: handleCheckboxClick,
      onNameClick: handleNameClick,
      onTypeChange: handleTypeChange,
      onSubtypeChange: handleSubtypeChange
    })
    fragment.appendChild(rowElement);
  }

  UI.dataTableBody.appendChild(fragment);
  updateMasterCheckbox(getVisibleAccounts());
  updateBulkActionBar('bulkActionBar', accounts.filter(acc => acc.isSelected).length);
  toggleDisabled(importBtn, !accounts.some(acc => (acc.isModified || acc.shouldDelete) && acc.status !== 'processed'));
  UI.importBtn.title = UI.importBtn.disabled ? 'At least one account must be modified to proceed' : '';
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
  Object.values(accounts).filter(account => account.isSelected).slice(0, 3).forEach((account) => {
    const previewName = applyPattern(pattern, account);
    const div = document.createElement('div');
    div.textContent = previewName;
    UI.renamePreview.appendChild(div);
  });
}

function masterCheckboxChange(e) {
  const checked = e.target.checked;
  getVisibleAccounts().forEach(acc => {
    acc.isSelected = checked;
  });
  renderAccountTable(accounts);
}

function handleCheckboxClick(account, checkboxElement) {
  account.isSelected = checkboxElement.checked;
  refreshBulkActionBar();
  updateMasterCheckbox(getVisibleAccounts());
}

function updateMasterCheckbox(visibleAccounts) {
  const selectedCount = visibleAccounts.filter(acc => acc.isSelected).length;
  UI.masterCheckbox.checked = selectedCount > 0 && selectedCount === visibleAccounts.length;
  UI.masterCheckbox.indeterminate = selectedCount > 0 && selectedCount < visibleAccounts.length;
  refreshBulkActionBar();
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
  if (account.originalType.display !== account.type.display) {
    account.isModified = true;
  }
  renderAccountTable(accounts);
}

function handleSubtypeChange(account, newSubtype) {
  const selectedSubtype = getSubtypeByDisplayName(account.type.display, newSubtype);
  account.subtype = {
    display: selectedSubtype.display,
    name: selectedSubtype.name,
  }
  if (account.originalSubtype.display !== account.subtype.display) {
    account.isModified = true;
  }
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
    account.isModified = true;
    nameElement.title = `Click to rename '${account.modifiedName}'`;
    closeEditor();
    renderAccountTable(accounts);
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

  // live preview
  UI.renamePattern.addEventListener('input', () => updatePreview(selectedAccounts));
  updatePreview(selectedAccounts);

  UI.renameCancel.onclick = () => UI.bulkRenameModal.classList.add('hidden');
  UI.renameApply.onclick = () => {
    const pattern = UI.renamePattern.value;
    selectedAccounts.forEach((account) => {
      account.modifiedName = applyPattern(pattern, account);
      if (account.modifiedName !== account.originalName) {
        account.isModified = true;
      }
    });
    UI.bulkRenameModal.classList.add('hidden');
    renderAccountTable(accounts);
  };
}

function applyPattern(pattern, account) {
  // resolve tokens first
  let input = pattern.replace(/{{name}}/g, account.modifiedName);

  // find all function calls
  const calls = input.match(/(replaceAll?|replace?|substring)\([^)]*\)/g) || [];
  let result = '';

  calls.forEach(call => {
    if (call.startsWith('replaceAll(')) {
      const args = call.match(/replaceAll\('([^']*)','([^']*)','([^']*)'\)/);
      if (args) {
        const [, src, search, repl] = args;
        result = src.replace(new RegExp(search, 'g'), repl);
      }
    }
    else if (call.startsWith('replace(')) {
      const args = call.match(/replace\('([^']*)','([^']*)','([^']*)'\)/);
      if (args) {
        const [, src, search, repl] = args;
        result = src.replace(new RegExp(search), repl);
      }
    }
    else if (call.startsWith('substring(')) {
      const args = call.match(/substring\('([^']*)',(\d+),(\d+)\)/);
      if (args) {
        const [, src, start, end] = args;
        result = src.substring(Number(start), Number(end));
      }
    }
  });

  // if no calls, just return resolved pattern
  return calls.length ? result : input;
}

function openBulkTypeModal() {
  UI.bulkTypeModal.classList.remove('hidden');

  // Populate Type dropdown
  UI.bulkTypeSelect.innerHTML = '';
  monarchAccountTypes.data.forEach(type => {
    const opt = document.createElement('option');
    opt.value = type.typeDisplay;
    opt.textContent = type.typeDisplay;
    UI.bulkTypeSelect.appendChild(opt);
  });

  // On type change, repopulate subtype dropdown
  function updateSubtypeOptions() {
    const selectedType = getAccountTypeByDisplayName(UI.bulkTypeSelect.value);
    UI.bulkSubtypeSelect.innerHTML = '';

    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.display;
      opt.textContent = sub.display;
      UI.bulkSubtypeSelect.appendChild(opt);
    });
  }

  UI.bulkTypeSelect.addEventListener('change', updateSubtypeOptions);
  updateSubtypeOptions();

  UI.bulkTypeCancel.onclick = () => UI.bulkTypeModal.classList.add('hidden');
  UI.bulkTypeApply.onclick = () => {
    const newType = getAccountTypeByDisplayName(UI.bulkTypeSelect.value);
    const newSubtype = getSubtypeByDisplayName(newType.typeDisplay, UI.bulkSubtypeSelect.value);
    const selectedAccounts = Object.values(accounts).filter(acc => acc.isSelected);
    selectedAccounts.forEach(acc => {
      acc.type = {
        display: newType.typeDisplay,
        name: newType.typeName,
      };
      acc.subtype = {
        display: newSubtype.display,
        name: newSubtype.name,
      };
      acc.isModified = true;
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
