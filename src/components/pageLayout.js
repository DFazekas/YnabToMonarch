import { goBack, navigate } from '../router.js';
import state from '../state.js';

/**
 * Page Layout Component
 * Provides consistent, responsive layout structure for all pages
 * Handles: responsive spacing, centering, and content containment
 */

/**
 * Wraps existing page content with consistent layout structure
 * Call this ONCE at the start of view init. The router has already injected
 * the HTML template, so this function moves that content into the layout.
 * 
 * @param {Object} options - Optional configuration
 */
export function renderPageLayout(options = {}) {
  const {
    containerId = 'pageLayout',
    navbar = null,
    header = null,
    className = ''
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Page layout container #${containerId} not found`);
    return;
  }

  // Get all siblings after pageLayout container (the page content)
  const pageContent = [];
  let sibling = container.nextElementSibling;
  while (sibling) {
    pageContent.push(sibling);
    sibling = sibling.nextElementSibling;
  }

  // Set container as a page layout wrapper with consistent responsive styling
  container.className = `min-h-screen flex flex-col w-full max-w-full mx-auto ${className}`;
  container.innerHTML = `
    <main class="flex-1 w-full max-w-full mx-auto px-4 py-2 overflow-x-hidden">
      <div class="max-w-6xl mx-auto w-full min-w-0 flex flex-col space-y-6 ">
        <!-- Navigation Bar -->
        <div id="navigationBar" class="min-w-0"></div>

        <!-- Page Header -->
        <div id="pageHeader" class="min-w-0 mx-auto"></div>

        <!-- Page Content Slot -->
        <div id="pageContent" class="min-w-0 mx-auto w-full"></div>
      </div>
    </main>
  `;

  // Render optional navbar and header
  if (navbar != null) renderNavigationBar(navbar);
  if (header != null) renderPageHeader(header);

  // Move the original page content into the pageContent slot
  const contentContainer = document.getElementById('pageContent');
  if (contentContainer) {
    pageContent.forEach(element => {
      contentContainer.appendChild(element);
    });
  }
}

/**
 * Renders a navigation bar with optional back button and data management button.
 * 
 * @param {Object} options - Configuration options
 * @param {boolean} options.showBackButton - Whether to show the back button (default: true)
 * @param {boolean} options.showDataButton - Whether to show the data management button (default: true)
 * @param {string} options.backText - Custom text for back button (default: "Back")
 * @param {string} options.containerId - ID of container to inject navigation into (default: "navigationBar")
 * 
 * @example
 * ```html
 * <div id="navigationBar"></div>
 * ```
 * 
 * ```javascript
 * renderNavigationBar({ showBackButton: true, showDataButton: true });
 * ```
 */
export function renderNavigationBar(options = {}) {
  const {
    showBackButton = true,
    showDataButton = true,
    backText = 'Back',
    containerId = 'navigationBar'
  } = options;

  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`Navigation container with id "${containerId}" not found`);
    return;
  }

  // Check if there's any user data stored
  const hasData = checkForStoredData();
  const dataButtonText = hasData ? 'Manage your data' : 'No data currently stored';

  // Build navigation HTML
  let navHTML = '<div class="flex flex-wrap items-center justify-between gap-2 mb-4">';

  // Back button (left side)
  if (showBackButton) {
    navHTML += `
      <ui-button 
        id="navBackBtn" 
        data-type="text"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${backText}
      </ui-button>
    `;
  } else {
    navHTML += '<div></div>'; // Spacer for flexbox
  }

  // Data management button (right side)
  if (showDataButton) {
    navHTML += `
      <ui-button 
        id="navDataBtn" 
        data-type="text"
        ${!hasData ? 'style="opacity: 0.6;"' : ''}
      >
        ${dataButtonText}
      </ui-button>
    `;
  }

  navHTML += '</div>';

  container.innerHTML = navHTML;

  // Attach event listeners
  if (showBackButton) {
    const backBtn = document.getElementById('navBackBtn');
    backBtn?.addEventListener('click', () => {
      goBack();
    });
  }

  if (showDataButton) {
    const dataBtn = document.getElementById('navDataBtn');
    dataBtn?.addEventListener('click', () => {
      navigate('/data-management');
    });
  }
}

/**
 * Checks if there's any user data stored (per new storage strategy)
 * - Monarch credentials: sessionStorage
 * - Financial data: IndexedDB and in-memory state
 * @returns {boolean} True if any data exists
 */
function checkForStoredData() {
  // Check in-memory state
  const hasStateAccounts = state.accounts && state.accounts.length() > 0;
  const hasMonarchAccounts = state.monarchAccounts !== null;

  // Check sessionStorage for Monarch credentials (new strategy)
  const hasMonarchEmail = !!sessionStorage.getItem('monarch_email');
  const hasMonarchToken = !!sessionStorage.getItem('monarch_token');

  // Note: IndexedDB is checked asynchronously on upload page init
  // This function is for quick sync checks only

  return hasStateAccounts || hasMonarchAccounts || hasMonarchEmail || hasMonarchToken;
}

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
    <section class="text-center mb-2 ${className}">
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
