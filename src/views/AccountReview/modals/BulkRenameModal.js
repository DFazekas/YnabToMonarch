/**
 * BulkRenameModal - Self-contained modal for bulk account renaming
 * Encapsulates all bulk rename UI logic and preview generation
 */

export default class BulkRenameModal {
  constructor(accounts, onApply) {
    this.accounts = accounts;
    this.onApply = onApply;
    this.modal = null;
  }

  /**
   * Open the bulk rename modal and initialize all event handlers
   */
  open() {
    this.modal = document.getElementById('bulkRenameModal');
    this.modal.open();

    setTimeout(() => {
      this._setupEventListeners();
      this._updatePreview();
    }, 300);
  }

  /**
   * Setup all event listeners for bulk rename modal
   */
  _setupEventListeners() {
    const modalOverlay = this.modal._modalOverlay;
    const renamePattern = modalOverlay.querySelector('#renamePattern');
    const indexStartInput = modalOverlay.querySelector('#indexStart');
    const cancelBtn = modalOverlay.querySelector('#renameCancel');
    const applyBtn = modalOverlay.querySelector('#renameApply');
    const tokenButtons = modalOverlay.querySelectorAll('.token-btn');

    // Token insertion buttons
    tokenButtons.forEach(btn => {
      btn.onclick = (e) => {
        e.preventDefault();
        const token = btn.dataset.token;
        const cursorPos = renamePattern.selectionStart;
        const before = renamePattern.value.substring(0, cursorPos);
        const after = renamePattern.value.substring(renamePattern.selectionEnd);
        renamePattern.value = before + token + after;
        renamePattern.selectionStart = renamePattern.selectionEnd = cursorPos + token.length;
        renamePattern.focus();
        this._updatePreview();
      };
    });

    // Live preview on input
    renamePattern.oninput = () => this._updatePreview();
    indexStartInput.oninput = () => this._updatePreview();

    // Cancel button
    cancelBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.modal.close();
    };

    // Apply button
    applyBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      this._handleApply(modalOverlay);
    };

    renamePattern.focus();
  }

  /**
   * Update preview of renamed accounts
   */
  _updatePreview() {
    const modalOverlay = this.modal._modalOverlay;
    const preview = modalOverlay.querySelector('#renamePreview');
    const patternInput = modalOverlay.querySelector('#renamePattern');
    const indexInput = modalOverlay.querySelector('#indexStart');

    preview.innerHTML = '';

    const pattern = patternInput.value;
    const indexStart = parseInt(indexInput.value, 10) || 1;
    const selectedAccounts = this.accounts.getSelected();

    // Show first 3 accounts as preview
    selectedAccounts.slice(0, 3).forEach((acc, i) => {
      const previewName = this._applyPattern(pattern, acc, indexStart + i);
      const div = document.createElement('div');
      div.className = 'p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-200';
      div.textContent = previewName || '(empty)';
      preview.appendChild(div);
    });

    if (selectedAccounts.length > 3) {
      const div = document.createElement('div');
      div.className = 'p-2 text-xs text-gray-500 italic';
      div.textContent = `...and ${selectedAccounts.length - 3} more`;
      preview.appendChild(div);
    }
  }

  /**
   * Apply the rename pattern to an account
   */
  _applyPattern(pattern, account, index) {
    const today = new Date().toISOString().split('T')[0];
    return pattern
      .replace(/{{YNAB}}/g, account.originalYnabName?.trim() || account.current.name || 'Account')
      .replace(/{{Index}}/g, index)
      .replace(/{{Upper}}/g, (account.originalYnabName?.trim() || account.current.name || 'Account').toUpperCase())
      .replace(/{{Date}}/g, today);
  }

  /**
   * Handle apply button click
   */
  _handleApply(modalOverlay) {
    const patternInput = modalOverlay.querySelector('#renamePattern');
    const indexStartInput = modalOverlay.querySelector('#indexStart');

    const pattern = patternInput.value;
    const indexStart = parseInt(indexStartInput.value, 10) || 1;

    this.accounts.bulkRename(pattern, indexStart);
    this.modal.close();

    if (this.onApply) this.onApply();
  }
}
