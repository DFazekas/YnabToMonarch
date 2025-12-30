/**
 * Loading Overlay Component
 * Displays a full-page overlay with spinner to prevent user interaction during async operations
 */

class LoadingOverlay {
  constructor() {
    this.overlay = null;
    this.isVisible = false;
    this.init();
  }

  init() {
    // Create overlay element
    this.overlay = document.createElement('div');
    this.overlay.id = 'loadingOverlay';
    this.overlay.className = 'loading-overlay';
    this.overlay.innerHTML = `
      <style>
        .loading-overlay {
          display: flex;
          position: fixed;
          inset: 0;
          z-index: 99999;
          background-color: rgba(0, 0, 0, 0);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 200ms ease-out, background-color 200ms ease-out;
        }

        .loading-overlay.show {
          opacity: 1;
          pointer-events: auto;
          background-color: rgba(0, 0, 0, 0.3);
        }

        .spinner-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .spinner {
          width: 48px;
          height: 48px;
          border: 4px solid rgba(255, 255, 255, 0.3);
          border-top-color: #005B96;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .spinner-text {
          color: white;
          font-size: 1rem;
          font-weight: 500;
          letter-spacing: 0.5px;
        }
      </style>

      <div class="spinner-container">
        <div class="spinner"></div>
        <div class="spinner-text">Loading...</div>
      </div>
    `;

    // Append to body
    document.body.appendChild(this.overlay);
  }

  show(message = 'Loading...') {
    if (!this.overlay) {
      this.init();
    }
    
    // Update message if provided
    if (message) {
      const spinnerText = this.overlay.querySelector('.spinner-text');
      if (spinnerText) {
        spinnerText.textContent = message;
      }
    }
    
    this.overlay.classList.add('show');
    this.isVisible = true;
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  hide() {
    if (!this.overlay) return;
    
    this.overlay.classList.remove('show');
    this.isVisible = false;
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  /**
   * Force hide and reset the overlay immediately (used during navigation)
   * This ensures the overlay is hidden before the new page renders
   */
  reset() {
    if (!this.overlay) return;
    
    // Immediately hide without transition
    this.overlay.style.transition = 'none';
    this.overlay.classList.remove('show');
    this.isVisible = false;
    
    // Restore transition for next use
    setTimeout(() => {
      if (this.overlay) {
        this.overlay.style.transition = 'opacity 200ms ease-out, background-color 200ms ease-out';
      }
    }, 0);
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  destroy() {
    if (this.overlay) {
      this.overlay.remove();
      this.overlay = null;
    }
    document.body.style.overflow = '';
  }
}

// Create singleton instance
const loadingOverlay = new LoadingOverlay();

export default loadingOverlay;
