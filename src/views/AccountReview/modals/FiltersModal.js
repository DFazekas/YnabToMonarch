/**
 * FiltersModal - Self-contained modal for account filtering
 * Encapsulates all filter UI logic and state management
 */

import monarchAccountTypes from '../../../../public/static-data/monarchAccountTypes.json';

export default class FiltersModal {
  // TODO: Clicking individual types and subtypes doesn't update their styles, nor the "Remove all filters" button.
  constructor(filters, onApply, onReset) {
    this.filters = filters;
    this.onApply = onApply;
    this.onReset = onReset;
    this.modal = null;
  }

  /**
   * Open the filters modal and initialize all event handlers
   */
  open() {
    this.modal = document.getElementById('filtersModal');
    this.modal.open();

    setTimeout(() => {
      this._setupEventListeners();
      this._populateFilters();
      this._updatePendingFilterStyles();
    }, 10);
  }

  /**
   * Setup all event listeners for filter modal
   */
  _setupEventListeners() {
    const modalOverlay = this.modal._modalOverlay;
    const resetBtn = modalOverlay.querySelector('#filtersResetBtn');
    const applyBtn = modalOverlay.querySelector('#filtersApplyBtn');

    resetBtn.onclick = () => this._handleReset();
    applyBtn.onclick = () => this._handleApply();

    // Account name input
    const filterAccountName = modalOverlay.querySelector('#filterAccountName');
    const clearAccountNameBtn = modalOverlay.querySelector('#clearAccountNameBtn');
    
    filterAccountName.addEventListener('input', () => {
      this.filters.pendingFilters.accountName = filterAccountName.value;
      clearAccountNameBtn.classList.toggle('hidden', !filterAccountName.value.trim());
      this._updatePendingFilterStyles();
    });

    clearAccountNameBtn.addEventListener('click', () => {
      filterAccountName.value = '';
      filterAccountName.dispatchEvent(new Event('input'));
    });

    // Match type radios
    const nameMatchTypeRadios = modalOverlay.querySelectorAll('input[name="nameMatchType"]');
    nameMatchTypeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.filters.pendingFilters.nameMatchType = radio.value;
        this._updatePendingFilterStyles();
      });
    });

    // Case sensitivity
    const nameCaseSensitive = modalOverlay.querySelector('#nameCaseSensitive');
    nameCaseSensitive.addEventListener('change', () => {
      this.filters.pendingFilters.nameCaseSensitive = nameCaseSensitive.checked;
      this._updatePendingFilterStyles();
    });

    // Type filters
    const typeSelectAllBtn = modalOverlay.querySelector('#accountTypeSelectAllBtn');
    const typeDeselectAllBtn = modalOverlay.querySelector('#accountTypeDeselectAllBtn');
    typeSelectAllBtn.onclick = () => this._selectAllTypes(modalOverlay);
    typeDeselectAllBtn.onclick = () => this._deselectAllTypes(modalOverlay);

    // Subtype filters
    const subtypeSelectAllBtn = modalOverlay.querySelector('#accountSubtypeSelectAllBtn');
    const subtypeDeselectAllBtn = modalOverlay.querySelector('#accountSubtypeDeselectAllBtn');
    subtypeSelectAllBtn.onclick = () => this._selectAllSubtypes(modalOverlay);
    subtypeDeselectAllBtn.onclick = () => this._deselectAllSubtypes(modalOverlay);

    // Type checkboxes
    modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          this.filters.pendingFilters.types.add(cb.value);
        } else {
          this.filters.pendingFilters.types.delete(cb.value);
        }
        this._updatePendingFilterStyles();
      });
    });

    // Subtype checkboxes
    modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) {
          this.filters.pendingFilters.subtypes.add(cb.value);
        } else {
          this.filters.pendingFilters.subtypes.delete(cb.value);
        }
        this._updatePendingFilterStyles();
      });
    });

    // Transaction filters
    const filterTransactionsMin = modalOverlay.querySelector('#filterTransactionsMin');
    const filterTransactionsMax = modalOverlay.querySelector('#filterTransactionsMax');
    filterTransactionsMin.addEventListener('input', () => {
      this.filters.pendingFilters.transactionsMin = filterTransactionsMin.value ? parseInt(filterTransactionsMin.value, 10) : null;
      this._updatePendingFilterStyles();
    });
    filterTransactionsMax.addEventListener('input', () => {
      this.filters.pendingFilters.transactionsMax = filterTransactionsMax.value ? parseInt(filterTransactionsMax.value, 10) : null;
      this._updatePendingFilterStyles();
    });

    // Balance filters
    const filterBalanceMin = modalOverlay.querySelector('#filterBalanceMin');
    const filterBalanceMax = modalOverlay.querySelector('#filterBalanceMax');
    filterBalanceMin.addEventListener('input', () => {
      this.filters.pendingFilters.balanceMin = filterBalanceMin.value ? parseFloat(filterBalanceMin.value) : null;
      this._updatePendingFilterStyles();
    });
    filterBalanceMax.addEventListener('input', () => {
      this.filters.pendingFilters.balanceMax = filterBalanceMax.value ? parseFloat(filterBalanceMax.value) : null;
      this._updatePendingFilterStyles();
    });

    // Inclusion radio buttons
    const inclusionRadios = modalOverlay.querySelectorAll('input[name="inclusionFilter"]');
    inclusionRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        this.filters.pendingFilters.inclusion = radio.value;
        this._updatePendingFilterStyles();
      });
    });
  }

  /**
   * Populate filter form with current values
   */
  _populateFilters() {
    const modalOverlay = this.modal._modalOverlay;

    // Account name
    const filterAccountName = modalOverlay.querySelector('#filterAccountName');
    filterAccountName.value = this.filters.activeFilters.accountName;

    // Match type
    const containsRadio = modalOverlay.querySelector('input[name="nameMatchType"][value="contains"]');
    const exactRadio = modalOverlay.querySelector('input[name="nameMatchType"][value="exact"]');
    containsRadio.checked = this.filters.activeFilters.nameMatchType === 'contains';
    exactRadio.checked = this.filters.activeFilters.nameMatchType === 'exact';

    // Case sensitivity
    const nameCaseSensitive = modalOverlay.querySelector('#nameCaseSensitive');
    nameCaseSensitive.checked = this.filters.activeFilters.nameCaseSensitive;

    // Disable controls if no name filter
    const isEmpty = !this.filters.activeFilters.accountName.trim();
    const nameMatchTypeRadios = modalOverlay.querySelectorAll('input[name="nameMatchType"]');
    nameMatchTypeRadios.forEach(radio => radio.disabled = isEmpty);
    nameCaseSensitive.disabled = isEmpty;

    // Type and subtype filters
    this._populateTypeFilters(modalOverlay);
    this._populateSubtypeFilters(modalOverlay);

    // Transaction filters
    const filterTransactionsMin = modalOverlay.querySelector('#filterTransactionsMin');
    filterTransactionsMin.value = this.filters.activeFilters.transactionsMin || '';

    const filterTransactionsMax = modalOverlay.querySelector('#filterTransactionsMax');
    filterTransactionsMax.value = this.filters.activeFilters.transactionsMax || '';

    // Balance filters
    const filterBalanceMin = modalOverlay.querySelector('#filterBalanceMin');
    filterBalanceMin.value = this.filters.activeFilters.balanceMin || '';

    const filterBalanceMax = modalOverlay.querySelector('#filterBalanceMax');
    filterBalanceMax.value = this.filters.activeFilters.balanceMax || '';

    // Inclusion
    const inclusionRadios = modalOverlay.querySelectorAll('input[name="inclusionFilter"]');
    inclusionRadios.forEach(radio => {
      radio.checked = radio.value === this.filters.activeFilters.inclusion;
    });
  }

  /**
   * Populate type filter checkboxes
   */
  _populateTypeFilters(modalOverlay) {
    const container = modalOverlay.querySelector('#typeFiltersContainer');
    const types = [...new Set(monarchAccountTypes.data.map(type => type.typeDisplay))].sort();

    container.innerHTML = '';
    types.forEach(type => {
      const isChecked = this.filters.activeFilters.types.has(type);
      const checkbox = this._createFilterCheckbox('type', type, type, isChecked);
      container.appendChild(checkbox);
    });
  }

  /**
   * Populate subtype filter checkboxes
   */
  _populateSubtypeFilters(modalOverlay) {
    const container = modalOverlay.querySelector('#subtypeFiltersContainer');
    const subtypes = new Set();

    monarchAccountTypes.data.forEach(type => {
      type.subtypes.forEach(subtype => subtypes.add(subtype.display));
    });

    const sortedSubtypes = [...subtypes].sort();
    container.innerHTML = '';
    sortedSubtypes.forEach(subtype => {
      const isChecked = this.filters.activeFilters.subtypes.has(subtype);
      const checkbox = this._createFilterCheckbox('subtype', subtype, subtype, isChecked);
      container.appendChild(checkbox);
    });
  }

  /**
   * Create a filter checkbox element
   */
  _createFilterCheckbox(filterType, value, label, isChecked = false) {
    const div = document.createElement('div');
    div.className = 'flex items-center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `filter-${filterType}-${value.replace(/\s+/g, '-')}`;
    checkbox.value = value;
    checkbox.className = 'w-4 h-4 border-gray-300 rounded';
    checkbox.style.accentColor = '#111827';
    checkbox.checked = isChecked;

    const labelEl = document.createElement('label');
    labelEl.htmlFor = checkbox.id;
    labelEl.className = 'ml-2 text-sm text-gray-700 cursor-pointer';
    labelEl.textContent = label;

    div.appendChild(checkbox);
    div.appendChild(labelEl);
    return div;
  }

  /**
   * Select all type filters
   */
  _selectAllTypes(modalOverlay) {
    modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = true;
      this.filters.pendingFilters.types.add(cb.value);
    });
    this._updatePendingFilterStyles();
  }

  /**
   * Deselect all type filters
   */
  _deselectAllTypes(modalOverlay) {
    modalOverlay.querySelectorAll('#typeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      this.filters.pendingFilters.types.delete(cb.value);
    });
    this._updatePendingFilterStyles();
  }

  /**
   * Select all subtype filters
   */
  _selectAllSubtypes(modalOverlay) {
    modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = true;
      this.filters.pendingFilters.subtypes.add(cb.value);
    });
    this._updatePendingFilterStyles();
  }

  /**
   * Deselect all subtype filters
   */
  _deselectAllSubtypes(modalOverlay) {
    modalOverlay.querySelectorAll('#subtypeFiltersContainer input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
      this.filters.pendingFilters.subtypes.delete(cb.value);
    });
    this._updatePendingFilterStyles();
  }

  /**
   * Update visual styles for changed filter inputs
   */
  _updatePendingFilterStyles() {
    const modalOverlay = this.modal._modalOverlay;

    // Account name
    const filterAccountName = modalOverlay.querySelector('#filterAccountName');
    filterAccountName.classList.toggle('filter-modified', this.filters.accountNameHasPendingChange());

    // Transaction filters
    const transMin = modalOverlay.querySelector('#filterTransactionsMin');
    transMin.classList.toggle('filter-modified', this.filters.transactionMinHasPendingChange());
    const transMax = modalOverlay.querySelector('#filterTransactionsMax');
    transMax.classList.toggle('filter-modified', this.filters.transactionMaxHasPendingChange());

    // Balance filters
    const balMin = modalOverlay.querySelector('#filterBalanceMin');
    balMin.classList.toggle('filter-modified', this.filters.balanceMinHasPendingChange());
    const balMax = modalOverlay.querySelector('#filterBalanceMax');
    balMax.classList.toggle('filter-modified', this.filters.balanceMaxHasPendingChange());

    // Type and subtype containers
    const typeContainer = modalOverlay.querySelector('#typeFiltersContainer').parentElement;
    typeContainer.classList.toggle('filter-modified', this.filters.typesHavePendingChange());
    const subtypeContainer = modalOverlay.querySelector('#subtypeFiltersContainer').parentElement;
    subtypeContainer.classList.toggle('filter-modified', this.filters.subtypesHavePendingChange());

    // Update reset button
    const resetBtn = modalOverlay.querySelector('#filtersResetBtn');
    resetBtn.disabled = !this.filters.hasPendingChanges();
  }

  /**
   * Handle apply button click
   */
  _handleApply() {
    this.filters.applyPendingToActive();
    this.modal.close();
    if (this.onApply) this.onApply();
  }

  /**
   * Handle reset button click
   */
  _handleReset() {
    this.filters.clearPendingFilters();
    this._populateFilters();
    this._updatePendingFilterStyles();
    if (this.onReset) this.onReset();
  }
}
