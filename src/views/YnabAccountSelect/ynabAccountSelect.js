import Accounts from '../../schemas/accounts.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import { currencyFormatter } from '../../utils/format.js';
import { toggleDisabled } from '../../utils/dom.js';
import { navigate } from '../../router.js';
import { getTransactions } from '../../api/ynabApi.js';
import loadingOverlay from '../../components/LoadingOverlay.js';

const formatType = (type) => {
  if (!type) return '—';
  return type
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (match) => match.toUpperCase());
};

const formatBudget = (account) => (account.isOnBudget ? 'Budget' : 'Tracking');

/** Gets the state of the account, either 'active' or 'closed'.
 * @param {import('../../schemas/account').default} account
 * @returns {string}
 */
const getAccountState = (account) => {
  if (account.isYnabClosed) return 'closed';
  return 'active';
};

const getRowTintStyle = (account) => {
  if (account.isYnabClosed) {
    return { backgroundColor: 'rgba(254, 243, 199, 0.5)' };
  }
  return {};
};

export default async function initYnabAccountSelectView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 2: Select Accounts to Migrate',
      description: 'Choose which YNAB accounts should be included in the migration.',
      containerId: 'pageHeader'
    }
  });

  const accounts = new Accounts();
  await accounts.loadFromDb();

  const accountsTable = document.getElementById('ynabAccountsTable');
  const continueBtn = document.getElementById('continueBtn');
  const selectAllBtn = document.getElementById('selectAllBtn');
  const deselectAllBtn = document.getElementById('deselectAllBtn');
  const showClosedToggle = document.getElementById('showClosedToggle');
  const showClosedToggleContainer = document.getElementById('showClosedToggleContainer');
  const closedCountEl = document.getElementById('closedCount');
  const selectedCount = document.getElementById('selectedCount');
  const totalCount = document.getElementById('totalCount');

  const sortState = { key: 'name', direction: 'asc' };
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

  const getVisibleAccounts = () => accounts.accounts.filter(account => {
    if (!showClosedToggle.checked && account.isYnabClosed) return false;
    return true;
  });

  const getSortValue = (account, key) => {
    switch (key) {
      case 'name':
        return account.name || '';
      case 'type':
        return formatType(account.ynabType) || '';
      case 'budget':
        return formatBudget(account) || '';
      case 'balance':
        return account.balance ?? 0;
      case 'status':
        return getAccountState(account);
      default:
        return '';
    }
  };

  const sortAccounts = (list) => {
    const { key, direction } = sortState;
    const multiplier = direction === 'asc' ? 1 : -1;
    return [...list].sort((a, b) => {
      const aVal = getSortValue(a, key);
      const bVal = getSortValue(b, key);
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * multiplier;
      }
      return collator.compare(String(aVal), String(bVal)) * multiplier;
    });
  };

  const updateCounts = (visibleAccounts) => {
    const visible = visibleAccounts ?? getVisibleAccounts();
    const includedCount = visible.filter(account => account.included).length;
    totalCount.textContent = visible.length;
    selectedCount.textContent = includedCount;
    toggleDisabled(continueBtn, includedCount === 0);
    continueBtn.textContent = includedCount > 0
      ? `Continue with ${includedCount} account${includedCount !== 1 ? 's' : ''}`
      : 'Select at least one account';
  };

  const columns = [
    {
      key: 'included',
      type: 'checkbox',
      header: 'Migrate',
      minWidth: '90px',
      getValue: (account) => account.included,
      onChange: async (account, checked) => {
        await accounts.setInclusion(account.id, checked);
        requestAnimationFrame(() => accountsTable.updateRow(account.id));
        updateCounts();
      },
      mobileLabel: 'Migrate',
      cellStyle: getRowTintStyle,
      sortable: false
    },
    {
      key: 'name',
      type: 'text',
      header: 'Account',
      minWidth: '220px',
      /** Get the YNAB account name
       * @param {import('../../schemas/account').default} account
       * @returns {string}
       */
      getValue: (account) => account.ynabName,
      tooltip: (account) => account.ynabName,
      mobileLabel: false,
      cellStyle: getRowTintStyle,
      sortable: true
    },
    {
      key: 'type',
      type: 'text',
      header: 'Type',
      minWidth: '140px',
      getValue: (account) => formatType(account.ynabType),
      mobileLabel: 'Type',
      cellStyle: getRowTintStyle,
      sortable: true
    },
    {
      key: 'budget',
      type: 'text',
      header: 'Budget',
      minWidth: '120px',
      getValue: (account) => formatBudget(account),
      mobileLabel: 'Budget',
      cellStyle: getRowTintStyle,
      sortable: true
    },
    {
      key: 'balance',
      type: 'text',
      header: 'Balance',
      minWidth: '120px',
      getValue: (account) => currencyFormatter.format(account.balance),
      mobileLabel: 'Balance',
      cellStyle: getRowTintStyle,
      sortable: true
    },
    {
      key: 'status',
      type: 'custom',
      header: 'Status',
      minWidth: '120px',
      render: (account) => {
        const state = getAccountState(account);
        const badge = document.createElement('span');
        badge.className = 'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border';
        if (state === 'closed') {
          badge.classList.add('bg-amber-50', 'text-amber-700', 'border-amber-200');
          badge.textContent = 'Closed';
        } else {
          badge.classList.add('bg-gray-50', 'text-gray-600', 'border-gray-200');
          badge.textContent = 'Active';
        }
        return badge;
      },
      mobileLabel: 'Status',
      cellStyle: getRowTintStyle,
      sortable: true
    }
  ];

  const renderSortArrow = (direction) => {
    const rotation = direction === 'asc' ? 'rotate-180' : '';
    return `
      <svg class="w-3 h-3 ${rotation}" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M10 14a1 1 0 01-.707-.293l-4-4a1 1 0 111.414-1.414L10 11.586l3.293-3.293a1 1 0 111.414 1.414l-4 4A1 1 0 0110 14z" clip-rule="evenodd" />
      </svg>
    `;
  };

  const updateSortHeaders = () => {
    const headerCells = accountsTable.querySelectorAll('thead th');
    headerCells.forEach((th, index) => {
      const column = columns[index];
      if (!column || !column.sortable) return;

      const isActive = column.key === sortState.key;
      const label = column.header || '';
      th.classList.add('cursor-pointer', 'select-none');
      th.innerHTML = isActive
        ? `<div class="inline-flex items-center gap-1">${label}${renderSortArrow(sortState.direction)}</div>`
        : `<div class="inline-flex items-center gap-1">${label}</div>`;

      th.onclick = () => {
        if (sortState.key === column.key) {
          sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
          sortState.key = column.key;
          sortState.direction = 'asc';
        }
        refreshTable();
      };
    });
  };

  const refreshTable = () => {
    const visible = getVisibleAccounts();
    const sorted = sortAccounts(visible);
    accountsTable.data = sorted;
    updateCounts(visible);
    requestAnimationFrame(updateSortHeaders);
  };

  accountsTable.columns = columns;

  refreshTable();

  const closedCount = accounts.accounts.filter(account => account.isYnabClosed).length;
  if (closedCountEl) {
    closedCountEl.textContent = closedCount;
  }
  if (showClosedToggleContainer && closedCount === 0) {
    showClosedToggle.checked = false;
    showClosedToggleContainer.classList.add('hidden');
  } else if (showClosedToggleContainer) {
    showClosedToggle.checked = true;
    refreshTable();
  }

  showClosedToggle.addEventListener('change', refreshTable);

  selectAllBtn.addEventListener('click', async () => {
    const visible = getVisibleAccounts();
    await accounts.setInclusionFor(visible.map(account => account.id), true);
    accountsTable.refresh();
    updateCounts(visible);
  });

  deselectAllBtn.addEventListener('click', async () => {
    const visible = getVisibleAccounts();
    await accounts.setInclusionFor(visible.map(account => account.id), false);
    accountsTable.refresh();
    updateCounts(visible);
  });

  continueBtn.addEventListener('click', async () => {
    try {
      loadingOverlay.show('Fetching transaction data...');
      
      // Only process visible and selected accounts
      const visibleAccounts = getVisibleAccounts();
      const accountsToMigrate = visibleAccounts.filter(acc => acc.included);
      const allAccountsNotVisible = accounts.accounts.filter(acc => !visibleAccounts.includes(acc));
      const accountsToRemove = [...allAccountsNotVisible, ...visibleAccounts.filter(acc => !acc.included)];
      
      // Remove non-migrating accounts from IndexedDB
      if (accountsToRemove.length > 0) {
        loadingOverlay.show(`Removing ${accountsToRemove.length} excluded accounts...`);
        await accounts.removeAccounts(accountsToRemove.map(acc => acc.id));
      }
      
      // Fetch transactions for each account to migrate
      let fetchedCount = 0;
      await Promise.all(
        accountsToMigrate.map(async (account) => {
          try {
            loadingOverlay.show(`Fetching transactions for ${account.ynabName} (${++fetchedCount}/${accountsToMigrate.length})...`);
            const transactions = await getTransactions(account.id);
            account.transactions = Array.from(transactions);
            await accounts.updateAccount(account);
          } catch (error) {
            console.error(`Failed to fetch transactions for account ${account.ynabName}:`, error);
            throw error;
          }
        })
      );
      
      loadingOverlay.hide();
      navigate('/map-accounts');
    } catch (error) {
      loadingOverlay.hide();
      console.error('Failed to fetch transaction data:', error);
      alert('Failed to fetch transaction data. Please try again.');
    }
  });
}
