/**
 * InfoBanner - Reusable Web Component for informational banners
 * 
 * Features:
 * - Configurable colors (green, blue, yellow, red, gray)
 * - Optional icon with customizable SVG path
 * - Optional border controlled by has-border attribute
 * - Default slot for HTML content (supports bold text, links, etc.)
 * - Action slot for buttons or custom content
 * - Compact design based on "100% Private" pattern
 * - Responsive padding and layout
 * 
 * Usage:
 * <info-banner color="green" icon-type="checkmark" has-border>
 *   <strong>100% Private:</strong> Your financial data is sensitive, and we treat it that way.
 *   <ui-button slot="action" data-type="text">Learn more</ui-button>
 * </info-banner>
 */

class InfoBanner extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['color', 'icon-type', 'has-border'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.shadowRoot.innerHTML) {
      this.render();
    }
  }

  getColorClasses() {
    const color = this.getAttribute('color') || 'green';
    const colorMap = {
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        iconText: 'text-green-600',
        textDark: 'text-green-800',
        cssVar: '--banner-color: #166534'
      },
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        iconText: 'text-blue-600',
        textDark: 'text-blue-800',
        cssVar: '--banner-color: #1e40af'
      },
      yellow: {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        iconText: 'text-yellow-600',
        textDark: 'text-yellow-800',
        cssVar: '--banner-color: #854d0e'
      },
      red: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        iconText: 'text-red-600',
        textDark: 'text-red-800',
        cssVar: '--banner-color: #991b1b'
      },
      gray: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        iconText: 'text-gray-600',
        textDark: 'text-gray-800',
        cssVar: '--banner-color: #1f2937'
      }
    };
    return colorMap[color] || colorMap.green;
  }

  getIconSvg() {
    const iconType = this.getAttribute('icon-type') || 'checkmark';
    const iconMap = {
      checkmark: `
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `,
      info: `
        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
      `,
      warning: `
        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
      `,
      lock: `
        <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
      `,
      shield: `
        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
      `
    };
    return iconMap[iconType] || iconMap.checkmark;
  }

  render() {
    const colors = this.getColorClasses();
    const iconSvg = this.getIconSvg();
    const hasBorder = this.hasAttribute('has-border');

    this.shadowRoot.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .banner {
          border-radius: 0.5rem;
          padding: 0.75rem;
          width: 100%;
        }

        .banner.has-border {
          border-width: 1px;
          border-style: solid;
        }

        .banner-content {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
        }

        .icon {
          width: 1.25rem;
          height: 1.25rem;
          flex-shrink: 0;
          margin-top: 0.125rem;
        }

        .content-wrapper {
          flex: 1;
          min-width: 0;
        }

        .text {
          font-size: 0.75rem;
          line-height: 1.5;
        }

        .action-slot {
          margin-top: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        ::slotted([slot="action"]) {
          font-size: 0.75rem !important;
          font-weight: 400 !important;
          color: var(--banner-color) !important;
        }

        ::slotted(ui-button[slot="action"]) {
          color: var(--banner-color) !important;
        }

        ::slotted(ui-modal[slot="action"]) {
          color: var(--banner-color) !important;
        }

        @media (min-width: 640px) {
          ::slotted([slot="action"]) {
            font-size: 0.875rem !important;
          }
        }

        /* Color classes */
        .bg-green-50 { background-color: #f0fdf4; }
        .border-green-200 { border-color: #bbf7d0; }
        .text-green-600 { color: #16a34a; }
        .text-green-800 { color: #166534; }

        .bg-blue-50 { background-color: #eff6ff; }
        .border-blue-200 { border-color: #bfdbfe; }
        .text-blue-600 { color: #2563eb; }
        .text-blue-800 { color: #1e40af; }

        .bg-yellow-50 { background-color: #fefce8; }
        .border-yellow-200 { border-color: #fde68a; }
        .text-yellow-600 { color: #ca8a04; }
        .text-yellow-800 { color: #854d0e; }

        .bg-red-50 { background-color: #fef2f2; }
        .border-red-200 { border-color: #fecaca; }
        .text-red-600 { color: #dc2626; }
        .text-red-800 { color: #991b1b; }

        .bg-gray-50 { background-color: #f9fafb; }
        .border-gray-200 { border-color: #e5e7eb; }
        .text-gray-600 { color: #4b5563; }
        .text-gray-800 { color: #1f2937; }

        ::slotted(*) {
          margin: 0;
        }

        @media (min-width: 640px) {
          .banner {
            padding: 1rem;
          }
          
          .banner-content {
            gap: 0.75rem;
          }

          .text {
            font-size: 0.875rem;
          }
        }
      </style>

      <div class="banner ${colors.bg} ${hasBorder ? `has-border ${colors.border}` : ''}" style="${colors.cssVar}">
        <div class="banner-content">
          <svg class="icon ${colors.iconText}" fill="currentColor" viewBox="0 0 20 20">
            ${iconSvg}
          </svg>
          <div class="content-wrapper">
            <div class="text ${colors.textDark}">
              <slot></slot>
            </div>
            <div class="action-slot">
              <slot name="action"></slot>
            </div>
          </div>
        </div>
      </div>
    `;

    // Style slotted buttons to match banner color
    setTimeout(() => {
      const color = this.getAttribute('color') || 'green';
      const colorMap = {
        green: 'green',
        blue: 'blue',
        yellow: 'yellow',
        red: 'red',
        gray: 'grey'
      };

      const actionSlot = this.shadowRoot.querySelector('slot[name="action"]');
      if (actionSlot) {
        const assignedElements = actionSlot.assignedElements();
        assignedElements.forEach(el => {
          // Set data-color on ui-button elements
          if (el.tagName === 'UI-BUTTON') {
            el.setAttribute('data-color', colorMap[color]);
            // Trigger style reapplication if the method exists
            if (typeof el.applyStyles === 'function') {
              el.applyStyles();
            } else if (typeof el.updateStyle === 'function') {
              el.updateStyle();
            }
          } 
          // For ui-modal, find and style the trigger button
          else if (el.tagName === 'UI-MODAL') {
            const button = el.querySelector('[slot="trigger"]');
            if (button && button.tagName === 'UI-BUTTON') {
              button.setAttribute('data-color', colorMap[color]);
              // Trigger style reapplication if the method exists
              if (typeof button.applyStyles === 'function') {
                button.applyStyles();
              } else if (typeof button.updateStyle === 'function') {
                button.updateStyle();
              }
            }
          }
        });
      }
    }, 0);
  }
}

customElements.define('info-banner', InfoBanner);

export default InfoBanner;
