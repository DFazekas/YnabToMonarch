class UIButton extends HTMLElement {
  static get observedAttributes() {
    return ['type', 'disabled'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });  // ✅ use shadow DOM
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const type = this.getAttribute('type') || 'primary';
    const disabled = this.hasAttribute('disabled');

    let baseClasses = 'inline-flex justify-center items-center font-semibold rounded-lg transition text-sm px-5 py-3';
    let colorClasses = '';
    let disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

    let template = '';

    switch (type) {
      case 'primary':
        colorClasses = 'bg-[#1993e5] text-white hover:bg-blue-600';
        template = `
          <button ${disabled ? 'disabled' : ''} class="${baseClasses} ${colorClasses} ${disabledClasses}">
            <slot></slot>
          </button>`;
        break;

      case 'secondary':
        colorClasses = 'bg-white text-[#111518] border border-gray-300 hover:bg-gray-100';
        template = `
          <button ${disabled ? 'disabled' : ''} class="${baseClasses} ${colorClasses} ${disabledClasses}">
            <slot></slot>
          </button>`;
        break;

      case 'danger':
        colorClasses = 'bg-red-500 text-white hover:bg-red-600';
        template = `
          <button ${disabled ? 'disabled' : ''} class="${baseClasses} ${colorClasses} ${disabledClasses}">
            <slot></slot>
          </button>`;
        break;

      case 'text':
        template = `
          <a href="javascript:void(0)" class="text-blue-600 hover:underline ${disabledClasses}">
            <slot></slot>
          </a>`;
        break;

      default:
        template = `
          <button class="${baseClasses} ${disabledClasses}">
            <slot></slot>
          </button>`;
    }

    this.shadowRoot.innerHTML = `
      <style>
        :host { display: inline-block; }
      </style>
      ${template}
    `;
  }
}

customElements.define('ui-button', UIButton);
