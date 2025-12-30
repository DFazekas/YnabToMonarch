/**
 * BulkTypeModal - Self-contained modal for bulk account type/subtype changes
 * Encapsulates all bulk type change UI logic
 */

import { getAccountTypeByName } from '../../../utils/accountTypeUtils.js';
import monarchAccountTypes from '../../../../public/static-data/monarchAccountTypes.json';

export default class BulkTypeModal {
  constructor(accounts, onApply) {
    this.accounts = accounts;
    this.onApply = onApply;
    this.modal = null;
  }

  /**
   * Open the bulk type modal and initialize all event handlers
   */
  open() {
    this.modal = document.getElementById('bulkTypeModal');
    this.modal.open();

    setTimeout(() => {
      this._setupEventListeners();
      this._populateTypeDropdown();
      this._updateSubtypeOptions();
    }, 300);
  }

  /**
   * Setup all event listeners for bulk type modal
   */
  _setupEventListeners() {
    const modalOverlay = this.modal._modalOverlay;
    const typeSelect = modalOverlay.querySelector('#bulkTypeSelect');
    const cancelBtn = modalOverlay.querySelector('#bulkTypeCancel');
    const applyBtn = modalOverlay.querySelector('#bulkTypeApply');

    typeSelect.onchange = () => this._updateSubtypeOptions();

    cancelBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modal.close();
    };

    applyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleApply(modalOverlay);
    };
  }

  /**
   * Populate the type dropdown with all available account types
   */
  _populateTypeDropdown() {
    const modalOverlay = this.modal._modalOverlay;
    const typeSelect = modalOverlay.querySelector('#bulkTypeSelect');

    typeSelect.innerHTML = '';
    monarchAccountTypes.data.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type.typeName;
      opt.textContent = type.typeDisplay;
      typeSelect.appendChild(opt);
    });
  }

  /**
   * Update subtype options based on selected account type
   */
  _updateSubtypeOptions() {
    const modalOverlay = this.modal._modalOverlay;
    const typeSelect = modalOverlay.querySelector('#bulkTypeSelect');
    const subtypeSelect = modalOverlay.querySelector('#bulkSubtypeSelect');

    const selectedType = getAccountTypeByName(typeSelect.value);
    subtypeSelect.innerHTML = '';

    (selectedType?.subtypes || []).forEach(sub => {
      const opt = document.createElement('option');
      opt.value = sub.name;
      opt.textContent = sub.display;
      subtypeSelect.appendChild(opt);
    });

    // Add default empty option if no subtypes
    if ((selectedType?.subtypes || []).length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = '(No subtypes available)';
      opt.disabled = true;
      opt.selected = true;
      subtypeSelect.appendChild(opt);
    }
  }

  /**
   * Handle apply button click
   */
  _handleApply(modalOverlay) {
    const typeSelect = modalOverlay.querySelector('#bulkTypeSelect');
    const subtypeSelect = modalOverlay.querySelector('#bulkSubtypeSelect');

    const typeValue = typeSelect.value;
    const subtypeValue = subtypeSelect.value;

    this.accounts.bulkEditType(typeValue, subtypeValue);
    this.modal.close();

    if (this.onApply) this.onApply();
  }
}
