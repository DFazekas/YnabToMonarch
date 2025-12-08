/**
 * ClickableCard Web Component
 * Generic self-managing clickable card with slot-based content injection.
 * The entire card is clickable (unlike cards with multiple button children).
 * 
 * Usage:
 * ```html
 * <clickable-card 
 *   data-color="blue" 
 *   data-width="full">
 *   <svg slot="icon">...</svg>
 *   <svg slot="arrow">...</svg>
 *   <h3 slot="title">Card Title</h3>
 *   <p slot="description">Card description...</p>
 *   <div slot="action">Action text</div>
 * </clickable-card>
 * ```
 * 
 * Attributes:
 * - data-color: Color theme (blue, green, purple, etc.)
 * - data-width: Width style (full, auto, fixed)
 */

class ClickableCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
    this._setupEventListeners();
  }

  static get observedAttributes() {
    return ['data-color', 'data-width'];
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this._updateStyles();
    }
  }

  _getColorClasses() {
    const color = this.getAttribute('data-color') || 'blue';
    
    const colorMap = {
      blue: {
        border: '#93c5fd',
        bg: 'rgba(219, 234, 254, 0.3)',
        iconBg: '#dbeafe',
        iconBgHover: '#bfdbfe',
        iconColor: '#2563eb',
        textColor: '#2563eb',
        textColorHover: '#1d4ed8',
        decorBg: '#dbeafe'
      },
      green: {
        border: '#86efac',
        bg: 'rgba(220, 252, 231, 0.3)',
        iconBg: '#dcfce7',
        iconBgHover: '#bbf7d0',
        iconColor: '#16a34a',
        textColor: '#16a34a',
        textColorHover: '#15803d',
        decorBg: '#dcfce7'
      },
      purple: {
        border: '#c4b5fd',
        bg: 'rgba(237, 233, 254, 0.3)',
        iconBg: '#ede9fe',
        iconBgHover: '#ddd6fe',
        iconColor: '#7c3aed',
        textColor: '#7c3aed',
        textColorHover: '#6d28d9',
        decorBg: '#ede9fe'
      },
      red: {
        border: '#fca5a5',
        bg: 'rgba(254, 226, 226, 0.3)',
        iconBg: '#fee2e2',
        iconBgHover: '#fecaca',
        iconColor: '#dc2626',
        textColor: '#dc2626',
        textColorHover: '#b91c1c',
        decorBg: '#fee2e2'
      }
    };

    return colorMap[color] || colorMap.blue;
  }

  _updateStyles() {
    const colors = this._getColorClasses();
    const width = this.getAttribute('data-width') || 'full';
    
    const widthStyles = {
      full: 'width: 100%;',
      auto: 'width: auto;',
      fixed: 'width: 300px;'
    };

    const root = this.shadowRoot.querySelector('.card-container');
    if (root) {
      root.style.cssText = widthStyles[width] || widthStyles.full;
    }

    // Update CSS custom properties
    if (this.shadowRoot.styleSheets[0]) {
      const sheet = this.shadowRoot.styleSheets[0];
      const rule = sheet.cssRules[0];
      if (rule && rule.style) {
        rule.style.setProperty('--card-border', colors.border);
        rule.style.setProperty('--card-bg-hover', colors.bg);
        rule.style.setProperty('--icon-bg', colors.iconBg);
        rule.style.setProperty('--icon-bg-hover', colors.iconBgHover);
        rule.style.setProperty('--icon-color', colors.iconColor);
        rule.style.setProperty('--text-color', colors.textColor);
        rule.style.setProperty('--text-color-hover', colors.textColorHover);
        rule.style.setProperty('--decor-bg', colors.decorBg);
      }
    }
  }

  _render() {
    const colors = this._getColorClasses();
    const width = this.getAttribute('data-width') || 'full';
    
    const widthStyles = {
      full: 'width: 100%;',
      auto: 'width: auto; min-width: 280px;',
      fixed: 'width: 300px;'
    };

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --card-border: ${colors.border};
          --card-bg-hover: ${colors.bg};
          --icon-bg: ${colors.iconBg};
          --icon-bg-hover: ${colors.iconBgHover};
          --icon-color: ${colors.iconColor};
          --text-color: ${colors.textColor};
          --text-color-hover: ${colors.textColorHover};
          --decor-bg: ${colors.decorBg};
          display: block;
        }

        .card-container {
          ${widthStyles[width] || widthStyles.full}
          cursor: pointer;
          user-select: none;
        }

        @media (min-width: 1024px) {
          .card-container {
            flex: 1;
          }
        }

        .card-inner {
          height: 100%;
          padding: 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          background-color: white;
          position: relative;
          overflow: hidden;
          transition: all 300ms;
        }

        @media (min-width: 640px) {
          .card-inner {
            padding: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .card-inner {
            padding: 2rem;
          }
        }

        .card-container:hover .card-inner {
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          border-color: var(--card-border);
          background-color: var(--card-bg-hover);
        }

        .decoration {
          position: absolute;
          top: 0;
          right: 0;
          width: 5rem;
          height: 5rem;
          background-color: var(--decor-bg);
          border-radius: 9999px;
          transform: translateY(-2.5rem) translateX(2.5rem);
          opacity: 0.5;
          transition: opacity 300ms;
        }

        .card-container:hover .decoration {
          opacity: 0.75;
        }

        .card-content {
          position: relative;
          z-index: 10;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
        }

        .icon-wrapper {
          width: 2.5rem;
          height: 2.5rem;
          background-color: var(--icon-bg);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 300ms;
        }

        @media (min-width: 640px) {
          .icon-wrapper {
            width: 3rem;
            height: 3rem;
          }
        }

        .card-container:hover .icon-wrapper {
          background-color: var(--icon-bg-hover);
        }

        ::slotted([slot="icon"]) {
          width: 1.25rem;
          height: 1.25rem;
          color: var(--icon-color);
        }

        @media (min-width: 640px) {
          ::slotted([slot="icon"]) {
            width: 1.5rem;
            height: 1.5rem;
          }
        }

        .arrow-wrapper {
          color: var(--text-color);
          transition: color 300ms;
        }

        .card-container:hover .arrow-wrapper {
          color: var(--text-color-hover);
        }

        ::slotted([slot="arrow"]) {
          width: 1.25rem;
          height: 1.25rem;
        }

        .card-title {
          margin-bottom: 0.75rem;
        }

        ::slotted([slot="title"]) {
          font-size: 1.125rem;
          font-weight: 600;
          color: #111827;
          margin: 0;
          line-height: 1.4;
        }

        @media (min-width: 640px) {
          ::slotted([slot="title"]) {
            font-size: 1.25rem;
          }
        }

        @media (min-width: 768px) {
          ::slotted([slot="title"]) {
            font-size: 1.5rem;
          }
        }

        .card-description {
          margin-bottom: 1.5rem;
          min-height: 3rem;
        }

        ::slotted([slot="description"]) {
          color: #4b5563;
          font-size: 0.875rem;
          line-height: 1.6;
          margin: 0;
        }

        @media (min-width: 640px) {
          ::slotted([slot="description"]) {
            font-size: 1rem;
          }
        }

        .card-action {
          display: flex;
          align-items: center;
        }

        ::slotted([slot="action"]) {
          color: var(--text-color);
          font-weight: 600;
          font-size: 0.875rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 300ms;
          margin: 0;
        }

        @media (min-width: 640px) {
          ::slotted([slot="action"]) {
            font-size: 1rem;
          }
        }

        .card-container:hover ::slotted([slot="action"]) {
          color: var(--text-color-hover);
        }

        .action-arrow {
          width: 1rem;
          height: 1rem;
          transition: transform 300ms;
        }

        .card-container:hover .action-arrow {
          transform: translateX(0.25rem);
        }
      </style>

      <div class="card-container">
        <div class="card-inner">
          <div class="decoration"></div>
          
          <div class="card-content">
            <div class="card-header">
              <div class="icon-wrapper">
                <slot name="icon"></slot>
              </div>
              <div class="arrow-wrapper">
                <slot name="arrow"></slot>
              </div>
            </div>

            <div class="card-title">
              <slot name="title"></slot>
            </div>

            <div class="card-description">
              <slot name="description"></slot>
            </div>

            <div class="card-action">
              <slot name="action"></slot>
              <svg class="action-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _setupEventListeners() {
    const container = this.shadowRoot.querySelector('.card-container');
    
    container.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('card-click', {
        bubbles: true,
        composed: true
      }));
    });
  }
}

// Register the custom element
if (!customElements.get('clickable-card')) {
  customElements.define('clickable-card', ClickableCard);
}

export { ClickableCard };
