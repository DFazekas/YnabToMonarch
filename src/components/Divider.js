/**
 * Divider Web Component
 * Horizontal divider with centered text and lines on either side.
 * 
 * Usage:
 * ```html
 * <ui-divider>OR</ui-divider>
 * <ui-divider data-color="gray">AND</ui-divider>
 * ```
 * 
 * Attributes:
 * - data-color: Text and line color (default: gray-400)
 */

class Divider extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
  }

  static get observedAttributes() {
    return ['data-color'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this._updateStyles();
    }
  }

  _getColor() {
    const color = this.getAttribute('data-color') || 'gray-400';
    
    const colorMap = {
      'gray-300': '#d1d5db',
      'gray-400': '#9ca3af',
      'gray-500': '#6b7280',
      'gray-600': '#4b5563',
      'blue-400': '#60a5fa',
      'purple-400': '#c084fc'
    };

    return colorMap[color] || colorMap['gray-400'];
  }

  _updateStyles() {
    const color = this._getColor();
    
    if (this.shadowRoot.styleSheets[0]) {
      const sheet = this.shadowRoot.styleSheets[0];
      const rule = sheet.cssRules[0];
      if (rule && rule.style) {
        rule.style.setProperty('--divider-color', color);
      }
    }
  }

  _render() {
    const color = this._getColor();

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --divider-color: ${color};
          display: block;
          width: 100%;
        }

        .divider-container {
          display: flex;
          align-items: center;
          width: 100%;
          gap: 1rem;
        }

        .divider-line {
          flex: 1;
          height: 1px;
          background-color: var(--divider-color);
        }

        .divider-text {
          color: var(--divider-color);
          font-size: 0.875rem;
          font-weight: 400;
          white-space: nowrap;
          user-select: none;
        }
      </style>

      <div class="divider-container">
        <div class="divider-line"></div>
        <span class="divider-text">
          <slot></slot>
        </span>
        <div class="divider-line"></div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get('ui-divider')) {
  customElements.define('ui-divider', Divider);
}

export { Divider };
