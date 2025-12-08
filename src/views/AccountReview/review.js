import state from '../../state.js';
import monarchAccountTypes from '../../../public/static-data/monarchAccountTypes.json';
import { navigate, persistState } from '../../router.js';
import { currencyFormatter } from '../../utils/format.js';
import { getAccountTypeByName, getSubtypeByName } from '../../utils/accountTypeUtils.js';
import { toggleDisabled } from '../../utils/dom.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import '../../components/ReusableTable.js';

let accountsTable, importBtn, searchInput;
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

// Track changes for undo functionality
let changeHistory = {}; // Maps account ID -> { original values }
let initialAccountsSnapshot = null;

export default function initAccountReviewView() {

  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 2: Review Accounts',
      description: 'Review detected accounts and adjust their Monarch types before importing.',
      containerId: 'pageHeader'
    }
  });

  accountsTable = document.getElementById('accountsTable');
  importBtn = document.getElementById('continueBtn');
  searchInput = document.getElementById('searchInput');
  
  // Initialize change tracking snapshot
  initializeChangeTracking();

  // Configure table columns
  setupTableColumns();

  // Initialize table with data
  renderAccountTable();

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
      filtersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openFiltersModal();
      });
    } else {
      console.error('Filters button not found!');
    }

    const filtersApply = document.getElementById('filtersApply');
    if (filtersApply) {
      filtersApply.addEventListener('click', applyFilters);
    }

    const filtersReset = document.getElementById('filtersReset');
    if (filtersReset) {
      filtersReset.addEventListener('click', resetFilters);
    }

    const clearAllFiltersBtn = document.getElementById('clearAllFilters');
    if (clearAllFiltersBtn) {
      clearAllFiltersBtn.addEventListener('click', clearAllFilters);
    }

    // Quick clear filters button
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');
    if (clearFiltersBtn) {
      clearFiltersBtn.addEventListener('click', () => {
        resetFilters();
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

  // Listen to table selection changes
  accountsTable.addEventListener('selectionchange', (e) => {
    const selectedCount = e.detail.count;
    const bar = document.getElementById('bulkActionBar');

    if (!bar) return;

    // Update selection count displays
    const mobileCountSpan = document.getElementById('selectedCountMobile');
    if (mobileCountSpan) {
      mobileCountSpan.textContent = selectedCount;
      const mobileLabelSpan = document.getElementById('selectCountMobileLabel');
      if (mobileLabelSpan) {
        mobileLabelSpan.textContent = selectedCount === 1 ? 'Account' : 'Accounts';
      }
    }

    const desktopCountSpan = document.getElementById('selectedCountDesktop');
    if (desktopCountSpan) {
      desktopCountSpan.textContent = selectedCount;
      const desktopLabelSpan = document.getElementById('selectCountDesktopLabel');
      if (desktopLabelSpan) {
        desktopLabelSpan.textContent = selectedCount === 1 ? 'Account' : 'Accounts';
      }
    }

    // Update account selected state
    const accounts = Object.values(state.accounts);
    accounts.forEach(acc => {
      acc.selected = e.detail.selected.includes(String(acc.id || acc.modifiedName));
    });

    // Update bulk action bar visibility
    if (selectedCount > 0) {
      bar.classList.remove('hidden');
      bar.classList.add('active');
    } else {
      bar.classList.remove('active');
      // Add a small delay to allow CSS transition to complete before hiding
      setTimeout(() => {
        if (!bar.classList.contains('active')) {
          bar.classList.add('hidden');
        }
      }, 300);
    }
  });

  // Navigation listeners
  document.getElementById('continueBtn').addEventListener('click', () => navigate('/method'));

  // Setup undo handlers
  setupUndoListeners();

  renderAccountTable();
}

function initializeChangeTracking() {
  changeHistory = {};
  initialAccountsSnapshot = JSON.parse(JSON.stringify(state.accounts));
  Object.keys(state.accounts).forEach(accountId => {
    state.accounts[accountId]._isModified = false;
  });
}

function trackChange(accountId) {
  if (!changeHistory[accountId]) {
    const account = state.accounts[accountId];
    changeHistory[accountId] = {
      modifiedName: account.modifiedName,
      type: account.type,
      subtype: account.subtype
    };
  }
  state.accounts[accountId]._isModified = true;
}

function checkAndUpdateModifiedStatus(accountId) {
  // If no change history for this account, nothing to check
  if (!changeHistory[accountId]) return;
  
  const account = state.accounts[accountId];
  const original = changeHistory[accountId];
  
  // Check if current state matches original state
  const isBackToOriginal = 
    account.modifiedName === original.modifiedName &&
    account.type === original.type &&
    account.subtype === original.subtype;
  
  if (isBackToOriginal) {
    // Remove from change history and mark as unmodified
    delete changeHistory[accountId];
    account._isModified = false;
  } else {
    // Ensure marked as modified
    account._isModified = true;
  }
}

function hasChanges() {
  return Object.keys(changeHistory).length > 0;
}

function undoRowChanges(accountId) {
  if (!changeHistory[accountId]) return;
  
  const original = changeHistory[accountId];
  const account = state.accounts[accountId];
  
  account.modifiedName = original.modifiedName;
  account.type = original.type;
  account.subtype = original.subtype;
  account._isModified = false;
  
  delete changeHistory[accountId];
  persistState();
  renderAccountTable();
}

function undoAllChanges() {
  const accountIds = Object.keys(changeHistory);
  
  accountIds.forEach(accountId => {
    const original = changeHistory[accountId];
    const account = state.accounts[accountId];
    
    account.modifiedName = original.modifiedName;
    account.type = original.type;
    account.subtype = original.subtype;
    account._isModified = false;
    
    delete changeHistory[accountId];
  });
  
  persistState();
  renderAccountTable();
}

function setupUndoListeners() {
  // Setup undo all button
  const undoAllBtn = document.getElementById('undoAllBtn');
  if (undoAllBtn) {
    undoAllBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to undo all changes? This action cannot be reversed.')) {
        undoAllChanges();
      }
    });
  }
  
  // Setup per-row undo buttons using event delegation
  accountsTable.addEventListener('click', (e) => {
    const undoBtn = e.target.closest('[data-undo-button]');
    if (undoBtn) {
      const rowId = undoBtn.dataset.rowId;
      undoRowChanges(rowId);
    }
  });
}

function setupTableColumns() {
  accountsTable.columns = [
    {
      key: 'select',
      type: 'checkbox',
      header: '',
      width: '60px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 w-[50px] sm:w-[60px]',
      cellClass: 'px-2 py-2 text-center',
      masterCheckbox: true,
      disabled: (row) => row.status === 'processed',
      mobileHidden: true // Handled separately in mobile view
    },
    {
      key: 'modifiedName',
      type: 'text',
      header: 'Account Name',
      minWidth: '200px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[200px]',
      cellClass: 'px-2 py-2 max-w-[300px]',
      clickable: true,
      tooltip: (row) => row.status === 'processed' ? '' : `Click to rename '${row.modifiedName}'`,
      onClick: (row) => {
        if (row.status !== 'processed') {
          trackChange(row.id);
          openNameEditor(row);
        }
      },
      mobileLabel: false, // Show as title in mobile, not labeled field
      mobileClass: 'mb-2'
    },
    {
      key: 'type',
      type: 'select',
      header: 'Type',
      minWidth: '150px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]',
      cellClass: 'px-2 py-2',
      options: monarchAccountTypes.data.map(type => ({
        value: type.typeName,
        label: type.typeDisplay
      })),
      disabled: (row) => row.status === 'processed',
      tooltip: (row) => getAccountTypeByName(row.type)?.typeDisplay || '',
      onChange: (row, value) => {
        trackChange(row.id);
        row.type = value;
        const selectedType = getAccountTypeByName(value);
        row.subtype = selectedType?.subtypes[0]?.name || null;
        checkAndUpdateModifiedStatus(row.id);
        persistState();
        renderAccountTable();
      },
      mobileLabel: 'Type'
    },
    {
      key: 'subtype',
      type: 'select',
      header: 'Subtype',
      minWidth: '150px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[150px]',
      cellClass: 'px-2 py-2',
      options: (row) => {
        const selectedType = getAccountTypeByName(row.type);
        return (selectedType?.subtypes || []).map(sub => ({
          value: sub.name,
          label: sub.display
        }));
      },
      disabled: (row) => row.status === 'processed',
      tooltip: (row) => getSubtypeByName(row.type, row.subtype)?.display || '',
      onChange: (row, value) => {
        trackChange(row.id);
        row.subtype = value;
        checkAndUpdateModifiedStatus(row.id);
        persistState();
        renderAccountTable();
      },
      mobileLabel: 'Subtype'
    },
    {
      key: 'transactionCount',
      type: 'text',
      header: 'Transactions',
      minWidth: '100px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center',
      cellClass: 'px-2 py-2 text-center text-[#637988] cursor-default',
      tooltip: (row) => `${row.transactionCount} transaction${row.transactionCount !== 1 ? 's' : ''}`,
      cellStyle: (row) => row.status === 'processed' ? { color: '#9ca3af' } : {},
      mobileLabel: 'Transactions',
      mobileClass: 'text-sm text-gray-600'
    },
    {
      key: 'balance',
      type: 'text',
      header: 'Balance',
      minWidth: '120px',
      headerClass: 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[120px] text-right',
      cellClass: 'px-2 py-2 text-[#637988] cursor-default text-right',
      getValue: (row) => currencyFormatter.format(row.balance),
      tooltip: (row) => `Balance: ${currencyFormatter.format(row.balance)}`,
      cellStyle: (row) => row.status === 'processed' ? { color: '#9ca3af' } : {},
      mobileLabel: 'Balance',
      mobileClass: 'text-sm font-medium'
    },
    {
      key: 'undo',
      type: 'custom',
      header: '',
      minWidth: '50px',
      width: '50px',
      headerClass: 'px-2 py-3 sm:py-4 text-center',
      cellClass: 'px-2 py-2',
      render: (row) => {
        const container = document.createElement('div');
        container.className = 'flex items-center justify-center w-full h-full';
        
        if (!row._isModified) {
          return container;
        }
        
        const button = document.createElement('button');
        button.className = 'p-1.5 rounded hover:bg-amber-100 transition-colors duration-150';
        button.title = 'Undo changes to this account';
        button.setAttribute('aria-label', 'Undo changes');
        button.innerHTML = `
          <svg class="w-4 h-4 sm:w-5 sm:h-5 text-amber-600 hover:text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
          </svg>
        `;
        button.addEventListener('click', () => undoRowChanges(row.id));
        container.appendChild(button);
        return container;
      },
      mobileLabel: '',
      mobileClass: 'flex items-center justify-center'
    },
    {
      key: 'included',
      type: 'button',
      header: 'Migrate?',
      minWidth: '100px',
      headerClass: 'px-2 sm:px-3 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900 min-w-[100px] text-center',
      cellClass: 'px-2 py-2',
      render: (row) => {
        const isProcessed = row.status === 'processed';
        const isFailed = row.status === 'failed';

        return {
          text: isProcessed ? 'Processed' : (row.included ? 'Included' : 'Excluded'),
          type: 'outline',
          color: isProcessed ? 'grey' : (row.included ? 'green' : 'red'),
          size: 'small',
          disabled: isProcessed,
          tooltip: isProcessed
            ? 'This account has already been processed'
            : (row.included ? 'Click to exclude this account' : 'Click to include this account'),
          onClick: () => {
            if (!isProcessed) {
              row.included = !row.included;
              persistState();
              renderAccountTable();
            }
          }
        };
      },
      mobileLabel: 'Migrate?',
      mobileClass: 'flex items-center justify-center'
    }
  ];
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
    if (acc.selected) {
      acc.included = include;
    }
  });
  persistState();
  renderAccountTable();
}

function renderAccountTable() {
  const accounts = Object.values(state.accounts);

  // Filter accounts
  const visibleAccounts = accounts.filter(account => {
    // Apply advanced filters
    if (!passesFilters(account)) return false;

    // Apply search query
    if (searchQuery && !account.modifiedName.toLowerCase().includes(searchQuery)) return false;

    return true;
  });

  // Add unique IDs to accounts if they don't have them
  visibleAccounts.forEach((account, index) => {
    if (!account.id) {
      account.id = account.modifiedName.replace(/\s+/g, '-') + '-' + index;
    }
  });

  // Update table data
  accountsTable.data = visibleAccounts;

  // Restore selection state
  const selectedIds = accounts
    .filter(acc => acc.selected)
    .map(acc => String(acc.id || acc.modifiedName));
  accountsTable.selectedRows = selectedIds;

  // Update account count indicators
  updateAccountCountDisplay(visibleAccounts.length, accounts.length);

  // Update continue button with included account count
  const includedCount = accounts.filter(isIncludedAndUnprocessed).length;
  const hasIncludedAccounts = includedCount > 0;

  toggleDisabled(importBtn, !hasIncludedAccounts);
  importBtn.title = importBtn.disabled ? 'At least one account must be included to proceed' : '';

  // Update button text to show included account count
  if (hasIncludedAccounts) {
    importBtn.textContent = `Migrate ${includedCount} of ${accounts.length} account${accounts.length !== 1 ? 's' : ''}`;
  } else {
    importBtn.textContent = 'Continue';
  }
  
  // Update changes alert visibility
  updateChangesAlert();
}

function updateChangesAlert() {
  const undoAllContainer = document.getElementById('undoAllContainer');
  if (!undoAllContainer) return;
  
  const hasChanges = Object.keys(changeHistory).length > 0;
  if (hasChanges) {
    undoAllContainer.classList.remove('hidden');
  } else {
    undoAllContainer.classList.add('hidden');
  }
}

function isIncludedAndUnprocessed(account) {
  return account.included && account.status !== 'processed';
}

// TODO: Refactor to leverage the ui-modal component
function openNameEditor(account) {
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
    checkAndUpdateModifiedStatus(account.id);
    persistState();
    // Update the table component to reflect the change
    const table = document.getElementById('accountsTable');
    if (table) {
      table.refresh();
    }
    closeEditor();
  }
}

function openBulkRenameModal() {
  const modal = document.getElementById('bulkRenameModal');
  const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);
  
  modal.open();
  
  // Wait for modal overlay to be appended to body
  setTimeout(() => {
    // Find the modal overlay in the body (it's a direct child)
    const modalOverlay = Array.from(document.body.children).find(el => 
      el.classList.contains('ui-modal-overlay') && el.querySelector('#renamePattern')
    );
    
    if (!modalOverlay) {
      console.error('Modal overlay not found in body');
      return;
    }
    
    console.log('Found modal overlay:', modalOverlay);
    
    // Query elements from the modal overlay
    const renamePattern = modalOverlay.querySelector('#renamePattern');
    const indexStartInput = modalOverlay.querySelector('#indexStart');
    const previewDiv = modalOverlay.querySelector('#renamePreview');
    const cancelBtn = modalOverlay.querySelector('#renameCancel');
    const applyBtn = modalOverlay.querySelector('#renameApply');
    const tokenButtons = modalOverlay.querySelectorAll('.token-btn');

    console.log('Found elements:', { renamePattern, indexStartInput, previewDiv, cancelBtn, applyBtn, tokenButtons: tokenButtons.length });

    if (!renamePattern || !indexStartInput || !previewDiv || !cancelBtn || !applyBtn) {
      console.error('Modal elements not found', { renamePattern, indexStartInput, previewDiv, cancelBtn, applyBtn });
      return;
    }

    const updatePreview = () => {
      const preview = modalOverlay.querySelector('#renamePreview');
      const patternInput = modalOverlay.querySelector('#renamePattern');
      const indexInput = modalOverlay.querySelector('#indexStart');
      
      if (!preview || !patternInput || !indexInput) return;
      
      preview.innerHTML = '';

      const pattern = patternInput.value;
      const indexStart = parseInt(indexInput.value, 10) || 1;

      selectedAccounts.slice(0, 3).forEach((acc, i) => {
        const previewName = applyPattern(pattern, acc, i + indexStart);
        const div = document.createElement('div');
        div.textContent = previewName;
        preview.appendChild(div);
      });
    };

    // Token insert handlers
    tokenButtons.forEach(btn => {
      console.log('Attaching token button handler', btn);
      btn.onclick = (e) => {
        console.log('Token button clicked!');
        e.preventDefault();
        e.stopPropagation();
        const currentPattern = modalOverlay.querySelector('#renamePattern');
        if (currentPattern) {
          const token = btn.dataset.token;
          currentPattern.value += token;
          updatePreview();
        }
      };
    });

    // Live preview listeners
    renamePattern.oninput = updatePreview;
    indexStartInput.oninput = updatePreview;

    updatePreview();

    // Cancel button
    console.log('Attaching cancel handler to:', cancelBtn);
    cancelBtn.onclick = (e) => {
      console.log('Cancel clicked!');
      e.preventDefault();
      e.stopPropagation();
      modal.close();
    };

    // Apply button
    console.log('Attaching apply handler to:', applyBtn);
    applyBtn.onclick = (e) => {
      console.log('Apply clicked!');
      e.preventDefault();
      e.stopPropagation();
      
      const currentPattern = modalOverlay.querySelector('#renamePattern');
      const currentIndexStart = modalOverlay.querySelector('#indexStart');
      
      if (!currentPattern || !currentIndexStart) return;
      
      const pattern = currentPattern.value;
      const indexStart = parseInt(currentIndexStart.value, 10) || 1;

      selectedAccounts.forEach((acc, i) => {
        trackChange(acc.id);
        acc.modifiedName = applyPattern(pattern, acc, i + indexStart);
        checkAndUpdateModifiedStatus(acc.id);
      });

      modal.close();
      persistState();
      renderAccountTable();
    };
    
    renamePattern.focus();
  }, 300);
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
  
  modal.open();
  
  // Wait for modal overlay to be appended to body
  setTimeout(() => {
    // Find the modal overlay in the body
    const modalOverlay = Array.from(document.body.children).find(el => 
      el.classList.contains('ui-modal-overlay') && el.querySelector('#bulkTypeSelect')
    );
    
    if (!modalOverlay) {
      console.error('Modal overlay not found in body');
      return;
    }
    
    console.log('Found modal overlay:', modalOverlay);
    
    // Query elements from the modal overlay
    const typeSelect = modalOverlay.querySelector('#bulkTypeSelect');
    const subtypeSelect = modalOverlay.querySelector('#bulkSubtypeSelect');
    const cancelBtn = modalOverlay.querySelector('#bulkTypeCancel');
    const applyBtn = modalOverlay.querySelector('#bulkTypeApply');

    console.log('Found elements:', { typeSelect, subtypeSelect, cancelBtn, applyBtn });

    if (!typeSelect || !subtypeSelect || !cancelBtn || !applyBtn) {
      console.error('Modal elements not found', { typeSelect, subtypeSelect, cancelBtn, applyBtn });
      return;
    }

    const updateSubtypeOptions = () => {
      const currentTypeSelect = modalOverlay.querySelector('#bulkTypeSelect');
      const currentSubtypeSelect = modalOverlay.querySelector('#bulkSubtypeSelect');
      
      if (!currentTypeSelect || !currentSubtypeSelect) return;
      
      const selectedType = getAccountTypeByName(currentTypeSelect.value);
      currentSubtypeSelect.innerHTML = '';

      (selectedType?.subtypes || []).forEach(sub => {
        const opt = document.createElement('option');
        opt.value = sub.name;
        opt.textContent = sub.display;
        currentSubtypeSelect.appendChild(opt);
      });

      // If no subtypes available, add default empty option
      if ((selectedType?.subtypes || []).length === 0) {
        const opt = document.createElement('option');
        opt.value = '';
        opt.textContent = '-';
        currentSubtypeSelect.appendChild(opt);
      }
    };

    // Populate Type dropdown
    typeSelect.innerHTML = '';
    monarchAccountTypes.data.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      typeSelect.appendChild(opt);
    });

    // Attach change listener
    typeSelect.onchange = updateSubtypeOptions;
    updateSubtypeOptions();

    // Cancel button
    console.log('Attaching cancel handler to:', cancelBtn);
    cancelBtn.onclick = (e) => {
      console.log('Cancel clicked!');
      e.preventDefault();
      e.stopPropagation();
      modal.close();
    };

    // Apply button
    console.log('Attaching apply handler to:', applyBtn);
    applyBtn.onclick = (e) => {
      console.log('Apply clicked!');
      e.preventDefault();
      e.stopPropagation();
      
      const currentTypeSelect = modalOverlay.querySelector('#bulkTypeSelect');
      const currentSubtypeSelect = modalOverlay.querySelector('#bulkSubtypeSelect');
      
      if (!currentTypeSelect || !currentSubtypeSelect) return;
      
      const typeValue = currentTypeSelect.value;
      const subtypeValue = currentSubtypeSelect.value;

      const selectedAccounts = Object.values(state.accounts).filter(acc => acc.selected);
      selectedAccounts.forEach(acc => {
        trackChange(acc.id);
        acc.type = typeValue;
        acc.subtype = subtypeValue || null;
        checkAndUpdateModifiedStatus(acc.id);
      });

      modal.close();
      persistState();
      renderAccountTable();
    };
  }, 300);
}

// Advanced Filters Functions
function initializeFiltersModal() {
  try {
    populateTypeFilters();
    populateSubtypeFilters();
    updateFilterDisplay();
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
  try {
    const modal = document.getElementById('filtersModal');

    if (!modal) {
      console.error('❌ Modal element not found!');
      return;
    }

    // Close the modal first to ensure signal change detection
    if (typeof modal.close === 'function') {
      modal.close();
    }

    // Then open it after a brief delay
    setTimeout(() => {
      if (typeof modal.open === 'function') {
        modal.open();
      } else {
        console.error('❌ modal.open is not a function');
        return;
      }
    }, 10);

    // Populate current filter values AFTER opening
    setTimeout(() => {
      try {
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

        document.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => {
          cb.checked = activeFilters.types.has(cb.value);
        });

        document.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => {
          cb.checked = activeFilters.subtypes.has(cb.value);
        });

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

        const inclusionFilter = document.querySelector(`input[name="inclusionFilter"][value="${activeFilters.inclusion}"]`);
        if (inclusionFilter) {
          inclusionFilter.checked = true;
        }
      } catch (err) {
        console.error('Error populating filter values:', err);
      }
    }, 50);

  } catch (error) {
    console.error('❌ Error in openFiltersModal:', error);
  }
}

// Expose globally for onclick handler
window.openFiltersModal = openFiltersModal;

function applyFilters() {
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

    // Close the filters modal
    const modal = document.getElementById('filtersModal');
    if (modal && modal.close) modal.close();

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
  } catch (error) {
    console.error('Error resetting filters:', error);
  }
}

// Expose globally for onclick handler
window.resetFilters = resetFilters;

function clearAllFilters() {
  resetFilters();
}

// Expose globally for onclick handler
window.clearAllFilters = clearAllFilters;

function updateFilterDisplay() {
  const filterNotificationBadge = document.getElementById('filterNotificationBadge');
  const activeFiltersSection = document.getElementById('activeFiltersSection');
  const activeFiltersContainer = document.getElementById('activeFiltersContainer');

  // Check if elements exist before manipulating them
  if (!filterNotificationBadge || !activeFiltersSection || !activeFiltersContainer) {
    console.warn('Filter display elements not found in DOM');
    return;
  }

  let activeFilterCount = 0;

  // Account name filter
  if (activeFilters.accountName) {
    activeFilterCount++;
  }

  // Type filters
  if (activeFilters.types.size > 0) {
    activeFilterCount++;
    const typeList = [...activeFilters.types].join(', ');
  }

  // Subtype filters
  if (activeFilters.subtypes.size > 0) {
    activeFilterCount++;
    const subtypeList = [...activeFilters.subtypes].join(', ');
  }

  // Transaction count filter
  if (activeFilters.transactionsMin !== null || activeFilters.transactionsMax !== null) {
    activeFilterCount++;
    const min = activeFilters.transactionsMin || 0;
    const max = activeFilters.transactionsMax || '∞';
  }

  // Balance filter
  if (activeFilters.balanceMin !== null || activeFilters.balanceMax !== null) {
    activeFilterCount++;
    const min = activeFilters.balanceMin !== null ? `$${activeFilters.balanceMin}` : '$0';
    const max = activeFilters.balanceMax !== null ? `$${activeFilters.balanceMax}` : '∞';
  }

  // Inclusion filter
  if (activeFilters.inclusion !== 'all') {
    activeFilterCount++;
  }

  // Update filter count badge
  if (activeFilterCount > 0) {
    filterNotificationBadge.textContent = activeFilterCount;
    filterNotificationBadge.classList.remove('hidden');
  } else {
    filterNotificationBadge.classList.add('hidden');
  }

  // Update clear filters button visibility
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  if (clearFiltersBtn) {
    if (activeFilterCount > 0) {
      clearFiltersBtn.classList.remove('hidden');
    } else {
      clearFiltersBtn.classList.add('hidden');
    }
  }
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

// TODO: Implement logic for select all/deselect all for types and subtypes in the filter modal