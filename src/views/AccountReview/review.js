import state from '../../state.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { navigate, persistState, goBack } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { updateNavigationTexts } from '../../utils/navigation.js';
import { createNavigationBar } from '../../utils/navigationBar.js';
import { capitalize } from '../../utils/string.js';
import { currencyFormatter } from '../../utils/format.js';
import { getAccountTypeByName, getSubtypeByName } from '../../utils/accountTypeUtils.js';
import { toggleDisabled } from '../../utils/dom.js';

let reviewTableBody, mobileAccountList, importBtn, searchInput;
let activeFilters = {
  accountName: '',
  nameMatchType: 'contains',
  nameCaseSensitive: false,
  types: new Set(),
  subtypes: new Set(),
  transactionsMin: null,
  transactionsMax: null,
  balanceMin: null,
  balanceMax: null,
  inclusion: 'all'
};
let searchQuery = '';

export default function initAccountReviewView() {
  // Redirect to upload if no accounts are available
  if (!state.accounts || Object.keys(state.accounts).length === 0) {
    navigate('/upload', true);
    return;
  }

  // Add navigation bar at the bottom of the content
  const mainContainer = document.querySelector('.flex.flex-col.max-w-7xl');
  const navigationConfig = {
    backText: "Back",
    showBack: true,
    showNext: true,
    nextText: "Continue", 
    nextId: "continueBtn",
    nextType: "primary"
  };
  mainContainer.insertAdjacentHTML('beforeend', createNavigationBar(navigationConfig));

  reviewTableBody = document.getElementById('reviewTableBody');
  mobileAccountList = document.getElementById('mobileAccountList');
  importBtn = document.getElementById('continueBtn');
  searchInput = document.getElementById('searchInput');

  renderButtons();
  updateNavigationTexts();
  renderAccountTable(); // Initialize the table/mobile view

  // Initialize filters modal after a brief delay to ensure DOM is ready
  setTimeout(() => {
    initializeFiltersModal();
    // Initial account count display
    const totalAccounts = Object.keys(state.accounts).length;
    updateAccountCountDisplay(totalAccounts, totalAccounts);
  }, 100);

  // Search listener
  let debounceTimer;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      searchQuery = searchInput.value.toLowerCase();
      renderAccountTable();
      persistState();
    }, 200);
  });

  // Filter modal listeners - use timeout to ensure DOM is ready
  setTimeout(() => {
    const filtersBtn = document.getElementById('filtersBtn');
    if (filtersBtn) {
      console.log('Adding click listener to filters button');
      filtersBtn.addEventListener('click', (e) => {
        console.log('Filters button clicked!');
        e.preventDefault();
        openFiltersModal();
      });
    } else {
      console.error('Filters button not found!');
    }
    
    const filtersModalClose = document.getElementById('filtersModalClose');
    if (filtersModalClose) {
      filtersModalClose.addEventListener('click', closeFiltersModal);
    }
    
    const filtersApply = document.getElementById('filtersApply');
    if (filtersApply) {
      filtersApply.addEventListener('click', applyFilters);
    }
    
    const filtersReset = document.getElementById('filtersReset');
    if (filtersReset) {
      filtersReset.addEventListener('click', resetFilters);
    }
    
    const clearAllFilters = document.getElementById('clearAllFilters');
    if (clearAllFilters) {
      clearAllFilters.addEventListener('click', clearAllFilters);
    }
    
    // Close modal when clicking outside
    const filtersModal = document.getElementById('filtersModal');
    if (filtersModal) {
      filtersModal.addEventListener('click', (e) => {
        if (e.target.id === 'filtersModal') {
          closeFiltersModal();
        }
      });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && filtersModal && !filtersModal.classList.contains('hidden')) {
        closeFiltersModal();
      }
    });
    
    // Quick clear filters button (new clear button)
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
        // Close modal if it's open
        closeFiltersModal();
      });
    }
  }, 100);

  // Bulk action bar listeners
  document.getElementById('unselectAllBtnMobile').addEventListener('click', () => updateSelection(false));
  document.getElementById('unselectAllBtnDesktop').addEventListener('click', () => updateSelection(false));
  document.getElementById('bulkIncludeBtnMobile').addEventListener('click', () => updateInclusion(true));
  document.getElementById('bulkIncludeBtnDesktop').addEventListener('click', () => updateInclusion(true));
  document.getElementById('bulkExcludeBtnMobile').addEventListener('click', () => updateInclusion(false));
  document.getElementById('bulkExcludeBtnDesktop').addEventListener('click', () => updateInclusion(false));
  document.getElementById('bulkRenameBtnMobile').addEventListener('click', openBulkRenameModal);
  document.getElementById('bulkRenameBtnDesktop').addEventListener('click', openBulkRenameModal);
  document.getElementById('bulkTypeBtnMobile').addEventListener('click', openBulkTypeModal);
  document.getElementById('bulkTypeBtnDesktop').addEventListener('click', openBulkTypeModal);

  // Master checkbox listener
  document.getElementById('masterCheckbox').addEventListener('change', masterCheckboxChange);
  
  // Mobile master checkbox listener
  const masterCheckboxMobile = document.getElementById('masterCheckboxMobile');
  if (masterCheckboxMobile) {
    masterCheckboxMobile.addEventListener('change', masterCheckboxChange);
  }

  // Navigation listeners
  document.getElementById('continueBtn').addEventListener('click', () => navigate('/method'));
  document.getElementById('backBtn').addEventListener('click', () => goBack());

  renderAccountTable();
}

function updateSelection(shouldSelect) {
  Object.values(state.accounts).forEach(acc => {
    if (acc.status !== 'processed') acc.selected = shouldSelect;
  });
  persistState();
  renderAccountTable();
}

function updateInclusion(include) {
  Object.values(state.accounts).forEach(acc => {
    if (acc.selected) acc.included = include;
  });
  persistState();
  renderAccountTable();
}

function renderAccountTable() {
  const fragment = document.createDocumentFragment();
  const mobileFragment = document.createDocumentFragment();
  const accounts = Object.values(state.accounts);
  let visibleCount = 0;
  
  // Clear both desktop and mobile views
  reviewTableBody.innerHTML = '';
  if (mobileAccountList) mobileAccountList.innerHTML = '';

  for (const account of accounts) {
    // Apply advanced filters
    if (!passesFilters(account)) continue;
    
    // Apply search query
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) continue;

    visibleCount++;

    // Create desktop table row
    fragment.appendChild(createAccountRowElement(account));
    
    // Create mobile card
    if (mobileAccountList) {
      mobileFragment.appendChild(createMobileAccountCard(account));
    }
  }

  reviewTableBody.appendChild(fragment);
  if (mobileAccountList) {
    mobileAccountList.appendChild(mobileFragment);
  }
  
  // Update account count indicators
  updateAccountCountDisplay(visibleCount, accounts.length);
  
  updateMasterCheckbox(getVisibleAccounts());
  refreshBulkActionBar();
  updateMobileSelectionCount();
  
  // Update continue button with included account count
  const includedCount = accounts.filter(isIncludedAndUnprocessed).length;
  const hasIncludedAccounts = includedCount > 0;
  
  toggleDisabled(importBtn, !hasIncludedAccounts);
  importBtn.title = importBtn.disabled ? 'At least one account must be included to proceed' : '';
  
  // Update button text to show included account count
  if (hasIncludedAccounts) {
    importBtn.textContent = `Continue with ${includedCount} account${includedCount !== 1 ? 's' : ''}`;
  } else {
    importBtn.textContent = 'Continue';
  }
  
  renderButtons();
}

function isIncludedAndUnprocessed(account) {
  return account.included && account.status !== 'processed';
}

function createAccountRowElement(account) {
  const row = document.createElement('tr');
  row.setAttribute('role', 'row');
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
      persistState();
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

function createMobileAccountCard(account) {
  const card = document.createElement('div');
  card.className = 'mobile-account-card';

  const isProcessed = account.status === 'processed';
  const isFailed = account.status === 'failed';

  // Custom checkbox container
  const checkboxContainer = document.createElement('label');
  checkboxContainer.className = 'custom-checkbox-container flex-shrink-0';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'custom-checkbox-input';
  const checkboxId = `mobile-account-checkbox-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  checkbox.id = checkboxId;
  checkbox.name = checkboxId;
  checkbox.setAttribute('aria-label', `Select account: ${account.modifiedName}`);
  checkbox.disabled = isProcessed;
  checkbox.checked = account.selected || false;
  checkbox.addEventListener('change', () => {
    account.selected = checkbox.checked;
    persistState();
    refreshBulkActionBar();
    updateMasterCheckbox(getVisibleAccounts());
    updateMobileSelectionCount();
  });

  const checkboxVisual = document.createElement('span');
  checkboxVisual.className = 'custom-checkbox-visual';

  checkboxContainer.appendChild(checkbox);
  checkboxContainer.appendChild(checkboxVisual);
  card.appendChild(checkboxContainer);

  // Card content container
  const contentDiv = document.createElement('div');
  contentDiv.className = 'card-content';

  // Account name
  const nameDiv = document.createElement('div');
  nameDiv.className = 'account-name';
  nameDiv.textContent = account.modifiedName;
  if (!isProcessed) {
    nameDiv.classList.add('cursor-pointer', 'hover:text-blue-600', 'transition-colors', 'duration-200');
    nameDiv.title = `Click to rename '${account.modifiedName}'`;
    nameDiv.addEventListener('click', () => openNameEditor(account, nameDiv));
  } else {
    nameDiv.classList.add('text-gray-400', 'cursor-default');
  }
  contentDiv.appendChild(nameDiv);

  // Account details container
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'account-details';

  // Type and subtype row
  const typeRow = document.createElement('div');
  typeRow.className = 'flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-4';

  // Type selection
  const typeContainer = document.createElement('div');
  typeContainer.className = 'flex items-center gap-2 flex-1 min-w-0';
  
  const typeLabel = document.createElement('span');
  typeLabel.textContent = 'Type:';
  typeLabel.className = 'text-xs font-medium text-gray-500 flex-shrink-0';
  
  const typeSelect = document.createElement('select');
  const typeId = `mobile-type-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  typeSelect.id = typeId;
  typeSelect.name = typeId;
  typeSelect.title = getAccountTypeByName(account.type)?.typeDisplay || '';
  typeSelect.className = 'border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';
  typeSelect.disabled = isProcessed;
  if (isProcessed) typeSelect.classList.add('text-gray-300', 'bg-gray-50', 'cursor-not-allowed');
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

  typeContainer.appendChild(typeLabel);
  typeContainer.appendChild(typeSelect);
  typeRow.appendChild(typeContainer);

  // Subtype selection
  const subtypeContainer = document.createElement('div');
  subtypeContainer.className = 'flex items-center gap-2 flex-1 min-w-0';
  
  const subtypeLabel = document.createElement('span');
  subtypeLabel.textContent = 'Sub:';
  subtypeLabel.className = 'text-xs font-medium text-gray-500 flex-shrink-0';
  
  const subtypeSelect = document.createElement('select');
  const subtypeId = `mobile-subtype-select-${account.id || account.modifiedName.replace(/\s+/g, '-')}`;
  subtypeSelect.id = subtypeId;
  subtypeSelect.name = subtypeId;
  subtypeSelect.className = 'border border-gray-300 rounded-lg px-2 py-1 text-xs flex-1 min-w-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';
  subtypeSelect.disabled = isProcessed;
  if (isProcessed) subtypeSelect.classList.add('text-gray-300', 'bg-gray-50', 'cursor-not-allowed');
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

  subtypeContainer.appendChild(subtypeLabel);
  subtypeContainer.appendChild(subtypeSelect);
  typeRow.appendChild(subtypeContainer);

  detailsDiv.appendChild(typeRow);

  // Statistics row
  const statsRow = document.createElement('div');
  statsRow.className = 'flex justify-between items-center';
  
  const transactionInfo = document.createElement('span');
  transactionInfo.className = isProcessed ? 'text-gray-400' : 'text-gray-600';
  transactionInfo.textContent = `${account.transactionCount} transaction${account.transactionCount !== 1 ? 's' : ''}`;
  
  const balanceInfo = document.createElement('span');
  balanceInfo.className = `account-balance ${isProcessed ? 'text-gray-400' : 'text-gray-900'}`;
  balanceInfo.textContent = currencyFormatter.format(account.balance);
  
  statsRow.appendChild(transactionInfo);
  statsRow.appendChild(balanceInfo);
  detailsDiv.appendChild(statsRow);

  // Status and action row
  const actionRow = document.createElement('div');
  actionRow.className = 'flex items-center justify-end pt-1';
  
  if (!isProcessed) {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = `px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 ${
      account.included 
        ? 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100 focus:ring-red-500' 
        : 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 focus:ring-green-500'
    }`;
    toggleBtn.textContent = account.included ? 'Exclude' : 'Include';
    toggleBtn.title = account.included ? 'Click to exclude this account' : 'Click to include this account';
    toggleBtn.addEventListener('click', () => {
      account.included = !account.included;
      renderAccountTable();
    });
    actionRow.appendChild(toggleBtn);
  }
  
  if (isFailed) {
    const errorIcon = document.createElement('span');
    errorIcon.className = 'text-red-600 text-lg cursor-default ml-2';
    errorIcon.innerHTML = '⚠️';
    errorIcon.title = 'Previously failed to process';
    actionRow.appendChild(errorIcon);
  }

  detailsDiv.appendChild(actionRow);
  contentDiv.appendChild(detailsDiv);
  card.appendChild(contentDiv);

  return card;
}

function updateMasterCheckbox(visibleAccounts) {
  const masterCheckbox = document.getElementById('masterCheckbox');
  const masterCheckboxMobile = document.getElementById('masterCheckboxMobile');
  const selectedCount = visibleAccounts.filter(acc => acc.selected).length;
  const isChecked = selectedCount > 0 && selectedCount === visibleAccounts.length;
  const isIndeterminate = selectedCount > 0 && selectedCount < visibleAccounts.length;
  
  if (masterCheckbox) {
    masterCheckbox.checked = isChecked;
    masterCheckbox.indeterminate = isIndeterminate;
  }
  
  if (masterCheckboxMobile) {
    masterCheckboxMobile.checked = isChecked;
    masterCheckboxMobile.indeterminate = isIndeterminate;
  }
  
  updateMobileSelectionCount();
}

function updateMobileSelectionCount() {
  const countElement = document.getElementById('mobileSelectionCount');
  if (countElement) {
    const selectedCount = Object.values(state.accounts).filter(acc => acc.selected).length;
    countElement.textContent = `${selectedCount} selected`;
  }
}

function getVisibleAccounts() {
  return Object.values(state.accounts).filter(account => {
    if (account.status === 'processed') return false;
    
    // Apply advanced filters
    if (!passesFilters(account)) return false;
    
    // Apply search query
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
  const selectedCount = Object.values(state.accounts).filter(acc => acc.selected).length;
  
  // Update mobile count
  const mobileCountSpan = document.getElementById('selectedCountMobile');
  if (mobileCountSpan) {
    mobileCountSpan.textContent = selectedCount;
  }
  
  // Update desktop count
  const desktopCountSpan = document.getElementById('selectedCountDesktop');
  if (desktopCountSpan) {
    desktopCountSpan.textContent = selectedCount;
  }
  
  // Show/hide bulk action bar
  if (selectedCount > 0) {
    bar.classList.remove('hidden');
    bar.classList.add('active');
  } else {
    bar.classList.remove('active');
    setTimeout(() => {
      if (!bar.classList.contains('active')) {
        bar.classList.add('hidden');
      }
    }, 300);
  }
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

// Advanced Filters Functions
function initializeFiltersModal() {
  console.log('Initializing filters modal...');
  try {
    populateTypeFilters();
    populateSubtypeFilters();
    updateFilterDisplay();
    console.log('Filters modal initialized successfully');
  } catch (error) {
    console.error('Error initializing filters modal:', error);
  }
}

function populateTypeFilters() {
  const container = document.getElementById('typeFiltersContainer');
  if (!container) {
    console.error('typeFiltersContainer not found');
    return;
  }
  
  const types = [...new Set(monarchAccountTypes.data.map(type => type.typeDisplay))].sort();
  
  container.innerHTML = '';
  types.forEach(type => {
    const checkbox = createFilterCheckbox('type', type, type);
    container.appendChild(checkbox);
  });
  console.log(`Populated ${types.length} type filters`);
}

function populateSubtypeFilters() {
  const container = document.getElementById('subtypeFiltersContainer');
  if (!container) {
    console.error('subtypeFiltersContainer not found');
    return;
  }
  
  const subtypes = new Set();
  
  monarchAccountTypes.data.forEach(type => {
    type.subtypes.forEach(subtype => {
      subtypes.add(subtype.display);
    });
  });
  
  const sortedSubtypes = [...subtypes].sort();
  container.innerHTML = '';
  sortedSubtypes.forEach(subtype => {
    const checkbox = createFilterCheckbox('subtype', subtype, subtype);
    container.appendChild(checkbox);
  });
  console.log(`Populated ${sortedSubtypes.length} subtype filters`);
}

function createFilterCheckbox(filterType, value, label) {
  const div = document.createElement('div');
  div.className = 'flex items-center';
  
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.id = `filter-${filterType}-${value.replace(/\s+/g, '-')}`;
  checkbox.value = value;
  checkbox.className = 'w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded';
  checkbox.addEventListener('change', updateFilterDisplay);
  
  const labelEl = document.createElement('label');
  labelEl.htmlFor = checkbox.id;
  labelEl.className = 'ml-2 text-sm text-gray-700 cursor-pointer';
  labelEl.textContent = label;
  
  div.appendChild(checkbox);
  div.appendChild(labelEl);
  
  return div;
}

function openFiltersModal() {
  console.log('Opening filters modal...');
  
  try {
    // Populate current filter values
    const filterAccountName = document.getElementById('filterAccountName');
    if (filterAccountName) {
      filterAccountName.value = activeFilters.accountName;
    }
    
    const nameMatchType = document.querySelector(`input[name="nameMatchType"][value="${activeFilters.nameMatchType}"]`);
    if (nameMatchType) {
      nameMatchType.checked = true;
    }
    
    const nameCaseSensitive = document.getElementById('nameCaseSensitive');
    if (nameCaseSensitive) {
      nameCaseSensitive.checked = activeFilters.nameCaseSensitive;
    }
    
    // Update type checkboxes
    document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = activeFilters.types.has(cb.value);
    });
    
    // Update subtype checkboxes
    document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = activeFilters.subtypes.has(cb.value);
    });
    
    // Update number inputs
    const filterTransactionsMin = document.getElementById('filterTransactionsMin');
    if (filterTransactionsMin) {
      filterTransactionsMin.value = activeFilters.transactionsMin || '';
    }
    
    const filterTransactionsMax = document.getElementById('filterTransactionsMax');
    if (filterTransactionsMax) {
      filterTransactionsMax.value = activeFilters.transactionsMax || '';
    }
    
    const filterBalanceMin = document.getElementById('filterBalanceMin');
    if (filterBalanceMin) {
      filterBalanceMin.value = activeFilters.balanceMin || '';
    }
    
    const filterBalanceMax = document.getElementById('filterBalanceMax');
    if (filterBalanceMax) {
      filterBalanceMax.value = activeFilters.balanceMax || '';
    }
    
    // Update inclusion radio
    const inclusionFilter = document.querySelector(`input[name="inclusionFilter"][value="${activeFilters.inclusion}"]`);
    if (inclusionFilter) {
      inclusionFilter.checked = true;
    }
    
    const modal = document.getElementById('filtersModal');
    if (modal) {
      console.log('Found modal, showing it...');
      modal.classList.remove('hidden');
      setTimeout(() => modal.classList.add('show'), 10);
    } else {
      console.error('Modal not found!');
    }
  } catch (error) {
    console.error('Error opening filters modal:', error);
  }
}

// Expose globally for onclick handler
window.openFiltersModal = openFiltersModal;

function closeFiltersModal() {
  const modal = document.getElementById('filtersModal');
  modal.classList.remove('show');
  setTimeout(() => modal.classList.add('hidden'), 300);
}

// Expose globally for onclick handlers
window.closeFiltersModal = closeFiltersModal;

function applyFilters() {
  console.log('Apply filters button clicked!');
  
  try {
    // Account name filter
    const filterAccountName = document.getElementById('filterAccountName');
    activeFilters.accountName = filterAccountName ? filterAccountName.value.trim() : '';
    
    const nameMatchType = document.querySelector('input[name="nameMatchType"]:checked');
    activeFilters.nameMatchType = nameMatchType ? nameMatchType.value : 'contains';
    
    const nameCaseSensitive = document.getElementById('nameCaseSensitive');
    activeFilters.nameCaseSensitive = nameCaseSensitive ? nameCaseSensitive.checked : false;
    
    // Type filters
    activeFilters.types.clear();
    document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]:checked').forEach(cb => {
      activeFilters.types.add(cb.value);
    });
    
    // Subtype filters
    activeFilters.subtypes.clear();
    document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]:checked').forEach(cb => {
      activeFilters.subtypes.add(cb.value);
    });
    
    // Transactions filters
    const transMin = document.getElementById('filterTransactionsMin');
    const transMax = document.getElementById('filterTransactionsMax');
    activeFilters.transactionsMin = transMin && transMin.value ? parseInt(transMin.value) : null;
    activeFilters.transactionsMax = transMax && transMax.value ? parseInt(transMax.value) : null;
    
    // Balance filters
    const balMin = document.getElementById('filterBalanceMin');
    const balMax = document.getElementById('filterBalanceMax');
    activeFilters.balanceMin = balMin && balMin.value ? parseFloat(balMin.value) : null;
    activeFilters.balanceMax = balMax && balMax.value ? parseFloat(balMax.value) : null;
    
    // Inclusion filter
    const inclusionFilter = document.querySelector('input[name="inclusionFilter"]:checked');
    activeFilters.inclusion = inclusionFilter ? inclusionFilter.value : 'all';
    
    console.log('Applied filters:', activeFilters);
    
    closeFiltersModal();
    renderAccountTable();
    updateFilterDisplay();
    persistState();
  } catch (error) {
    console.error('Error applying filters:', error);
  }
}

// Expose globally for onclick handler
window.applyFilters = applyFilters;

function resetFilters() {
  console.log('Reset filters button clicked!');
  
  try {
    // Reset all form fields
    const filterAccountName = document.getElementById('filterAccountName');
    if (filterAccountName) filterAccountName.value = '';
    
    const containsRadio = document.querySelector('input[name="nameMatchType"][value="contains"]');
    if (containsRadio) containsRadio.checked = true;
    
    const nameCaseSensitive = document.getElementById('nameCaseSensitive');
    if (nameCaseSensitive) nameCaseSensitive.checked = false;
    
    document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => cb.checked = false);
    document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    const filterTransactionsMin = document.getElementById('filterTransactionsMin');
    if (filterTransactionsMin) filterTransactionsMin.value = '';
    
    const filterTransactionsMax = document.getElementById('filterTransactionsMax');
    if (filterTransactionsMax) filterTransactionsMax.value = '';
    
    const filterBalanceMin = document.getElementById('filterBalanceMin');
    if (filterBalanceMin) filterBalanceMin.value = '';
    
    const filterBalanceMax = document.getElementById('filterBalanceMax');
    if (filterBalanceMax) filterBalanceMax.value = '';
    
    const allRadio = document.querySelector('input[name="inclusionFilter"][value="all"]');
    if (allRadio) allRadio.checked = true;
    
    // Reset active filters
    activeFilters = {
      accountName: '',
      nameMatchType: 'contains',
      nameCaseSensitive: false,
      types: new Set(),
      subtypes: new Set(),
      transactionsMin: null,
      transactionsMax: null,
      balanceMin: null,
      balanceMax: null,
      inclusion: 'all'
    };
    
    renderAccountTable();
    updateFilterDisplay();
    persistState();
    
    // Close the modal after resetting
    closeFiltersModal();
    
    console.log('Filters reset successfully');
  } catch (error) {
    console.error('Error resetting filters:', error);
  }
}

// Expose globally for onclick handler
window.resetFilters = resetFilters;

function clearAllFilters() {
  console.log('Clear all filters clicked!');
  resetFilters();
  closeFiltersModal();
}

// Expose globally for onclick handler
window.clearAllFilters = clearAllFilters;

function updateFilterDisplay() {
  const filterCount = document.getElementById('filterCount');
  const activeFiltersSection = document.getElementById('activeFiltersSection');
  const activeFiltersContainer = document.getElementById('activeFiltersContainer');
  
  let activeFilterCount = 0;
  const filterChips = [];
  
  // Account name filter
  if (activeFilters.accountName) {
    activeFilterCount++;
    filterChips.push(createFilterChip('Name', `${activeFilters.nameMatchType}: "${activeFilters.accountName}"`, () => {
      activeFilters.accountName = '';
      document.getElementById('filterAccountName').value = '';
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Type filters
  if (activeFilters.types.size > 0) {
    activeFilterCount++;
    const typeList = [...activeFilters.types].join(', ');
    filterChips.push(createFilterChip('Types', typeList, () => {
      activeFilters.types.clear();
      document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => cb.checked = false);
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Subtype filters
  if (activeFilters.subtypes.size > 0) {
    activeFilterCount++;
    const subtypeList = [...activeFilters.subtypes].join(', ');
    filterChips.push(createFilterChip('Subtypes', subtypeList, () => {
      activeFilters.subtypes.clear();
      document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => cb.checked = false);
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Transaction count filter
  if (activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null) {
    activeFilterCount++;
    const min = activeFilters.transactionsMin || 0;
    const max = activeFilters.transactionsMax || '∞';
    filterChips.push(createFilterChip('Transactions', `${min} - ${max}`, () => {
      activeFilters.transactionsMin = null;
      activeFilters.transactionsMax = null;
      document.getElementById('filterTransactionsMin').value = '';
      document.getElementById('filterTransactionsMax').value = '';
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Balance filter
  if (activeFilters.balanceMin !== null || activeFilters.balanceMax !== null) {
    activeFilterCount++;
    const min = activeFilters.balanceMin !== null ? `$${activeFilters.balanceMin}` : '$0';
    const max = activeFilters.balanceMax !== null ? `$${activeFilters.balanceMax}` : '∞';
    filterChips.push(createFilterChip('Balance', `${min} - ${max}`, () => {
      activeFilters.balanceMin = null;
      activeFilters.balanceMax = null;
      document.getElementById('filterBalanceMin').value = '';
      document.getElementById('filterBalanceMax').value = '';
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Inclusion filter
  if (activeFilters.inclusion !== 'all') {
    activeFilterCount++;
    filterChips.push(createFilterChip('Status', capitalize(activeFilters.inclusion), () => {
      activeFilters.inclusion = 'all';
      document.querySelector('input[name="inclusionFilter"][value="all"]').checked = true;
      renderAccountTable();
      updateFilterDisplay();
    }));
  }
  
  // Update filter count badge
  if (activeFilterCount > 0) {
    filterCount.textContent = activeFilterCount;
    filterCount.classList.remove('hidden');
  } else {
    filterCount.classList.add('hidden');
  }
  
  // Update active filters section
  if (filterChips.length > 0) {
    activeFiltersSection.classList.remove('hidden');
    activeFiltersContainer.innerHTML = '';
    filterChips.forEach(chip => activeFiltersContainer.appendChild(chip));
  } else {
    activeFiltersSection.classList.add('hidden');
  }
  
  // Update filter status display
  updateAccountCountDisplay(visibleCount, accounts.length);
}

function createFilterChip(label, value, onRemove) {
  const chip = document.createElement('div');
  chip.className = 'filter-chip';
  
  const content = document.createElement('span');
  content.textContent = `${label}: ${value}`;
  
  const removeBtn = document.createElement('button');
  removeBtn.onclick = onRemove;
  removeBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>';
  
  chip.appendChild(content);
  chip.appendChild(removeBtn);
  
  return chip;
}

function passesFilters(account) {
  // Account name filter
  if (activeFilters.accountName) {
    const accountName = activeFilters.nameCaseSensitive ? account.modifiedName : account.modifiedName.toLowerCase();
    const filterName = activeFilters.nameCaseSensitive ? activeFilters.accountName : activeFilters.accountName.toLowerCase();
    
    if (activeFilters.nameMatchType === 'exact') {
      if (accountName !== filterName) return false;
    } else {
      if (!accountName.includes(filterName)) return false;
    }
  }
  
  // Type filter
  if (activeFilters.types.size > 0) {
    const accountType = getAccountTypeByName(account.type);
    const typeDisplay = accountType ? accountType.typeDisplay : (account.type || '');
    if (!activeFilters.types.has(typeDisplay)) return false;
  }
  
  // Subtype filter
  if (activeFilters.subtypes.size > 0) {
    const accountSubtype = getSubtypeByName(account.subtype);
    const subtypeDisplay = accountSubtype ? accountSubtype.display : (account.subtype || '');
    if (!activeFilters.subtypes.has(subtypeDisplay)) return false;
  }
  
  // Transaction count filter
  const transactionCount = account.transactionCount || 0;
  if (activeFilters.transactionsMin !== null && transactionCount < activeFilters.transactionsMin) return false;
  if (activeFilters.transactionsMax !== null && transactionCount > activeFilters.transactionsMax) return false;
  
  // Balance filter
  const balance = parseFloat(account.balance) || 0;
  if (activeFilters.balanceMin !== null && balance < activeFilters.balanceMin) return false;
  if (activeFilters.balanceMax !== null && balance > activeFilters.balanceMax) return false;
  
  // Inclusion filter
  if (activeFilters.inclusion === 'included' && !account.included) return false;
  if (activeFilters.inclusion === 'excluded' && account.included) return false;
  
  return true;
}

function updateAccountCountDisplay(visibleCount, totalCount) {
  const visibleAccountCount = document.getElementById('visibleAccountCount');
  const totalAccountCount = document.getElementById('totalAccountCount');
  const filterResultsSummary = document.getElementById('filterResultsSummary');
  const filterNotificationBadge = document.getElementById('filterNotificationBadge');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  
  if (visibleAccountCount) visibleAccountCount.textContent = visibleCount;
  if (totalAccountCount) totalAccountCount.textContent = totalCount;
  
  // Check if filters are active and count them
  const hasFilters = hasActiveFilters();
  const filterCount = countActiveFilters();
  
  // Show/hide and update the notification badge
  if (hasFilters && filterCount > 0 && filterNotificationBadge) {
    filterNotificationBadge.textContent = filterCount;
    filterNotificationBadge.classList.remove('hidden');
  } else if (filterNotificationBadge) {
    filterNotificationBadge.classList.add('hidden');
  }
  
  // Show/hide clear filters button
  if (hasFilters && clearFiltersBtn) {
    clearFiltersBtn.classList.remove('hidden');
  } else if (clearFiltersBtn) {
    clearFiltersBtn.classList.add('hidden');
  }
  
  // Add subtle styling to results summary when filtered
  if (hasFilters && filterResultsSummary) {
    filterResultsSummary.classList.add('filtered');
  } else if (filterResultsSummary) {
    filterResultsSummary.classList.remove('filtered');
  }
}

function hasActiveFilters() {
  return activeFilters.accountName ||
         activeFilters.types.size > 0 ||
         activeFilters.subtypes.size > 0 ||
         activeFilters.transactionsMin !== null ||
         activeFilters.transactionsMax !== null ||
         activeFilters.balanceMin !== null ||
         activeFilters.balanceMax !== null ||
         activeFilters.inclusion !== 'all';
}

function countActiveFilters() {
  let count = 0;
  
  // Account name filter
  if (activeFilters.accountName) {
    count++;
  }
  
  // Type filters
  if (activeFilters.types.size > 0) {
    count++;
  }
  
  // Subtype filters
  if (activeFilters.subtypes.size > 0) {
    count++;
  }
  
  // Transaction count range filter
  if (activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null) {
    count++;
  }
  
  // Balance range filter
  if (activeFilters.balanceMin !== null || activeFilters.balanceMax !== null) {
    count++;
  }
  
  // Inclusion status filter (only count if not 'all')
  if (activeFilters.inclusion !== 'all') {
    count++;
  }
  
  return count;
}
