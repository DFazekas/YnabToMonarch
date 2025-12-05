/**
 * Renders a standardized page header with title and description.
 * 
 * @param {Object} options - Configuration options
 * @param {string} options.title - The main heading text
 * @param {string} options.description - The subheading/description text
 * @param {string} options.containerId - ID of container to inject header into (default: "pageHeader")
 * @param {string} options.className - Additional CSS classes for the section (optional)
 * 
 * @example
 * ```html
 * <div id="pageHeader"></div>
 * ```
 * 
 * ```javascript
 * renderPageHeader({
 *   title: "Step 1: Import YNAB Data",
 *   description: "Choose how you'd like to bring your YNAB data into Monarch Money...",
 *   containerId: "pageHeader"
 * });
 * ```
 */
export function renderPageHeader(options = {}) {
  const {
    title = '',
    description = '',
    containerId = 'pageHeader',
    className = ''
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Page header container with id "${containerId}" not found`);
    return;
  }

  const headerHTML = `
    <section class="text-center mb-5 ${className}">
      <div class="inline-flex items-center justify-center gap-2 mb-6">
        <h2 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
          ${escapeHtml(title)}
        </h2>
      </div>

      <p class="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto px-2 leading-relaxed">
        ${escapeHtml(description)}
      </p>
    </section>
  `;

  container.innerHTML = headerHTML;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
