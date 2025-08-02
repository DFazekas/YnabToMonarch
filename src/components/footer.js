/**
 * Reusable App Footer Component
 * Provides consistent footer across all pages with legal disclaimers and navigation links
 */

/**
 * Creates and returns the app footer HTML element
 * @returns {HTMLElement} The footer element
 */
export function createFooter() {
  const footer = document.createElement('footer');
  footer.className = 'border-t border-[#f0f3f4] py-3 sm:py-4 px-3 sm:px-6 lg:px-8 text-xs sm:text-sm bg-white';
  
  footer.innerHTML = `
    <div class="max-w-7xl mx-auto">
      <!-- Main Footer Content -->
      <div class="flex flex-col sm:flex-row justify-between items-center gap-2 mb-3">
        <span class="text-center sm:text-left">© 2025 Fazekas Solutions</span>
        <div class="flex gap-4 text-center sm:text-right">
          <a href="/privacy.html" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
            Privacy Policy
          </a>
          <a href="/terms.html" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
            Terms of Service
          </a>
          <a href="/support.html" class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200">
            Support
          </a>
          <a href="https://github.com/DFazekas/YnabToMonarch" 
             class="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200" 
             target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
        </div>
      </div>
      
      <!-- YNAB and Monarch Money Disclaimers (Required by API Terms) -->
      <div class="text-center text-gray-500 text-xs border-t border-gray-100 pt-3">
        <p class="mb-2">
          We are not affiliated, associated, or in any way officially connected with YNAB or any of its subsidiaries or affiliates. 
          The official YNAB website can be found at <a href="https://www.ynab.com" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">https://www.ynab.com</a>.
          The names YNAB and You Need A Budget, as well as related names, tradenames, marks, trademarks, emblems, and images are registered trademarks of YNAB.
        </p>
        <p>
          We are not affiliated, associated, or in any way officially connected with Monarch Money or any of its subsidiaries or affiliates. 
          The official Monarch Money website can be found at <a href="https://www.monarchmoney.com" class="text-blue-600 hover:text-blue-800 hover:underline" target="_blank" rel="noopener noreferrer">https://www.monarchmoney.com</a>.
        </p>
      </div>
    </div>
  `;
  
  return footer;
}

/**
 * Initializes the footer by appending it to the document body
 * Call this function on page load to add the footer
 */
export function initFooter() {
  const footer = createFooter();
  document.body.appendChild(footer);
}

/**
 * Replaces an existing footer with the new component
 * @param {string} existingFooterSelector - CSS selector for the existing footer
 */
export function replaceFooter(existingFooterSelector = 'footer') {
  const existingFooter = document.querySelector(existingFooterSelector);
  if (existingFooter) {
    const newFooter = createFooter();
    existingFooter.parentNode.replaceChild(newFooter, existingFooter);
  } else {
    // If no existing footer found, just append to body
    initFooter();
  }
}
