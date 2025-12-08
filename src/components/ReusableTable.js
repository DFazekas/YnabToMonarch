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

class ReusableTable extends HTMLElement {
  constructor() {
    super();

    // Reactive state
    this._data = signal([]);
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

    // Bind methods
    this._handleMasterCheckboxChange = this._handleMasterCheckboxChange.bind(this);
    this._handleRowCheckboxChange = this._handleRowCheckboxChange.bind(this);
  }

  connectedCallback() {
    // Read attributes
    this._mobileBreakpoint = this.getAttribute('data-mobile-breakpoint') || 'lg';
    this._enableSelection = this.getAttribute('data-enable-selection') !== 'false';
    this._rowIdKey = this.getAttribute('data-row-id-key') || 'id';

    this._render();
    this._setupSubscriptions();
  }

  disconnectedCallback() {
    // Cleanup subscriptions
    if (this._dataUnsubscribe) this._dataUnsubscribe();
    if (this._columnsUnsubscribe) this._columnsUnsubscribe();
    if (this._selectedUnsubscribe) this._selectedUnsubscribe();
    if (this._visibleUnsubscribe) this._visibleUnsubscribe();
  }

  _setupSubscriptions() {
    // Re-render when data or columns change
    this._dataUnsubscribe = this._data.subscribe(() => this._updateTable());
    this._columnsUnsubscribe = this._columns.subscribe(() => this._updateTable());
    this._selectedUnsubscribe = this._selectedRows.subscribe(() => this._updateSelection());
    this._visibleUnsubscribe = this._visibleRows.subscribe(() => this._updateMasterCheckbox());
  }

  _render() {
    this.className = 'ui-table-container bg-white rounded-lg shadow-sm overflow-hidden';

    this.innerHTML = `
      <!-- Mobile Card View -->
      <div class="mobile-view block ${this._mobileBreakpoint}:hidden">
        ${this._enableSelection ? `
        <div class="border-b border-gray-200 bg-gray-50 p-4">
          <div class="flex items-center justify-between">
            <label class="custom-checkbox-container">
              <input id="masterCheckboxMobile" type="checkbox" class="master-checkbox-mobile custom-checkbox-input">
              <span class="custom-checkbox-visual"></span>
              <span class="text-sm font-medium text-gray-700 pl-2">Select All</span>
            </label>
            <div class="text-xs text-gray-500 font-medium selection-count-mobile">0 selected</div>
          </div>
        </div>
        ` : ''}
        <div class="mobile-list divide-y divide-gray-100"></div>
      </div>
      
      <!-- Desktop Table View -->
      <div class="desktop-view hidden ${this._mobileBreakpoint}:block overflow-x-auto">
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

  _updateTable() {
    const data = this._data.value;
    const columns = this._columns.value;

    if (!columns.length || !data.length) return;

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

  _renderDesktopTable(data, columns) {
    const thead = this.querySelector('thead tr');
    const tbody = this.querySelector('tbody');

    if (!thead || !tbody) return;

    // Render headers
    thead.innerHTML = '';
    columns.forEach(col => {
      const th = document.createElement('th');
      th.scope = 'col';
      th.className = col.headerClass || 'px-3 sm:px-4 py-3 sm:py-4 text-left text-xs sm:text-sm font-semibold text-gray-900';

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
    data.forEach(row => {
      const tr = document.createElement('tr');
      tr.setAttribute('role', 'row');
      tr.className = 'border-t border-gray-100';
      
      // Subtle visual indicator for modified rows
      if (row._isModified) {
        tr.classList.add('bg-amber-50', 'border-l-4', 'border-l-amber-300');
      }
      
      tr.dataset.rowId = this._getRowId(row);

      columns.forEach(col => {
        const td = document.createElement('td');
        td.className = col.cellClass || 'px-3 sm:px-4 py-3 sm:py-4';

        this._renderCell(td, col, row);
        tr.appendChild(td);
      });

      tbody.appendChild(tr);
    });
  }

  _renderMobileCards(data, columns) {
    const mobileList = this.querySelector('.mobile-list');
    if (!mobileList) return;

    mobileList.innerHTML = '';

    data.forEach(row => {
      const card = document.createElement('div');
      card.className = 'mobile-card p-4 flex items-start gap-3';
      
      // Subtle visual indicator for modified rows on mobile
      if (row._isModified) {
        card.classList.add('bg-amber-50', 'border-l-4', 'border-l-amber-300');
      }
      
      card.dataset.rowId = this._getRowId(row);

      // Render mobile card content
      const selectCol = columns.find(c => c.type === 'checkbox' && c.masterCheckbox);
      if (selectCol && this._enableSelection) {
        const checkboxContainer = this._createMobileCheckbox(row);
        card.appendChild(checkboxContainer);
      }

      const contentDiv = document.createElement('div');
      contentDiv.className = 'flex-1 min-w-0 space-y-2';

      // Render mobile layout for other columns
      columns.forEach(col => {
        if (col.type === 'checkbox' && col.masterCheckbox) return; // Skip, already rendered
        if (col.mobileHidden) return;

        const fieldDiv = document.createElement('div');
        fieldDiv.className = col.mobileClass || 'flex items-center gap-2';

        if (col.mobileLabel !== false) {
          const label = document.createElement('span');
          label.className = 'text-xs font-medium text-gray-500 flex-shrink-0';
          label.textContent = col.mobileLabel || col.header + ':';
          fieldDiv.appendChild(label);
        }

        const valueContainer = document.createElement('div');
        valueContainer.className = 'flex-1 min-w-0';
        this._renderCell(valueContainer, col, row, true);
        fieldDiv.appendChild(valueContainer);

        contentDiv.appendChild(fieldDiv);
      });

      card.appendChild(contentDiv);
      mobileList.appendChild(card);
    });
  }

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
        select.className = (isMobile ? 'text-xs ' : '') + 'border border-gray-300 rounded-lg px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white';
        select.disabled = isDisabled;

        if (isDisabled) {
          select.className += ' text-gray-300 bg-gray-50 cursor-not-allowed';
        } else {
          select.className += ' cursor-pointer';
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
          select.addEventListener('change', () => col.onChange(row, select.value));
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

  _handleRowCheckboxChange(e) {
    const rowId = e.target.dataset.rowId;
    const checked = e.target.checked;
    const selected = new Set(this._selectedRows.value);

    if (checked) {
      selected.add(rowId);
    } else {
      selected.delete(rowId);
    }

    this._selectedRows.value = selected;
    this._emitSelectionChange();
  }

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

  _updateSelectionCount() {
    const countElements = this.querySelectorAll('.selection-count-mobile');
    const count = this._selectedRows.value.size;

    countElements.forEach(el => {
      el.textContent = `${count} selected`;
    });
  }

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

  _getRowId(row) {
    return String(row[this._rowIdKey] || row.id || JSON.stringify(row));
  }

  // Public API
  set data(value) {
    this._data.value = Array.isArray(value) ? value : [];
  }

  get data() {
    return this._data.value;
  }

  set columns(value) {
    this._columns.value = Array.isArray(value) ? value : [];
  }

  get columns() {
    return this._columns.value;
  }

  set selectedRows(value) {
    this._selectedRows.value = new Set(value);
    // Trigger DOM update and event emission
    this._updateSelection();
    this._emitSelectionChange();
  }

  get selectedRows() {
    return Array.from(this._selectedRows.value);
  }

  clearSelection() {
    this._selectedRows.value = new Set();
    this._updateSelection();
    this._emitSelectionChange();
  }

  selectAll() {
    const selected = new Set();
    this._visibleRows.value.forEach(row => {
      selected.add(this._getRowId(row));
    });
    this._selectedRows.value = selected;
    this._updateSelection();
    this._emitSelectionChange();
  }

  refresh() {
    this._updateTable();
  }
}

// Register the custom element
customElements.define('ui-table', ReusableTable);

export { ReusableTable };
