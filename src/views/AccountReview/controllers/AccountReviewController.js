/**
 * AccountReviewController - Main orchestrator for the Account Review view
 * Manages all modals, table state, filters, and user interactions
 * Separates UI concerns from data logic
 */

import { navigate, persistState } from '../../../router.js';
import { renderPageLayout } from '../../../components/pageLayout.js';
import { currencyFormatter } from '../../../utils/format.js';
import { getAccountTypeByName, getSubtypeByName } from '../../../utils/accountTypeUtils.js';
import { toggleDisabled } from '../../../utils/dom.js';
import Filters from '../../../utils/filters.js';
import FiltersModal from '../modals/FiltersModal.js';
import BulkRenameModal from '../modals/BulkRenameModal.js';
import BulkTypeModal from '../modals/BulkTypeModal.js';
import NameEditorModal from '../modals/NameEditorModal.js';
import monarchAccountTypes from '../../../../public/static-data/monarchAccountTypes.json';
import state from '../../../state.js';
import { getLogger, setLoggerConfig } from '../../../utils/logger.js';

const logger = getLogger('AccountReviewController');

setLoggerConfig({
  namespaces: { 'AccountReviewController': false }
});

export default class AccountReviewController {
  constructor() {
    this.filters = new Filters();
    this.accounts = state.accounts;
    this.accountsTable = null;
    this.importBtn = null;
    this.searchInput = null;

    // Modal instances
    this.filtersModal = null;
    this.bulkRenameModal = null;
    this.bulkTypeModal = null;
  }

  /**
   * Initialize the view
   */
  async init(data) {
    logger.group('init', 'Initializing AccountReviewController');

    if (data) {
      logger.log('init', 'Loaded accounts data for review:', data);
      await this.accounts.init(data);
    } else {
      logger.log('init', 'Using existing Accounts singleton');
      if (this.accounts.length() === 0) {
        logger.log('init', 'Loading accounts from IndexedDB');
        await this.accounts.load();
      }
    }

    this._renderLayout();
    this._cacheElements();
    this._setupTableColumns();
    this._initializeModals();
    this._setupEventListeners();
    this._renderTable(true);

    logger.groupEnd('init');
  }

  /**
   * Render the page layout
   */
  _renderLayout() {
    logger.group('_renderLayout', 'AccountReviewController._renderLayout()');
    try {
      logger.log('_renderLayout', 'Rendering page layout for Account Review');
      renderPageLayout({
        navbar: {
          showBackButton: true,
          showDataButton: true
        },
        header: {
          title: 'Step 2: Review Accounts',
          description: 'Review and adjust your accounts. Next, we\'ll choose how to migrate to Monarch.',
          containerId: 'pageHeader'
        }
      });
      logger.log('_renderLayout', 'Page layout rendered successfully');
    } catch (error) {
      logger.error('_renderLayout', 'Error rendering layout:', error);
    } finally {
      logger.groupEnd('_renderLayout');
    }
  }

  /**
   * Cache DOM elements
   */
  _cacheElements() {
    logger.group('_cacheElements', 'AccountReviewController._cacheElements()');
    try {
      this.accountsTable = document.getElementById('accountsTable');
      this.importBtn = document.getElementById('continueBtn');
      this.searchInput = document.getElementById('searchInput');
      logger.debug('_cacheElements', `Cached elements: accountsTable=${!!this.accountsTable}, importBtn=${!!this.importBtn}, searchInput=${!!this.searchInput}`);
      logger.log('_cacheElements', 'DOM elements cached successfully');
    } catch (error) {
      logger.error('_cacheElements', 'Error caching DOM elements:', error);
    } finally {
      logger.groupEnd('_cacheElements');
    }
  }

  /**
   * Initialize modal instances with callbacks
   */
  _initializeModals() {
    logger.group('_initializeModals', 'AccountReviewController._initializeModals()');
    try {
      logger.log('_initializeModals', 'Initializing modal instances');
      this.filtersModal = new FiltersModal(
        this.filters,
        () => this._onFiltersApplied(),
        () => this._onFiltersReset()
      );
      logger.debug('_initializeModals', 'FiltersModal initialized');

      this.bulkRenameModal = new BulkRenameModal(
        this.accounts,
        () => this._renderTable()
      );
      logger.debug('_initializeModals', 'BulkRenameModal initialized');

      this.bulkTypeModal = new BulkTypeModal(
        this.accounts,
        () => this._renderTable()
      );
      logger.debug('_initializeModals', 'BulkTypeModal initialized');
      logger.log('_initializeModals', 'All modals initialized successfully');
    } catch (error) {
      logger.error('_initializeModals', 'Error initializing modals:', error);
    } finally {
      logger.groupEnd('_initializeModals');
    }
  }

  /**
   * Setup all event listeners
   */
  _setupEventListeners() {
    logger.group('_setupEventListeners', 'Setting up event listeners');
    // Search input with debounce
    let debounceTimer;
    this.searchInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        this.filters.searchQuery = this.searchInput.value.toLowerCase();
        this._renderTable();
        persistState();
      }, 200);
    });

    // Filter button
    setTimeout(() => {
      document.getElementById('filtersBtn')?.addEventListener('click', (e) => {
        e.preventDefault();
        this.filtersModal.open();
      });
    }, 100);

    // Bulk action buttons
    this._setupBulkActionListeners();

    // Table selection changes
    this.accountsTable.addEventListener('selectionchange', (e) => this._handleTableSelectionChange(e));

    // Navigation
    this.importBtn.addEventListener('click', () => navigate('/method'));

    // Undo
    this._setupUndoListeners();

    // Initialize display
    setTimeout(async () => {
      this._updateFilterDisplay();
      const totalAccounts = this.accounts.length();
      this._updateAccountCountDisplay(totalAccounts, totalAccounts);
    }, 100);

    logger.groupEnd('_setupEventListeners');
  }

  /**
   * Setup bulk action button listeners
   */
  _setupBulkActionListeners() {
    logger.group('_setupBulkActionListeners', 'AccountReviewController._setupBulkActionListeners()');
    try {
      const buttonConfigs = [
        { selectors: ['#unselectAllBtnMobile', '#unselectAllBtnDesktop'], handler: () => this._updateAccountSelection(false), name: 'Unselect All' },
        { selectors: ['#bulkIncludeBtnMobile', '#bulkIncludeBtnDesktop'], handler: () => this._updateInclusion(true), name: 'Bulk Include' },
        { selectors: ['#bulkExcludeBtnMobile', '#bulkExcludeBtnDesktop'], handler: () => this._updateInclusion(false), name: 'Bulk Exclude' },
        { selectors: ['#bulkRenameBtnMobile', '#bulkRenameBtnDesktop'], handler: () => this.bulkRenameModal.open(), name: 'Bulk Rename' },
        { selectors: ['#bulkTypeBtnMobile', '#bulkTypeBtnDesktop'], handler: () => this.bulkTypeModal.open(), name: 'Bulk Type' }
      ];

      buttonConfigs.forEach(config => {
        config.selectors.forEach(selector => {
          const btn = document.getElementById(selector.slice(1));
          if (btn) {
            btn.addEventListener('click', config.handler);
            logger.debug('_setupBulkActionListeners', `Event listener attached to ${selector}`);
          }
        });
      });
      logger.log('_setupBulkActionListeners', 'All bulk action listeners set up successfully');
    } catch (error) {
      logger.error('_setupBulkActionListeners', 'Error setting up bulk action listeners:', error);
    } finally {
      logger.groupEnd('_setupBulkActionListeners');
    }
  }

  /**
   * Setup undo button listeners
   */
  _setupUndoListeners() {
    logger.group('_setupUndoListeners', 'AccountReviewController._setupUndoListeners()');
    try {
      const undoAllBtn = document.getElementById('undoAllBtn');
      if (undoAllBtn) {
        undoAllBtn.addEventListener('click', () => {
          logger.log('_setupUndoListeners', 'Undo all button clicked');
          if (confirm('Are you sure you want to undo all changes? This action cannot be reversed.')) {
            logger.debug('_setupUndoListeners', 'User confirmed undo all changes');
            this._undoAllChanges();
          } else {
            logger.debug('_setupUndoListeners', 'User cancelled undo all changes');
          }
        });
        logger.debug('_setupUndoListeners', 'Undo all button listener attached');
      }

      // Per-row undo via event delegation
      this.accountsTable.addEventListener('click', (e) => {
        const undoBtn = e.target.closest('[data-undo-button]');
        if (undoBtn) {
          logger.debug('_setupUndoListeners', `Undo button clicked for row ${undoBtn.dataset.rowId}`);
          this._undoRowChanges(undoBtn.dataset.rowId);
        }
      });
      logger.log('_setupUndoListeners', 'Undo listeners set up successfully');
    } catch (error) {
      logger.error('_setupUndoListeners', 'Error setting up undo listeners:', error);
    } finally {
      logger.groupEnd('_setupUndoListeners');
    }
  }

  /**
   * Handle table selection changes
   */
  _handleTableSelectionChange(e) {
    logger.group('_handleTableSelectionChange', 'AccountReviewController._handleTableSelectionChange()', { detail: e.detail });
    try {
      const selectedCount = e.detail.count;
      const bar = document.getElementById('bulkActionBar');
      logger.log('_handleTableSelectionChange', `Selection changed: ${selectedCount} account(s) selected`);

      // Update selection count displays
      document.getElementById('selectedCountMobile').textContent = selectedCount;
      document.getElementById('selectCountMobileLabel').textContent = selectedCount === 1 ? 'Account' : 'Accounts';
      document.getElementById('selectedCountDesktop').textContent = selectedCount;
      document.getElementById('selectCountDesktopLabel').textContent = selectedCount === 1 ? 'Account' : 'Accounts';
      logger.debug('_handleTableSelectionChange', 'Selection count displays updated');

      // Update account selected state
      this.accounts.forEach(acc => {
        acc.selected = e.detail.selectedRows.some(row => row.id === acc.id);
      });
      logger.debug('_handleTableSelectionChange', `Account selected states updated: ${e.detail.selectedRows.map(r => r.id).join(', ') || 'none'}`);

      // Update bulk action bar visibility
      if (selectedCount > 0) {
        bar.classList.remove('hidden');
        bar.classList.add('flex');
        logger.debug('_handleTableSelectionChange', 'Bulk action bar shown');
      } else {
        bar.classList.add('hidden');
        bar.classList.remove('flex');
        logger.debug('_handleTableSelectionChange', 'Bulk action bar hidden');
      }
    } catch (err) {
      logger.error('_handleTableSelectionChange', 'Error handling selection change:', err);
    } finally {
      logger.groupEnd('_handleTableSelectionChange');
    }
  }

  /**
   * Setup table columns configuration
   */
  _setupTableColumns() {
    console.group("AccountReviewController._setupTableColumns()");
    this.accountsTable.columns = [
      {
        key: 'select',
        type: 'checkbox',
        header: '',
        width: '60px',
        masterCheckbox: true,
        // TODO: Disabled state still have cursor pointer.
        // TODO: On change doesn't show floating action bar.
        disabled: (account) => {
          logger.group('_setupTableColumns', 'Determining disabled state for select checkbox', { accountId: account.id });
          const isDisabled = account.isProcessed();
          logger.groupEnd('_setupTableColumns');
          return isDisabled;
        },
        mobileHidden: true
      },
      {
        key: 'name',
        type: 'text',
        header: 'Account Name',
        minWidth: '200px',
        cellClass: 'px-2 py-2 max-w-[300px]',
        disabled: (account) => {
          logger.group('_setupTableColumns', 'Determining disabled state for name', { accountId: account.id });
          const isDisabled = account.isProcessed();
          logger.groupEnd('_setupTableColumns');
          return isDisabled;
        },
        clickable: (account) => {
          logger.group('_setupTableColumns', 'Determining clickable state for name', { accountId: account.id });
          const isClickable = !account.isProcessed();
          logger.groupEnd('_setupTableColumns');
          return isClickable;
        },
        getValue: (account) => account.current.name,
        tooltip: (account) => {
          logger.group('_setupTableColumns', 'Getting tooltip for name', { accountId: account.id });
          const tooltip = account.isProcessed() ? account.current.name : `Click to rename '${account.current.name}'`;
          logger.groupEnd('_setupTableColumns');
          return tooltip;
        },
        onClick: (account) => {
          logger.group('_setupTableColumns', 'Handling name click', { accountId: account.id });
          const isEnabled = !account.isProcessed();
          if (isEnabled) this._openNameEditor(account);
          logger.groupEnd('_setupTableColumns');
        },
        mobileLabel: false,
        mobileClass: 'mb-2'
      },
      {
        key: 'type',
        type: 'select',
        header: 'Type',
        minWidth: '150px',
        getValue: (account) => account.current.type,
        options: monarchAccountTypes.data.map(type => ({
          value: type.typeName,
          label: type.typeDisplay
        })),
        disabled: (account) => {
          logger.group('_setupTableColumns', 'Determining disabled state for type', { accountId: account.id });
          const isDisabled = account.isProcessed();
          logger.groupEnd('_setupTableColumns');
          return isDisabled;
        },
        tooltip: (account) => {
          logger.group('_setupTableColumns', 'Getting tooltip for type', { accountId: account.id });
          const tooltip = getAccountTypeByName(account.current.type)?.typeDisplay || '';
          logger.groupEnd('_setupTableColumns');
          return tooltip;
        },
        onChange: async (account, value) => {
          logger.group('_setupTableColumns', 'Handling type change', { accountId: account.id, newType: value });
          const selectedType = getAccountTypeByName(value);
          const newSubtype = selectedType?.subtypes[0]?.name || null;
          await account.setType(value);
          await account.setSubtype(newSubtype);
          requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
          logger.groupEnd('_setupTableColumns');
        },
        mobileLabel: 'Type'
      },
      {
        key: 'subtype',
        type: 'select',
        header: 'Subtype',
        minWidth: '150px',
        getValue: (account) => account.current.subtype || '',
        options: (account) => {
          logger.group('_setupTableColumns', 'Getting options for subtype', { accountId: account.id });
          const selectedType = getAccountTypeByName(account.current.type);
          const options = (selectedType?.subtypes || []).map(sub => ({
            value: sub.name,
            label: sub.display
          }));
          logger.groupEnd('_setupTableColumns');
          return options;
        },
        disabled: (account) => {
          logger.group('_setupTableColumns', 'Determining disabled state for subtype', { accountId: account.id });
          const isDisabled = account.isProcessed();
          logger.groupEnd('_setupTableColumns');
          return isDisabled;
        },
        tooltip: (account) => {
          logger.group('_setupTableColumns', 'Getting tooltip for subtype', { accountId: account.id });
          const tooltip = getSubtypeByName(account.current.type, account.current.subtype)?.display || '';
          logger.groupEnd('_setupTableColumns');
          return tooltip;
        },
        onChange: async (account, value) => {
          logger.group('_setupTableColumns', 'Handling subtype change', { accountId: account.id, newSubtype: value });
          await account.setSubtype(value);
          requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
          logger.groupEnd('_setupTableColumns');
        },
        mobileLabel: 'Subtype'
      },
      {
        key: 'transactionCount',
        type: 'text',
        header: 'Transactions',
        minWidth: '100px',
        getValue: (account) => account.transactionCount,
        tooltip: (account) => {
          logger.group('_setupTableColumns', 'Getting tooltip for transactionCount', { accountId: account.id });
          const tooltip = `${account.transactionCount} transaction${account.transactionCount !== 1 ? 's' : ''}`;
          logger.groupEnd('_setupTableColumns');
          return tooltip;
        },
        cellStyle: (account) => {
          logger.group('_setupTableColumns', 'Determining cellStyle for transactionCount', { accountId: account.id });
          const style = account.isProcessed() ? { color: '#9ca3af' } : { color: '#727985ff' };
          logger.groupEnd('_setupTableColumns');
          return style;
        },
        mobileLabel: 'Txns'
      },
      {
        key: 'balance',
        type: 'text',
        header: 'Balance',
        minWidth: '120px',
        getValue: (account) => currencyFormatter.format(account.balance),
        tooltip: (account) => `Balance: ${currencyFormatter.format(account.balance)}`,
        cellStyle: (account) => {
          logger.group('_setupTableColumns', 'Determining cellStyle for balance', { accountId: account.id });
          const style = account.isProcessed() ? { color: '#9ca3af' } : { color: '#727985ff' };
          logger.groupEnd('_setupTableColumns');
          return style;
        },
        mobileLabel: 'Balance'
      },
      {
        key: 'undo',
        type: 'custom',
        header: '',
        width: '50px',
        render: (account) => {
          logger.group('_setupTableColumns', 'Rendering \'undo\' button for account', { accountId: account.id });
          const container = document.createElement('div');
          container.className = 'flex items-center justify-center';
          if (account.isModified()) {
            const button = document.createElement('button');
            button.className = 'p-1.5 rounded hover:bg-amber-100 transition-colors';
            button.title = 'Undo changes';
            button.innerHTML = `
              <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
            `;
            button.addEventListener('click', () => this._undoRowChanges(account.id));
            container.appendChild(button);
          }
          logger.groupEnd('_setupTableColumns');
          return container;
        },
        mobileHidden: true
      },
      {
        // TODO: Onclick isn't working.
        key: 'included',
        type: 'button',
        header: 'Migrate?',
        minWidth: '100px',
        render: (account) => {
          logger.group('_setupTableColumns', 'Rendering \'included\' button for account', { accountId: account.id });
          const isProcessed = account.isProcessed();
          const result = {
            text: isProcessed ? 'Migrated' : (account.included ? 'Included' : 'Excluded'),
            type: 'outline',
            color: isProcessed ? 'grey' : (account.included ? 'green' : 'red'),
            size: 'small',
            disabled: isProcessed,
            tooltip: isProcessed
              ? 'This account has already been processed'
              : (account.included ? 'Click to exclude' : 'Click to include'),
            onClick: async () => {
              await account.toggleInclusion();
              requestAnimationFrame(() => this.accountsTable.updateRow(account.id));
            }
          };
          logger.groupEnd('_setupTableColumns');
          return result;
        },
        mobileLabel: 'Migrate'
      }
    ];
    console.groupEnd();
  }

  /**
   * Render the accounts table
   * @param {boolean} skipSync - Skip IndexedDB sync if data is already fresh
   */
  async _renderTable(skipSync = false) {
    logger.group('_renderTable', 'AccountReviewController._renderTable()');

    const visibleAccounts = this.accounts.getVisible(this.filters);
    logger.debug('_renderTable', 'visible accounts:', visibleAccounts);

    this.accountsTable.data = visibleAccounts;

    this._updateAccountCountDisplay(visibleAccounts.length, this.accounts.length());

    const hasIncludedAccounts = this.accounts.getIncludedAndUnprocessed().length > 0;
    toggleDisabled(this.importBtn, !hasIncludedAccounts);
    this.importBtn.title = this.importBtn.disabled ? 'At least one account must be included to proceed' : '';

    if (hasIncludedAccounts) {
      this.importBtn.textContent = `Migrate ${this.accounts.getIncludedAndUnprocessed().length} of ${this.accounts.length()} account${this.accounts.length() !== 1 ? 's' : ''}`;
    } else {
      this.importBtn.textContent = 'Continue';
    }

    this._updateChangesAlert();
    logger.groupEnd('_renderTable');
  }

  /**
   * Open name editor for an account
   */
  _openNameEditor(account) {
    logger.group('_openNameEditor', 'AccountReviewController._openNameEditor()');
    logger.log('_openNameEditor', `Opening name editor for account ${account.id}: "${account.current.name}"`);
    try {
      const editor = new NameEditorModal(account, () => {
        logger.debug('_openNameEditor', 'Name editor closed, refreshing table');
        this.accountsTable.refresh();
      });
      editor.open();
      logger.log('_openNameEditor', 'Name editor opened successfully');
    } catch (error) {
      logger.error('_openNameEditor', 'Error opening name editor:', error);
    } finally {
      logger.groupEnd('_openNameEditor');
    }
  }

  /**
   * Update account inclusion status
   */
  async _updateInclusion(include) {
    logger.group('_updateInclusion', 'AccountReviewController._updateInclusion()', { include });
    logger.log('_updateInclusion', `Updating inclusion status to ${include ? 'included' : 'excluded'}`);
    if (include) {
      await this.accounts.includeAll();
    } else {
      await this.accounts.excludeAll();
    }
    await this._renderTable();
    logger.groupEnd('_updateInclusion');
  }

  /**
   * Update account selection
   */
  _updateAccountSelection(shouldSelect) {
    logger.group('_updateAccountSelection', 'AccountReviewController._updateAccountSelection()', { shouldSelect });
    try {
      const action = shouldSelect ? 'selecting' : 'deselecting';
      logger.log('_updateAccountSelection', `${action.charAt(0).toUpperCase() + action.slice(1)} all ${this.accounts.length()} accounts`);
      shouldSelect ? this.accounts.selectAll() : this.accounts.deselectAll();
      logger.debug('_updateAccountSelection', `All accounts now ${shouldSelect ? 'selected' : 'deselected'}`);
      this._renderTable();
      logger.log('_updateAccountSelection', 'Account selection updated and table re-rendered');
    } catch (error) {
      logger.error('_updateAccountSelection', 'Error updating account selection:', error);
    } finally {
      logger.groupEnd('_updateAccountSelection');
    }
  }

  /**
   * Undo all changes
   */
  async _undoAllChanges() {
    logger.group('_undoAllChanges', 'AccountReviewController._undoAllChanges()');
    logger.log('_undoAllChanges', 'Undoing all account changes');
    await this.accounts.undoAllChanges();
    await this._renderTable();
    logger.groupEnd('_undoAllChanges');
  }

  /**
   * Undo changes for a specific account
   */
  async _undoRowChanges(accountId) {
    logger.group('_undoRowChanges', 'AccountReviewController._undoRowChanges()', { accountId });
    logger.log('_undoRowChanges', `Undoing changes for account ${accountId}`);
    await this.accounts.undoAccountChanges(accountId);
    await this._renderTable();
    logger.groupEnd('_undoRowChanges');
  }

  /**
   * Handle when filters are applied
   */
  _onFiltersApplied() {
    logger.group('_onFiltersApplied', 'AccountReviewController._onFiltersApplied()');
    logger.log('_onFiltersApplied', 'Filters applied, re-rendering table');
    try {
      this._renderTable();
      this._updateFilterDisplay();
      logger.log('_onFiltersApplied', 'Filter display updated');
    } catch (error) {
      logger.error('_onFiltersApplied', 'Error applying filters:', error);
    } finally {
      logger.groupEnd('_onFiltersApplied');
    }
  }

  /**
   * Handle when filters are reset
   */
  _onFiltersReset() {
    logger.group('_onFiltersReset', 'AccountReviewController._onFiltersReset()');
    logger.log('_onFiltersReset', 'Filters reset, re-rendering table');
    try {
      this._renderTable();
      this._updateFilterDisplay();
      logger.log('_onFiltersReset', 'Filter display updated');
    } catch (error) {
      logger.error('_onFiltersReset', 'Error resetting filters:', error);
    } finally {
      logger.groupEnd('_onFiltersReset');
    }
  }

  /**
   * Update filter display badge
   */
  _updateFilterDisplay() {
    logger.group('_updateFilterDisplay', 'AccountReviewController._updateFilterDisplay()');
    try {
      const filterNotificationBadge = document.getElementById('filterNotificationBadge');
      const numberOfActiveFilters = this.filters.getNumberOfActiveFilters();
      logger.log('_updateFilterDisplay', `Number of active filters: ${numberOfActiveFilters}`);
      filterNotificationBadge.classList.toggle('hidden', numberOfActiveFilters === 0);
      filterNotificationBadge.textContent = numberOfActiveFilters;
      logger.debug('_updateFilterDisplay', 'Filter badge updated');
    } catch (error) {
      logger.error('_updateFilterDisplay', 'Error updating filter display:', error);
    } finally {
      logger.groupEnd('_updateFilterDisplay');
    }
  }

  /**
   * Update account count display
   */
  _updateAccountCountDisplay(visibleCount, totalCount) {
    logger.group('_updateAccountCountDisplay', 'AccountReviewController._updateAccountCountDisplay()');
    try {
      logger.log('_updateAccountCountDisplay', `Displaying ${visibleCount} visible accounts out of ${totalCount} total`);
      // TODO: On load, there's a second where a code expression appears before it renders correctly.
      document.getElementById('visibleAccountCount').innerHTML = visibleCount;
      document.getElementById('totalAccountCount').innerHTML = totalCount;
      logger.debug('_updateAccountCountDisplay', 'Account count displays updated');

      const filterCount = this.filters.getNumberOfActiveFilters();
      const filterNotificationBadge = document.getElementById('filterNotificationBadge');
      filterNotificationBadge.textContent = filterCount;
      filterNotificationBadge.classList.toggle('hidden', filterCount === 0);
      logger.debug('_updateAccountCountDisplay', `Filter count badge set to ${filterCount}`);

      const filterResultsSummary = document.getElementById('filterResultsSummary');
      filterResultsSummary.classList.toggle('filtered', filterCount > 0);
      logger.debug('_updateAccountCountDisplay', `Filter results summary ${filterCount > 0 ? 'marked' : 'unmarked'} as filtered`);
    } catch (error) {
      logger.error('_updateAccountCountDisplay', 'Error updating account count display:', error);
    } finally {
      logger.groupEnd('_updateAccountCountDisplay');
    }
  }

  /**
   * Update changes alert visibility
   */
  async _updateChangesAlert() {
    logger.group('_updateChangesAlert', 'AccountReviewController._updateChangesAlert()');
    const undoAllContainer = document.getElementById('undoAllContainer');
    const hasChanges = await this.accounts.hasChanges();
    logger.log('_updateChangesAlert', `Has changes: ${hasChanges}`);
    undoAllContainer.classList.toggle('hidden', !hasChanges);
    logger.debug('_updateChangesAlert', `Undo all container ${hasChanges ? 'shown' : 'hidden'}`);
    logger.groupEnd('_updateChangesAlert');
  }
}
