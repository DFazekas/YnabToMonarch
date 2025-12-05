import { goBack, navigate } from '../router.js';
import state from '../state.js';
import { getLocalStorage } from '../utils/storage.js';
import { renderButtons } from './button.js';

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
      <button 
        id="navBackBtn" 
        class="ui-button flex items-center text-sm"
        data-type="text"
        data-size="small"
      >
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        ${backText}
      </button>
    `;
  } else {
    navHTML += '<div></div>'; // Spacer for flexbox
  }
  
  // Data management button (right side)
  if (showDataButton) {
    navHTML += `
      <button 
        id="navDataBtn" 
        class="ui-button text-xs sm:text-sm"
        data-type="text"
        data-size="small"
        ${!hasData ? 'style="opacity: 0.6; cursor: default;"' : ''}
      >
        ${dataButtonText}
      </button>
    `;
  }
  
  navHTML += '</div>';
  
  container.innerHTML = navHTML;

  // Re-render UI buttons after injecting HTML
  renderButtons();

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
      if (hasData) {
        navigate('/data-management');
      }
    });
  }
}

/**
 * Checks if there's any user data stored in localStorage or sessionStorage
 * @returns {boolean} True if any data exists
 */
function checkForStoredData() {
  // Check state
  const hasStateAccounts = state.accounts && Object.keys(state.accounts).length > 0;
  const hasMonarchAccounts = state.monarchAccounts !== null;
  
  // Check sessionStorage
  const hasSessionAccounts = sessionStorage.getItem('ynab_accounts') !== null;
  const hasSessionMonarch = sessionStorage.getItem('monarch_accounts') !== null;
  
  // Check localStorage
  const localStorage = getLocalStorage();
  const hasLocalStorageData = !!(
    localStorage.email || 
    localStorage.encryptedPassword || 
    localStorage.token || 
    localStorage.uuid
  );
  
  return hasStateAccounts || hasMonarchAccounts || hasSessionAccounts || hasSessionMonarch || hasLocalStorageData;
}
