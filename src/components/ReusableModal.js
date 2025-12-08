/**
 * ReusableModal Web Component
 * Generic self-managing modal with reactive state and slot-based content injection.
 * Create multiple instances with different content.
 */

import { signal } from '../core/reactiveState.js';

class ReusableModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Reactive state for modal visibility
    this.isOpen = signal(false);
    
    // Subscribe to state changes
    this.isOpen.subscribe((open) => {
      this._updateModalState(open);
    });
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  _render() {
    // Render trigger in shadow DOM
    this.shadowRoot.innerHTML = `
      <style>
        ::slotted([slot="trigger"]) {
          cursor: pointer;
        }
      </style>
      <slot name="trigger"></slot>
    `;

    // Create modal overlay element that will be appended to body
    this._modalOverlay = document.createElement('div');
    this._modalOverlay.className = 'ui-modal-overlay';
    this._modalOverlay.setAttribute('role', 'dialog');
    this._modalOverlay.setAttribute('aria-modal', 'true');
    this._modalOverlay.innerHTML = `
      <style>
        .ui-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem;
          opacity: 0;
          pointer-events: none;
          transition: opacity 500ms cubic-bezier(0.4, 0, 0.2, 1);
          background-color: transparent;
        }

        .ui-modal-overlay.open {
          pointer-events: auto;
          opacity: 1;
        }

        .ui-modal-backdrop {
          position: absolute;
          inset: 0;
          background-color: rgba(0, 0, 0, 0.5);
          transition: background-color 500ms cubic-bezier(0.4, 0, 0.2, 1);
          z-index: -1;
        }

        .ui-modal-content {
          position: relative;
          z-index: 100;
          background-color: white;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          max-width: 85vw;
          width: auto;
          min-width: min(85vw, 500px);
          transform: translateY(100%);
          transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
          max-height: 90vh;
          overflow-y: auto;
          flex-shrink: 0;
        }

        @media (min-width: 640px) {
          .ui-modal-content {
            padding: 2rem;
            max-width: 70vw;
            margin: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .ui-modal-content {
            padding: 2.5rem;
            max-width: 40vw;
            margin: 2rem;
          }
        }

        .ui-modal-overlay.open .ui-modal-content {
          transform: translateY(0);
        }

        .ui-modal-header {
          display: relative;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .ui-modal-title {
          flex: 1;
          padding-right: 1rem;
          font-size: 1.125rem;
          font-weight: 700;
          color: #111827;
          line-height: 1.5;
        }

        @media (min-width: 640px) {
          .ui-modal-title {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          .ui-modal-title {
            font-size: 1.5rem;
          }
        }

        .ui-modal-close-btn {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: transparent;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          border-radius: 9999px;
          transition: all 200ms;
          flex-shrink: 0;
        }

        .ui-modal-close-btn:hover {
          background-color: #f3f4f6;
          color: #4b5563;
        }

        .ui-modal-close-btn:focus {
          outline: none;
          ring: 2px;
          ring-color: #3b82f6;
        }

        .ui-modal-body {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.5;
        }

        .ui-modal-footer {
          margin-top: 1.5rem;
          display: flex;
          justify-content: flex-end;
          gap: 0.75rem;
        }
      </style>
      
      <div class="ui-modal-backdrop"></div>
      
      <div class="ui-modal-content">
        <div class="ui-modal-header">
          <div class="ui-modal-title"></div>
          <button class="ui-modal-close-btn" aria-label="Close modal">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="ui-modal-body"></div>
        <div class="ui-modal-footer"></div>
      </div>
    `;

    // Move slotted content to modal overlay
    this._updateModalContent();
  }

  _updateModalContent() {
    // Copy slotted content to modal overlay elements
    const titleSlot = this.querySelector('[slot="title"]');
    const contentSlot = this.querySelector('[slot="content"]');
    const footerSlot = this.querySelector('[slot="footer"]');

    const titleContainer = this._modalOverlay.querySelector('.ui-modal-title');
    const bodyContainer = this._modalOverlay.querySelector('.ui-modal-body');
    const footerContainer = this._modalOverlay.querySelector('.ui-modal-footer');

    if (titleSlot && titleContainer) {
      titleContainer.innerHTML = titleSlot.innerHTML;
    }
    if (contentSlot && bodyContainer) {
      bodyContainer.innerHTML = contentSlot.innerHTML;
    }
    
    // For footer, we need to copy the HTML but NOT clone/move actual DOM nodes
    // This ensures Web Components remain queryable in their original location
    if (footerSlot && footerContainer) {
      // Get the inner HTML of the footer slot and render it in the modal
      footerContainer.innerHTML = Array.from(footerSlot.children)
        .map(child => child.outerHTML)
        .join('');
    }
  }

  // Override querySelector to search modal overlay for buttons
  querySelector(selector) {
    // First try to find in the custom element itself
    const element = super.querySelector(selector);
    if (element) return element;
    
    // If not found and modal overlay exists, search there (for footer buttons)
    if (this._modalOverlay) {
      return this._modalOverlay.querySelector(selector);
    }
    
    return null;
  }

  _setupEventListeners() {
    const backdrop = this._modalOverlay.querySelector('.ui-modal-backdrop');
    const closeBtn = this._modalOverlay.querySelector('.ui-modal-close-btn');

    // Trigger button
    const trigger = this.querySelector('[slot="trigger"]');
    if (trigger) {
      trigger.addEventListener('click', () => this.open());
    }

    // Close button
    closeBtn.addEventListener('click', () => this.close());

    // Backdrop click
    backdrop.addEventListener('click', () => this.close());

    // Escape key
    this._handleEscape = (e) => {
      if (e.key === 'Escape' && this.isOpen.value) {
        this.close();
      }
    };
  }

  _updateModalState(open) {
    if (open) {
      // Append modal to body when opening
      document.body.appendChild(this._modalOverlay);
      // Force reflow
      this._modalOverlay.offsetHeight;
      // Add open class for animation
      this._modalOverlay.classList.add('open');
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', this._handleEscape);
    } else {
      // Remove open class for animation
      this._modalOverlay.classList.remove('open');
      // Wait for animation to complete before removing from DOM
      setTimeout(() => {
        if (this._modalOverlay.parentNode) {
          this._modalOverlay.parentNode.removeChild(this._modalOverlay);
        }
      }, 500); // Match transition duration
      // Re-enable body scroll when modal closes
      document.body.style.overflow = '';
      document.removeEventListener('keydown', this._handleEscape);
    }
  }

  open() {
    this.isOpen.value = true;
  }

  close() {
    this.isOpen.value = false;
  }

  toggle() {
    this.isOpen.value = !this.isOpen.value;
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._handleEscape);
    // Remove modal overlay from body if it exists
    if (this._modalOverlay && this._modalOverlay.parentNode) {
      this._modalOverlay.parentNode.removeChild(this._modalOverlay);
    }
  }
}

// Register the custom element
if (!customElements.get('ui-modal')) {
  customElements.define('ui-modal', ReusableModal);
}

export { ReusableModal };
