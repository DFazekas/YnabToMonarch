/**
 * Card Web Component
 * Generic self-managing card with slot-based content injection.
 * 
 * Usage:
 * ```html
 * <card 
 *   data-color="blue" 
 *   data-width="full">
 *   <svg slot="icon">...</svg>
 *   <svg slot="arrow">...</svg>
 *   <h3 slot="title">Card Title</h3>
 *   <p slot="description">Card description...</p>
 *   <div slot="actions">Action buttons</div>
 * </card>
 * ```
 * 
 * Attributes:
 * - data-color: Color theme (blue, green, purple, etc.)
 * - data-width: Width style (full, auto, fixed)
 */

class Card extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this._render();
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
        iconBg: '#bfdbfe',
        iconColor: '#1d4ed8',
        textColor: '#2563eb',
        decorBg: '#dbeafe'
      },
      green: {
        border: '#86efac',
        bg: 'rgba(220, 252, 231, 0.3)',
        iconBg: '#bbf7d0',
        iconColor: '#16a34a',
        textColor: '#16a34a',
        decorBg: '#dcfce7'
      },
      purple: {
        border: '#c4b5fd',
        bg: 'rgba(237, 233, 254, 0.3)',
        iconBg: '#ddd6fe',
        iconColor: '#7c3aed',
        textColor: '#7c3aed',
        decorBg: '#ede9fe'
      },
      red: {
        border: '#fca5a5',
        bg: 'rgba(254, 226, 226, 0.3)',
        iconBg: '#fecaca',
        iconColor: '#dc2626',
        textColor: '#dc2626',
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
        rule.style.setProperty('--card-bg', colors.bg);
        rule.style.setProperty('--icon-bg', colors.iconBg);
        rule.style.setProperty('--icon-color', colors.iconColor);
        rule.style.setProperty('--text-color', colors.textColor);
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
          --card-bg: ${colors.bg};
          --icon-bg: ${colors.iconBg};
          --icon-color: ${colors.iconColor};
          --text-color: ${colors.textColor};
          --decor-bg: ${colors.decorBg};
          --card-title-font-size: 1.125rem;
          --card-title-margin-bottom: 0;
          display: block;
        }

        .card-container {
          ${widthStyles[width] || widthStyles.full}
          user-select: none;
        }

        @media (min-width: 640px) {
          :host {
            --card-title-font-size: 1.25rem;
            --card-title-margin-bottom: 1rem;
          }
        }

        @media (min-width: 768px) {
          :host {
            --card-title-font-size: 1.5rem;
            --card-title-margin-bottom: 1.5rem;
          }
        }

        .card-inner {
          height: 100%;
          padding: 1rem;
          border: 2px solid var(--card-border);
          border-radius: 0.75rem;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          background-color: var(--card-bg);
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

        .card-content {
          position: relative;
          z-index: 10;
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 1rem;
          gap: 1rem;
        }

        .card-title-wrapper {
          flex: 1;
          padding-right: 1rem;
          font-size: var(--card-title-font-size);
          font-weight: 700;
          color: #111827;
          line-height: 1.5;
        }

        .card-title-wrapper ::slotted(*) {
          font-size: inherit;
          font-weight: inherit;
          color: inherit;
          line-height: inherit;
          margin: 0;
          margin-bottom: var(--card-title-margin-bottom);
          display: block;
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

        .card-title {
          margin-bottom: 0.75rem;
        }

        .card-eyebrow {
          font-size: 0.875rem;
          font-weight: 300;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #9ca3af;
          margin-bottom: 0.25rem;
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

        .card-actions {
          display: flex;
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
        }

        ::slotted([slot="actions"]) {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 1rem;
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
              <div class="card-title-wrapper">
                <slot class="card-eyebrow" name="eyebrow"></slot>
                <slot class="card-title" name="title"></slot>
              </div>
            </div>

            <div class="card-description">
              <slot name="description"></slot>
            </div>

            <div class="card-actions">
              <slot name="actions"></slot>
              <slot name="action-info"></slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

// Register the custom element
if (!customElements.get('ui-card')) {
  customElements.define('ui-card', Card);
}

export { Card };