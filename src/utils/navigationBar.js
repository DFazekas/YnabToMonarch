/**
 * Navigation Bar Utility
 * Creates consistent navigation bars across all views with proper responsive behavior
 */

/**
 * Creates a navigation bar with standardized styling and positioning
 * @param {Object} config - Navigation configuration
 * @param {string} config.backText - Text for the back button (default: "Back")
 * @param {string} config.nextText - Text for the next/continue button
 * @param {string} config.backId - ID for the back button (default: "backBtn")
 * @param {string} config.nextId - ID for the next/continue button (default: "continueBtn")
 * @param {boolean} config.showBack - Whether to show the back button (default: true)
 * @param {boolean} config.showNext - Whether to show the next button (default: false)
 * @param {string} config.nextType - Button type for next button (default: "text")
 * @param {boolean} config.nextDisabled - Whether next button is disabled (default: false)
 * @param {string} config.containerClass - Additional classes for the container
 * @returns {string} HTML string for the navigation bar
 */
export function createNavigationBar(config = {}) {
  const {
    backText = "Back",
    nextText = "Continue",
    backId = "backBtn",
    nextId = "continueBtn",
    showBack = true,
    showNext = false,
    nextDisabled = false,
    containerClass = ""
  } = config;

  const backButton = showBack ? `
    <button id="${backId}" class="ui-button order-2 sm:order-1 w-full sm:w-auto whitespace-nowrap" data-type="text" data-size="large">
      <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      ${backText}
    </button>
  ` : '<div></div>'; // Empty div to maintain flex layout

  const nextButton = showNext ? `
    <button id="${nextId}" 
            class="ui-button order-1 sm:order-2 w-full sm:w-auto whitespace-nowrap" 
            data-type="text" 
            data-size="large"
            ${nextDisabled ? 'disabled' : ''}>
      <span class="hidden sm:inline truncate">${nextText}</span>
      <span class="sm:hidden truncate">${nextText.split(' ')[0]}</span>
      <svg class="w-4 h-4 ml-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  ` : '<div></div>'; // Empty div to maintain flex layout

  return `
    <!-- Navigation Bar -->
    <div class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div class="container-responsive">
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-6 sm:py-8 gap-4 sm:gap-6 ${containerClass}">
          ${backButton}
          ${nextButton}
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a simple centered back button navigation (for pages without continue)
 * @param {Object} config - Navigation configuration
 * @param {string} config.backText - Text for the back button (default: "Back")
 * @param {string} config.backId - ID for the back button (default: "backBtn")
 * @param {string} config.containerClass - Additional classes for the container
 * @returns {string} HTML string for the navigation bar
 */
export function createSimpleNavigationBar(config = {}) {
  const {
    backText = "Back",
    backId = "backBtn",
    containerClass = ""
  } = config;

  return `
    <!-- Navigation Bar -->
    <div class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div class="container-responsive">
        <div class="flex justify-center items-center py-6 sm:py-8 ${containerClass}">
          <button id="${backId}" class="ui-button w-full sm:w-auto sm:max-w-xs whitespace-nowrap" data-type="text" data-size="large">
            <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            ${backText}
          </button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Creates a custom navigation bar with multiple buttons
 * @param {Array} buttons - Array of button configurations
 * @param {string} containerClass - Additional classes for the container
 * @returns {string} HTML string for the navigation bar
 */
export function createCustomNavigationBar(buttons = [], containerClass = "") {
  const buttonElements = buttons.map((btn, index) => {
    const {
      id,
      text,
      type = "text",
      size = "large",
      disabled = false,
      hidden = false,
      icon = null,
      href = null,
      target = null,
      order = index + 1
    } = btn;

    const isLink = href !== null;
    const element = isLink ? 'a' : 'button';
    const hiddenClass = hidden ? 'hidden' : '';
    const disabledAttr = disabled && !isLink ? 'disabled' : '';
    const hrefAttr = isLink ? `href="${href}"` : '';
    const targetAttr = isLink && target ? `target="${target}"` : '';
    
    const iconSvg = icon ? `
      <svg class="w-4 h-4 ${text ? 'mr-2 flex-shrink-0' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        ${icon}
      </svg>
    ` : '';

    return `
      <${element} id="${id}" 
              class="ui-button order-${order} w-full sm:w-auto whitespace-nowrap ${hiddenClass}" 
              data-type="${type}" 
              data-size="${size}"
              ${disabledAttr}
              ${hrefAttr}
              ${targetAttr}>
        ${iconSvg}${text}
      </${element}>
    `;
  }).join('\n');

  return `
    <!-- Navigation Bar -->
    <div class="bg-white border-t border-gray-200 mt-8 sm:mt-12">
      <div class="container-responsive">
        <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center py-6 sm:py-8 gap-4 sm:gap-6 ${containerClass}">
          ${buttonElements}
        </div>
      </div>
    </div>
  `;
}
