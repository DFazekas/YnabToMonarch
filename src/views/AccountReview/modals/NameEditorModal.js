/**
 * NameEditorModal - Self-contained overlay modal for editing a single account name
 * Manages its own lifecycle and DOM
 */

export default class NameEditorModal {
  constructor(account, onSave) {
    this.account = account;
    this.onSave = onSave;
    this.overlay = null;
    this.input = null;
  }

  /**
   * Open the name editor modal
   */
  open() {
    this._createDOM();
    this._setupEventListeners();
    this._show();
    this.input.focus();
    this.input.select();
  }

  /**
   * Create the DOM structure for the modal
   */
  _createDOM() {
    this.overlay = document.createElement('div');
    this.overlay.className = 'fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 opacity-0 transition-opacity duration-200';
    document.body.appendChild(this.overlay);

    const popup = document.createElement('div');
    popup.className = 'bg-white rounded-lg shadow-lg p-5 w-[400px]';

    const title = document.createElement('h2');
    title.className = 'font-bold mb-3 text-lg';
    title.textContent = 'Edit Account Name';
    popup.appendChild(title);

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.value = this.account.current.name;
    this.input.setAttribute('aria-label', 'Account name input');
    this.input.className = 'border rounded w-full px-3 py-2 mb-4';
    popup.appendChild(this.input);

    const buttonRow = document.createElement('div');
    buttonRow.className = 'flex justify-end gap-2';

    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.className = 'bg-gray-300 px-4 py-2 rounded';
    cancelBtn.addEventListener('click', () => this.close());

    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Save';
    saveBtn.className = 'bg-blue-500 text-white px-4 py-2 rounded font-bold';
    saveBtn.addEventListener('click', () => this._handleSave());

    buttonRow.appendChild(cancelBtn);
    buttonRow.appendChild(saveBtn);
    popup.appendChild(buttonRow);
    this.overlay.appendChild(popup);
  }

  /**
   * Setup event listeners for keyboard interaction
   */
  _setupEventListeners() {
    this.overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.close();
      if (e.key === 'Enter') this._handleSave();
    });
  }

  /**
   * Show the modal with animation
   */
  _show() {
    requestAnimationFrame(() => this.overlay.classList.add('opacity-100'));
  }

  /**
   * Handle save button click
   */
  _handleSave() {
    this.account.setName(this.input.value);
    if (this.onSave) this.onSave(this.account);
    this.close();
  }

  /**
   * Close and cleanup the modal
   */
  close() {
    this.overlay.classList.remove('opacity-100');
    this.overlay.classList.add('opacity-0');
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        document.body.removeChild(this.overlay);
      }
    }, 200);
  }
}
