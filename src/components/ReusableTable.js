/**
 * ReusableTable Web Component
 * Generic self-managing table with reactive state, master checkbox, and customizable cells.
 * Supports desktop table view and mobile card view with automatic responsiveness.
 * 
 * Features:
 * - Master checkbox with indeterminate state
 * - Row selection propagation
 * - Customizable cell renderers
 * - Mobile responsive cards
 * - Filtering and search integration
 * - Bulk action bar integration
 */

import { signal, computed } from '../core/reactiveState.js';
import '../components/AutoStyledButton.js';
import Account from '../schemas/account.js';
import Accounts from '../schemas/accounts.js';
import {AccountMigrationStatus} from '../utils/enumAccountMigrationStatus.js';

class ReusableTable extends HTMLElement {
  /**
   * Initialize the ReusableTable component with reactive state and configuration
   */
  constructor() {
    super();

    // Reactive state
    this._data = signal(new Accounts());
    this._columns = signal([]);
    this._selectedRows = signal(new Set());
    this._visibleRows = signal([]);

    // Computed properties
    this._allSelected = computed(() => {
      const visible = this._visibleRows.value;
      const selected = this._selectedRows.value;
      return visible.length > 0 && visible.every(row => selected.has(this._getRowId(row)));
    });

    this._someSelected = computed(() => {
      const visible = this._visibleRows.value;
      const selected = this._selectedRows.value;
      const selectedCount = visible.filter(row => selected.has(this._getRowId(row))).length;
      return selectedCount > 0 && selectedCount < visible.length;
    });

    // Configuration
    this._mobileBreakpoint = 'lg';
    this._enableSelection = true;
    this._rowIdKey = 'id';
    this._enableRowClickToggle = false;

    // Bind methods
    this._handleMasterCheckboxChange = this._handleMasterCheckboxChange.bind(this);
    this._handleRowCheckboxChange = this._handleRowCheckboxChange.bind(this);
  }

  /**
   * Lifecycle callback invoked when the element is added to the DOM
   * Reads attributes and initializes the table
   */
  connectedCallback() {
    // Read attributes
    this._mobileBreakpoint = this.getAttribute('data-mobile-breakpoint') || 'lg';
    this._enableSelection = this.getAttribute('data-enable-selection') !== 'false';
    this._rowIdKey = this.getAttribute('data-row-id-key') || 'id';
    this._enableRowClickToggle = this.getAttribute('data-row-click-toggle') === 'true';

    this._render();
    this._setupSubscriptions();
  }

  /**
   * Lifecycle callback invoked when the element is removed from the DOM
   * Cleans up all reactive subscriptions to prevent memory leaks
   */
  disconnectedCallback() {
    // Cleanup subscriptions
    if (this._dataUnsubscribe) this._dataUnsubscribe();
    if (this._columnsUnsubscribe) this._columnsUnsubscribe();
    if (this._selectedUnsubscribe) this._selectedUnsubscribe();
    if (this._visibleUnsubscribe) this._visibleUnsubscribe();
  }

  /**
   * Set up reactive subscriptions for data, columns, selection, and visible rows
   * Automatically triggers appropriate updates when reactive state changes
   */
  _setupSubscriptions() {
    // Re-render when data or columns change
    this._dataUnsubscribe = this._data.subscribe(() => this._updateTable());
    this._columnsUnsubscribe = this._columns.subscribe(() => this._updateTable());
    this._selectedUnsubscribe = this._selectedRows.subscribe(() => this._updateSelection());
    this._visibleUnsubscribe = this._visibleRows.subscribe(() => this._updateMasterCheckbox());
  }

  /**
   * Initial render of the table structure (both mobile and desktop views)
   * Creates the HTML skeleton with master checkboxes and empty containers
   */
  _render() {
    this.className = 'ui-table-container bg-white rounded-lg shadow-sm overflow-hidden';

    this.innerHTML = `
      <!-- Mobile Card View -->
      <div class="mobile-view block ${this._mobileBreakpoint}:hidden bg-gray-50">
        ${this._enableSelection ? `
        <div class="border-b border-gray-200 bg-white p-3 sm:p-4">
          <div class="flex items-center justify-between">
            <label class="custom-checkbox-container flex items-center">
              <input id="masterCheckboxMobile" type="checkbox" class="master-checkbox-mobile custom-checkbox-input">
              <span class="custom-checkbox-visual"></span>
              <span class="text-sm font-medium text-gray-700 pl-2">Select All</span>
            </label>
            <div class="text-xs text-gray-500 font-semibold selection-count-mobile">0 selected</div>
          </div>
        </div>
        ` : ''}
        <div class="mobile-list space-y-2 p-3 sm:p-4"></div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="desktop-view hidden ${this._mobileBreakpoint}:block h-full overflow-auto">
        <table class="w-full min-w-[800px]" role="grid">
          <thead>
            <tr class="bg-gray-50 border-b border-gray-200" role="row"></tr>
          </thead>
          <tbody class="divide-y divide-gray-100"></tbody>
        </table>
      </div>
    `;

    this._updateTable();
  }

  /**
   * Update the entire table content (both mobile and desktop views)
   * Re-renders all rows and sets up event listeners
   */
  _updateTable() {
    const data = this._getAccountRows();
    const columns = this._columns.value;

    // Update visible rows (will be filtered externally)
    this._visibleRows.value = data;

    // Render desktop table
    this._renderDesktopTable(data, columns);

    // Render mobile cards
    this._renderMobileCards(data, columns);

    // Attach master checkbox event listener for mobile view
    const mobileMasterCheckbox = this.querySelector('#masterCheckboxMobile');
    if (mobileMasterCheckbox) {
      mobileMasterCheckbox.removeEventListener('change', this._handleMasterCheckboxChange);
      mobileMasterCheckbox.addEventListener('change', this._handleMasterCheckboxChange);
    }

    // Update selection state
    this._updateSelection();
  }

  /**
   * Render the desktop table view with headers and rows
   * @param {Accounts} accountList - Accounts instance.
   * @param {Array<Object>} columns - Column configuration objects
   */
  _renderDesktopTable(accountList, columns) {
    const thead = this.querySelector('thead tr');
    const tbody = this.querySelector('tbody');

    if (!thead || !tbody) return;

    // Render headers
    thead.innerHTML = '';
    columns.forEach(col => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.className = col.headerClass || 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900';
      th.style.position = 'sticky';
      th.style.top = '0';
      th.style.backgroundColor = 'rgb(249 250 251)';
      th.style.zIndex = '10';

      if (col.width) th.style.width = col.width;
      if (col.minWidth) th.style.minWidth = col.minWidth;

      if (col.type === 'checkbox' && col.masterCheckbox) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'master-checkbox w-4 h-4 sm:w-5 sm:h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2';
        checkbox.addEventListener('change', this._handleMasterCheckboxChange);
        th.appendChild(checkbox);
      } else {
        th.textContent = col.header || '';
      }

      thead.appendChild(th);
    });

    // Render rows
    tbody.innerHTML = '';
    accountList.forEach(account => {
      console.debug('Rendering row:', account);
      const tr = document.createElement('tr');
      tr.setAttribute('role', 'row');
      tr.className = 'border-t border-gray-100';
      
      // Subtle visual indicator for modified rows
      if (account.migrationStatus === AccountMigrationStatus.COMPLETED) {
        tr.classList.add('bg-amber-50', 'border-l-4', 'border-l-amber-300');
      }
      
      tr.dataset.rowId = this._getRowId(account);

      if (this._enableRowClickToggle) {
        tr.classList.add('cursor-pointer', 'hover:bg-gray-50', 'transition-colors');
        tr.addEventListener('click', (event) => {
          const target = event.target;
          if (!target) return;
          const interactive = target.closest('input, select, button, ui-button, a, label');
          if (interactive) return;
          const checkbox = tr.querySelector('input[type="checkbox"]');
          if (!checkbox || checkbox.disabled) return;
          checkbox.click();
        });
      }

      columns.forEach(col => {
        const td = document.createElement('td');
        td.className = col.cellClass || 'px-3 sm:px-4 py-3 sm:py-4';

        this._renderCell(td, col, account);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  /**
   * Render the mobile card view with responsive card layout
   * @param {Account[]} data - Array of Account class instances to display
   * @param {Array<Object>} columns - Column configuration objects
   */
  _renderMobileCards(data, columns) {
    const mobileList = this.querySelector('.mobile-list');
    if (!mobileList) return;

    mobileList.innerHTML = '';

    data.forEach(row => {
      const card = document.createElement('div');
      card.className = 'mobile-card overflow-hidden';
      
      // Subtle visual indicator for modified rows on mobile
      if (row.migrationStatus === AccountMigrationStatus.COMPLETED) {
        card.classList.add('bg-amber-50', 'border-l-4', 'border-l-amber-300');
      } else {
        card.classList.add('bg-white', 'border', 'border-gray-100');
      }
      
      card.dataset.rowId = this._getRowId(row);

      if (this._enableRowClickToggle) {
        card.classList.add('cursor-pointer', 'hover:bg-gray-50', 'transition-colors');
        card.addEventListener('click', (event) => {
          const target = event.target;
          if (!target) return;
          const interactive = target.closest('input, select, button, ui-button, a, label');
          if (interactive) return;
          const checkbox = card.querySelector('input[type="checkbox"]');
          if (!checkbox || checkbox.disabled) return;
          checkbox.click();
        });
      }

      // Card wrapper with padding
      const wrapper = document.createElement('div');
      wrapper.className = 'p-3 sm:p-4';

      // Card header: selection checkbox and primary field
      const headerDiv = document.createElement('div');
      headerDiv.className = 'flex items-center gap-3 mb-3 pb-3 border-b border-gray-100';

      // Render mobile card content
      const selectCol = columns.find(c => c.type === 'checkbox' && c.masterCheckbox);
      if (selectCol && this._enableSelection) {
        const checkboxContainer = this._createMobileCheckbox(row);
        checkboxContainer.className = 'flex-shrink-0';
        headerDiv.appendChild(checkboxContainer);
      }

      // Primary field (usually account name) - make prominent
      const primaryCol = columns.find(c => c.key === 'name');
      if (primaryCol && !primaryCol.mobileHidden) {
        const primaryDiv = document.createElement('div');
        primaryDiv.className = 'flex-1 min-w-0';
        const nameValue = document.createElement('div');
        nameValue.className = 'text-sm font-semibold text-gray-900 truncate';
        const displayValue = primaryCol.getValue ? primaryCol.getValue(row) : row[primaryCol.key];
        nameValue.textContent = displayValue || '';
        const isClickable = primaryCol.clickable ? (typeof primaryCol.clickable === 'function' ? primaryCol.clickable(row) : primaryCol.clickable) : false;
        if (isClickable) {
          nameValue.className += ' cursor-pointer hover:text-blue-600 transition-colors';
          if (primaryCol.onClick) {
            nameValue.addEventListener('click', () => primaryCol.onClick(row));
          }
        }
        primaryDiv.appendChild(nameValue);
        headerDiv.appendChild(primaryDiv);
      }

      wrapper.appendChild(headerDiv);

      // Card body: grid layout for other fields
      const bodyDiv = document.createElement('div');
      bodyDiv.className = 'grid grid-cols-2 gap-3 sm:gap-4 text-sm';

      let fieldCount = 0;
      // Render mobile layout for other columns in a compact grid
      columns.forEach(col => {
        if (col.type === 'checkbox' && col.masterCheckbox) return; // Skip, already rendered
        if (col.key === 'name') return; // Skip, already rendered in header
        if (col.mobileHidden) return;
        if (col.type === 'custom' && col.key === 'undo') return; // Handle undo separately
        if (col.type === 'button') return; // Skip buttons, handle in footer
        if (col.mobileLayout === 'full') return; // Skip full-width columns, handle in footer

        fieldCount++;
        const fieldDiv = document.createElement('div');
        
        // Use column-specific mobile layout or default to compact format
        if (col.mobileLayout === 'full') {
          fieldDiv.className = 'col-span-2 flex flex-col gap-1';
        } else {
          fieldDiv.className = 'flex flex-col gap-1';
        }

        // Label
        if (col.mobileLabel !== false) {
          const label = document.createElement('span');
          label.className = 'text-xs font-semibold text-gray-500 uppercase tracking-wide';
          label.textContent = col.mobileLabel || col.header;
          fieldDiv.appendChild(label);
        }

        // Value
        const valueContainer = document.createElement('div');
        valueContainer.className = 'min-w-0';
        this._renderCell(valueContainer, col, row, true);
        fieldDiv.appendChild(valueContainer);

        bodyDiv.appendChild(fieldDiv);
      });

      wrapper.appendChild(bodyDiv);

      // Card footer: action buttons
      let hasActions = false;
      const actionButtons = [];
      
      // Collect action columns (undo, migrate button, etc)
      columns.forEach(col => {
        if (col.type === 'button' || (col.type === 'custom' && col.key === 'undo')) {
          hasActions = true;
          actionButtons.push(col);
        }
      });

      if (hasActions) {
        const footerDiv = document.createElement('div');
        footerDiv.className = 'mt-3 pt-3 border-t border-gray-100 flex items-center gap-2 flex-wrap';

        actionButtons.forEach(col => {
          const container = document.createElement('div');
          if (col.type === 'button') {
            container.className = 'flex-1 min-w-[120px]';
          } else {
            container.className = 'flex-shrink-0';
          }
          this._renderCell(container, col, row, true);
          footerDiv.appendChild(container);
        });

        wrapper.appendChild(footerDiv);
      }

      card.appendChild(wrapper);
      mobileList.appendChild(card);
    });
  }

  /**
   * Create a styled checkbox element for mobile card selection
   * @param {Object} row - The data row object
   * @returns {HTMLLabelElement} The checkbox container element
   */
  _createMobileCheckbox(row) {
    const container = document.createElement('label');
    container.className = 'custom-checkbox-container flex-shrink-0';

    const checkbox = document.createElement('input');
    checkbox.id = 'rowCheckboxMobile_' + this._getRowId(row);
    checkbox.type = 'checkbox';
    checkbox.className = 'row-checkbox custom-checkbox-input';
    checkbox.dataset.rowId = this._getRowId(row);
    checkbox.checked = this._selectedRows.value.has(this._getRowId(row));
    checkbox.addEventListener('change', this._handleRowCheckboxChange);

    const visual = document.createElement('span');
    visual.className = 'custom-checkbox-visual';

    container.appendChild(checkbox);
    container.appendChild(visual);
    return container;
  }

  /**
   * Render a single cell based on column type and configuration
   * @param {HTMLElement} container - The DOM element to render the cell content into
   * @param {Object} col - Column configuration object
   * @param {Account} row - The data row object
   * @param {boolean} [isMobile=false] - Whether rendering for mobile view
   */
  _renderCell(container, col, row, isMobile = false) {
    const isDisabled = col.disabled ? col.disabled(row) : false;

    switch (col.type) {
      case 'checkbox':
        if (!col.masterCheckbox) {
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'w-5 h-5 rounded border-gray-300 cursor-pointer';
          checkbox.checked = col.getValue ? col.getValue(row) : row[col.key];
          checkbox.disabled = isDisabled;
          if (col.onChange) {
            checkbox.addEventListener('change', () => col.onChange(row, checkbox.checked));
          }
          container.appendChild(checkbox);
        } else {
          // Row selection checkbox
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          checkbox.className = 'row-checkbox w-5 h-5 rounded border-gray-300 cursor-pointer';
          checkbox.dataset.rowId = this._getRowId(row);
          checkbox.checked = this._selectedRows.value.has(this._getRowId(row));
          checkbox.disabled = isDisabled;
          checkbox.addEventListener('change', this._handleRowCheckboxChange);
          container.appendChild(checkbox);
        }
        break;

      case 'text':
        const text = col.getValue ? col.getValue(row) : row[col.key];
        container.textContent = text;
        container.className += ' truncate';

        if (col.clickable && !isDisabled) {
          container.className += ' cursor-pointer hover:text-blue-600 transition-colors duration-200';
          if (col.onClick) {
            container.addEventListener('click', () => col.onClick(row));
          }
        } else if (isDisabled) {
          container.className += ' text-gray-400 cursor-default';
        }

        if (col.tooltip) {
          container.title = typeof col.tooltip === 'function' ? col.tooltip(row) : col.tooltip;
        }
        break;

      case 'select':
        const select = document.createElement('select');
        const baseClasses = 'border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white font-medium';
        const mobileClasses = 'text-xs px-2 py-1.5';
        const desktopClasses = 'text-sm px-2 py-1';
        select.className = baseClasses + ' ' + (isMobile ? mobileClasses : desktopClasses);
        select.disabled = isDisabled;

        if (isDisabled) {
          select.className += ' text-gray-400 bg-gray-50 cursor-not-allowed';
        } else {
          select.className += ' cursor-pointer text-gray-900';
        }

        const currentValue = col.getValue ? col.getValue(row) : row[col.key];
        const options = col.options ? (typeof col.options === 'function' ? col.options(row) : col.options) : [];

        options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          if (opt.value === currentValue) option.selected = true;
          select.appendChild(option);
        });

        if (col.onChange) {
          select.addEventListener('change', (e) => {
            try {
              if (e && e.target && row) {
                col.onChange(row, select.value);
              }
            } catch (error) {
              console.error('Error in select onChange:', error);
            }
          });
        }

        if (col.tooltip) {
          select.title = typeof col.tooltip === 'function' ? col.tooltip(row) : col.tooltip;
        }

        container.appendChild(select);
        break;

      case 'button':
        const buttonConfig = col.render ? col.render(row) : {};
        const button = document.createElement('ui-button');
        button.className = 'ui-button';
        button.dataset.type = buttonConfig.type || 'solid';
        button.dataset.color = buttonConfig.color || 'blue';
        button.dataset.size = buttonConfig.size || (isMobile ? 'small' : 'medium');
        button.textContent = buttonConfig.text || '';
        button.dataset.fullwidth = isMobile ? 'true' : 'false';
        button.disabled = isDisabled || buttonConfig.disabled;

        if (buttonConfig.onClick) {
          button.addEventListener('click', () => buttonConfig.onClick(row));
        }

        if (buttonConfig.tooltip || col.tooltip) {
          button.title = buttonConfig.tooltip || (typeof col.tooltip === 'function' ? col.tooltip(row) : col.tooltip);
        }

        container.appendChild(button);
        break;

      case 'custom':
        if (col.render) {
          const customContent = col.render(row, isMobile);
          if (typeof customContent === 'string') {
            container.innerHTML = customContent;
          } else if (customContent instanceof HTMLElement) {
            container.appendChild(customContent);
          }
        }
        break;

      default:
        const value = col.getValue ? col.getValue(row) : row[col.key];
        container.textContent = value || '';
    }

    // Apply custom cell styling
    if (col.cellStyle) {
      const styles = typeof col.cellStyle === 'function' ? col.cellStyle(row) : col.cellStyle;
      Object.assign(container.style, styles);
    }
  }

  /**
   * Handle master checkbox change to select/deselect all visible rows
   * @param {Event} e - The change event from the master checkbox
   */
  _handleMasterCheckboxChange(e) {
    const visibleRows = this._visibleRows.value;
    const selected = new Set(this._selectedRows.value);

    // Use the checkbox's current checked state to determine what to do
    // The browser has already updated this before our handler fires
    const checkbox = e.target;
    const shouldSelectAll = checkbox.checked;

    visibleRows.forEach(row => {
      const rowId = this._getRowId(row);
      if (shouldSelectAll) {
        selected.add(rowId);
      } else {
        selected.delete(rowId);
      }
    });

    this._selectedRows.value = selected;
    // The subscription to _selectedRows will call _updateSelection()
    // We need to explicitly emit the change event
    setTimeout(() => {
      this._emitSelectionChange();
    }, 0);
  }

  /**
   * Handle individual row checkbox change to update selection state
   * @param {Event} e - The change event from the row checkbox
   */
  _handleRowCheckboxChange(e) {
    if (!e || !e.target) return;
    const target = e.target;
    const rowId = target.dataset.rowId;
    
    const checked = target.checked;
    const selected = new Set(this._selectedRows.value);

    if (checked) {
      selected.add(rowId);
    } else {
      selected.delete(rowId);
    }

    this._selectedRows.value = selected;
    this._emitSelectionChange();
  }

  /**
   * Update the visual state of all row checkboxes based on current selection
   * Also updates master checkbox and selection count display
   */
  _updateSelection() {
    // Update all row checkboxes
    const checkboxes = this.querySelectorAll('.row-checkbox');
    checkboxes.forEach(checkbox => {
      const rowId = checkbox.dataset.rowId;
      checkbox.checked = this._selectedRows.value.has(rowId);
    });

    // Always update master checkbox after updating rows
    this._updateMasterCheckbox();
    this._updateSelectionCount();
  }

  /**
   * Update master checkbox state (checked, unchecked, or indeterminate)
   * Reflects the current selection state of visible rows
   */
  _updateMasterCheckbox() {
    const masterCheckboxes = this.querySelectorAll('.master-checkbox, .master-checkbox-mobile');

    // Recalculate states by checking visible rows directly instead of relying on computed properties
    const visible = this._visibleRows.value;
    const selected = this._selectedRows.value;

    const selectedCount = visible.filter(row => selected.has(this._getRowId(row))).length;
    const allSelected = visible.length > 0 && selectedCount === visible.length;
    const someSelected = selectedCount > 0 && selectedCount < visible.length;

    masterCheckboxes.forEach(checkbox => {
      checkbox.checked = allSelected;
      checkbox.indeterminate = someSelected;
    });
  }

  /**
   * Update the selection count display in mobile view
   * Shows the number of currently selected rows
   */
  _updateSelectionCount() {
    const countElements = this.querySelectorAll('.selection-count-mobile');
    const count = this._selectedRows.value.size;

    countElements.forEach(el => {
      el.textContent = `${count} selected`;
    });
  }

  /**
   * Emit a custom 'selectionchange' event with current selection details
   * Includes selected row IDs, row objects, count, and selection state flags
   */
  _emitSelectionChange() {
    const selected = Array.from(this._selectedRows.value);
    const visibleRows = this._visibleRows.value;
    const selectedRows = visibleRows.filter(row => this._selectedRows.value.has(this._getRowId(row)));

    this.dispatchEvent(new CustomEvent('selectionchange', {
      detail: {
        selected: selected,
        selectedRows: selectedRows,
        count: selected.length,
        allSelected: this._allSelected.value,
        someSelected: this._someSelected.value
      },
      bubbles: true
    }));
  }

  /**
   * Get the unique identifier for a row
   * @param {Object} row - The data row object
   * @returns {string} The row's unique identifier
   */
  _getRowId(row) {
    return String(row[this._rowIdKey] || row.id || JSON.stringify(row));
  }

  _getAccountRows() {
    if (this._data.value instanceof Accounts) {
      return this._data.value.accounts;
    }
    return Array.isArray(this._data.value) ? this._data.value : [];
  }

  // Public API
  /**
   * Set the table data
   * @param {Array} value - Array of data objects to display
   */
  set data(value) {
    this._data.value = Accounts.from(value);
  }

  /**
   * Get the current table data
   * @returns {Array} Array of data objects
   */
  get data() {
    return this._getAccountRows();
  }

  /**
   * Set the table column configuration
   * @param {Array<Object>} value - Array of column configuration objects
   */
  set columns(value) {
    this._columns.value = Array.isArray(value) ? value : [];
  }

  /**
   * Get the current table column configuration
   * @returns {Array<Object>} Array of column configuration objects
   */
  get columns() {
    return this._columns.value;
  }

  /**
   * Set the selected rows programmatically
   * @param {Array<string>} value - Array of row IDs to select
   */
  set selectedRows(value) {
    this._selectedRows.value = new Set(value);
    // Trigger DOM update and event emission
    this._updateSelection();
    this._emitSelectionChange();
  }

  /**
   * Get the currently selected row IDs
   * @returns {Array<string>} Array of selected row IDs
   */
  get selectedRows() {
    return Array.from(this._selectedRows.value);
  }

  /**
   * Clear all row selections
   */
  clearSelection() {
    this._selectedRows.value = new Set();
    this._updateSelection();
    this._emitSelectionChange();
  }

  /**
   * Select all visible rows in the table
   */
  selectAll() {
    const selected = new Set();
    this._visibleRows.value.forEach(row => {
      selected.add(this._getRowId(row));
    });
    this._selectedRows.value = selected;
    this._updateSelection();
    this._emitSelectionChange();
  }

  /**
   * Refresh the entire table by re-rendering all content
   */
  refresh() {
    this._updateTable();
  }

  /**
   * Update a single row in the table without re-rendering the entire table
   * @param {string} rowId - The ID of the row to update
   */
  updateRow(rowId) {
    console.group(`Updating row with ID: ${rowId}`);
    const data = this._getAccountRows();
    const columns = this._columns.value;
    const row = data.find(r => this._getRowId(r) === rowId);

    if (!row) {
      console.warn(`Row with ID ${rowId} not found`);
      console.groupEnd();
      return;
    }

    // Update desktop table row
    const desktopRow = this.querySelector(`tr[data-row-id="${rowId}"]`);
    if (desktopRow) {
      this._updateTableRow(desktopRow, row, columns);
    }

    // Update mobile card row
    const mobileCard = this.querySelector(`[data-mobile-card-id="${rowId}"]`);
    if (mobileCard) {
      this._updateMobileCard(mobileCard, row, columns);
    }

    console.groupEnd();
  }

  /**
   * Update cells in a desktop table row
   * @param {HTMLElement} tr - The table row element to update
   * @param {Account} row - The account instance.
   * @param {Array<Object>} columns - Column configuration objects
   */
  _updateTableRow(tr, row, columns) {
    console.group(`Updating desktop table row for ID: ${this._getRowId(row)}`);
    // Update visual indicator for modified rows
    const isModified = row.migrationStatus === AccountMigrationStatus.COMPLETED;
    tr.classList.toggle('bg-amber-50', isModified);
    tr.classList.toggle('border-l-4', isModified);
    tr.classList.toggle('border-l-amber-300', isModified);

    // Update cells
    const cells = tr.querySelectorAll('td');
    columns.forEach((col, index) => {
      const td = cells[index];
      if (td) {
        td.innerHTML = '';
        this._renderCell(td, col, row);
      }
    });
    console.groupEnd();
  }

  /**
   * Update a mobile card.
   * @param {HTMLElement} card - The card container element
   * @param {Account} row - The account instance.
   * @param {Array<Object>} columns - Column configuration objects
   */
  _updateMobileCard(card, row, columns) {
    console.group(`Updating mobile card for ID: ${this._getRowId(row)}`);
    card.innerHTML = '';
    this._renderMobileCardContent(card, row, columns);
    console.groupEnd();
  }

  /**
   * Render the content of a mobile card
   * @param {HTMLElement} card - The card container element
   * @param {Account} row - The account instance.
   * @param {Array<Object>} columns - Column configuration objects
   */
  _renderMobileCardContent(card, row, columns) {
    console.group("Rendering mobile card content", { rowId: this._getRowId(row) });
    card.className = 'bg-white rounded border border-gray-200 p-3 sm:p-4 space-y-2';
    if (row.migrationStatus === AccountMigrationStatus.COMPLETED) {
      card.classList.add('bg-amber-50', 'border-l-4', 'border-l-amber-300');
    }
    card.setAttribute('data-mobile-card-id', this._getRowId(row));

    columns.forEach(col => {
      if (col.mobileHidden) {
        console.log(`Skipping mobile rendering for column: ${col.header || col.mobileLabel}`);
        return;
      }

      const field = document.createElement('div');
      field.className = 'flex justify-between items-start text-sm';

      const label = document.createElement('span');
      label.className = 'font-medium text-gray-700';
      label.textContent = col.mobileLabel || col.header || '';

      const value = document.createElement('div');
      value.className = 'text-gray-900 text-right flex-1 ml-3';

      this._renderCell(value, col, row);

      field.appendChild(label);
      field.appendChild(value);
      card.appendChild(field);
    });
    console.groupEnd();
  }
}

// Register the custom element
customElements.define('ui-table', ReusableTable);

export { ReusableTable };
