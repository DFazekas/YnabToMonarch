/**
 * ErrorMessage Web Component
 * 
 * A reusable, accessible error message component that displays contextual error messages
 * with clear resolution instructions. Supports auto-dismiss and manual close.
 * 
 * Features:
 * - Contextual placement near error source
 * - Auto-dismiss capability
 * - Manual close button
 * - ARIA live region for screen readers
 * - Slide-in animation
 * - Multiple severity levels
 * 
 * Usage:
 * <error-message id="myError" data-severity="error"></error-message>
 * 
 * JavaScript:
 * errorElement.show('Error message', 'Try this solution');
 * errorElement.hide();
 */

class ErrorMessage extends HTMLElement {
  constructor() {
    super();
    this._message = '';
    this._solution = '';
    this._severity = 'error';
    this._autoDismissTimeout = null;
  }

  static get observedAttributes() {
    return ['data-severity'];
  }

  connectedCallback() {
    this._severity = this.getAttribute('data-severity') || 'error';
    this._render();
    this._attachEventListeners();
  }

  disconnectedCallback() {
    if (this._autoDismissTimeout) {
      clearTimeout(this._autoDismissTimeout);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'data-severity' && oldValue !== newValue) {
      this._severity = newValue;
      this._updateSeverityStyles();
    }
  }

  _render() {
    this.className = 'error-message-container hidden';
    this.setAttribute('role', 'alert');
    this.setAttribute('aria-live', 'polite');
    this.setAttribute('aria-atomic', 'true');

    this.innerHTML = `
      <div class="error-message-content rounded-lg p-4 shadow-lg border transition-all duration-300 transform">
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 error-icon">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <p class="error-message-text text-sm font-medium"></p>
            <p class="error-solution-text text-sm mt-1 hidden"></p>
          </div>

          <!-- Close Button -->
          <button type="button" class="error-close-btn flex-shrink-0 rounded-lg p-1.5 inline-flex items-center justify-center hover:bg-opacity-20 focus:outline-none focus:ring-2 transition-colors"
                  aria-label="Dismiss error message">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    this._updateSeverityStyles();
  }

  _updateSeverityStyles() {
    const content = this.querySelector('.error-message-content');
    const icon = this.querySelector('.error-icon');
    const messageText = this.querySelector('.error-message-text');
    const solutionText = this.querySelector('.error-solution-text');
    const closeBtn = this.querySelector('.error-close-btn');

    if (!content) return;

    // Remove all severity classes
    content.classList.remove('bg-red-50', 'bg-yellow-50', 'bg-blue-50', 'border-red-200', 'border-yellow-200', 'border-blue-200');
    icon?.classList.remove('text-red-400', 'text-yellow-400', 'text-blue-400');
    messageText?.classList.remove('text-red-800', 'text-yellow-800', 'text-blue-800');
    solutionText?.classList.remove('text-red-700', 'text-yellow-700', 'text-blue-700');
    closeBtn?.classList.remove('text-red-500', 'text-yellow-500', 'text-blue-500', 'hover:bg-red-200', 'hover:bg-yellow-200', 'hover:bg-blue-200', 'focus:ring-red-400', 'focus:ring-yellow-400', 'focus:ring-blue-400');

    // Apply severity-specific styles
    switch (this._severity) {
      case 'error':
        content.classList.add('bg-red-50', 'border-red-200');
        icon?.classList.add('text-red-400');
        messageText?.classList.add('text-red-800');
        solutionText?.classList.add('text-red-700');
        closeBtn?.classList.add('text-red-500', 'hover:bg-red-200', 'focus:ring-red-400');
        break;
      case 'warning':
        content.classList.add('bg-yellow-50', 'border-yellow-200');
        icon?.classList.add('text-yellow-400');
        messageText?.classList.add('text-yellow-800');
        solutionText?.classList.add('text-yellow-700');
        closeBtn?.classList.add('text-yellow-500', 'hover:bg-yellow-200', 'focus:ring-yellow-400');
        break;
      case 'info':
        content.classList.add('bg-blue-50', 'border-blue-200');
        icon?.classList.add('text-blue-400');
        messageText?.classList.add('text-blue-800');
        solutionText?.classList.add('text-blue-700');
        closeBtn?.classList.add('text-blue-500', 'hover:bg-blue-200', 'focus:ring-blue-400');
        break;
    }
  }

  _attachEventListeners() {
    const closeBtn = this.querySelector('.error-close-btn');
    closeBtn?.addEventListener('click', () => this.hide());
  }

  /**
   * Show error message with optional solution
   * @param {string} message - The error message to display
   * @param {string} solution - Optional solution or instructions
   * @param {number} autoDismiss - Auto-dismiss after milliseconds (0 = no auto-dismiss)
   */
  show(message, solution = '', autoDismiss = 0) {
    this._message = message;
    this._solution = solution;

    const messageText = this.querySelector('.error-message-text');
    const solutionText = this.querySelector('.error-solution-text');

    if (messageText) messageText.textContent = message;
    
    if (solutionText) {
      if (solution) {
        solutionText.textContent = solution;
        solutionText.classList.remove('hidden');
      } else {
        solutionText.classList.add('hidden');
      }
    }

    // Show with animation
    this.classList.remove('hidden');
    requestAnimationFrame(() => {
      this.classList.add('visible');
    });

    // Auto-dismiss if specified
    if (autoDismiss > 0) {
      if (this._autoDismissTimeout) {
        clearTimeout(this._autoDismissTimeout);
      }
      this._autoDismissTimeout = setTimeout(() => this.hide(), autoDismiss);
    }

    // Emit custom event
    this.dispatchEvent(new CustomEvent('error-shown', {
      detail: { message, solution },
      bubbles: true
    }));
  }

  /**
   * Hide error message
   */
  hide() {
    if (this._autoDismissTimeout) {
      clearTimeout(this._autoDismissTimeout);
      this._autoDismissTimeout = null;
    }

    this.classList.remove('visible');
    
    // Wait for animation to complete before hiding
    setTimeout(() => {
      this.classList.add('hidden');
      this._message = '';
      this._solution = '';

      // Emit custom event
      this.dispatchEvent(new CustomEvent('error-hidden', {
        bubbles: true
      }));
    }, 300);
  }

  /**
   * Check if error is currently visible
   */
  get isVisible() {
    return this.classList.contains('visible');
  }

  /**
   * Get current message
   */
  get message() {
    return this._message;
  }

  /**
   * Set severity level
   */
  set severity(value) {
    this._severity = value;
    this.setAttribute('data-severity', value);
  }

  get severity() {
    return this._severity;
  }
}

// Register the custom element
customElements.define('error-message', ErrorMessage);

export { ErrorMessage };
