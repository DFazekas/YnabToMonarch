import { clearStorage, getLocalStorage } from '../../utils/storage.js';
import { clearAppState } from '../../router.js';
import state from '../../state.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initDataManagementView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: false
    },
    header: {
      title: 'Data Management',
      description: 'View and manage all data stored in your browser. This includes session data, local storage, and application state.',
      containerId: 'pageHeader'
    }
  });

  // Populate data sections
  displayStateData();
  displaySessionStorageData();
  displayLocalStorageData();

  // Attach event listeners;
  document.getElementById('exportDataBtn').addEventListener('click', handleExportData);
  document.getElementById('clearAllDataBtn').addEventListener('click', () => openModal('confirmClearModal'));

  // Make toggle function globally available for inline onclick handlers
  window.toggleCollapse = toggleCollapse;
}

function openModal(id) {
  const modal = document.getElementById(id);
  modal.open();

  // Query buttons after modal is opened (they're now in the DOM)
  // Buttons are rendered in the modal overlay, so we search there
  // Use a small delay to ensure DOM updates have completed
  setTimeout(() => {
    // Search in the modal overlay's footer where the buttons are rendered
    const footerContainer = modal._modalOverlay?.querySelector('.ui-modal-footer');
    const cancelBtn = footerContainer?.querySelector('#cancelBtn');
    const applyBtn = footerContainer?.querySelector('#applyBtn');

    if (cancelBtn) {
      cancelBtn.onclick = () => modal.close();
    }
    if (applyBtn) {
      applyBtn.onclick = () => {
        handleClearAllData();
        
        // Update displayed data
        displayStateData();
        displaySessionStorageData();
        displayLocalStorageData();
        
        modal.close();
      };
    }
  }, 0);
}

/**
 * Toggle visibility of a collapsible section
 */
function toggleCollapse(id) {
  const element = document.getElementById(id);
  const button = element?.previousElementSibling;
  const icon = button?.querySelector('.collapse-icon');

  if (element && icon) {
    const isHidden = element.classList.contains('hidden');

    if (isHidden) {
      element.classList.remove('hidden');
      icon.style.transform = 'rotate(90deg)';
    } else {
      element.classList.add('hidden');
      icon.style.transform = 'rotate(0deg)';
    }
  }
}

/**
 * Display current application state data
 */
function displayStateData() {
  const container = document.getElementById('stateDataSection');
  if (!container) return;

  const accountCount = state.accounts ? Object.keys(state.accounts).length : 0;
  const monarchCount = state.monarchAccounts ? (Array.isArray(state.monarchAccounts) ? state.monarchAccounts.length : Object.keys(state.monarchAccounts).length) : 0;
  // Check for actual YNAB access token, not just state object
  const hasYnabAuth = !!sessionStorage.getItem('ynab_access_token');
  const hasMonarchAuth = !!state.credentials?.apiToken;

  // Check if there's any data to show
  const hasData = accountCount > 0 || monarchCount > 0 || hasYnabAuth || hasMonarchAuth;

  if (!hasData) {
    container.innerHTML = '<p class="text-gray-500 text-sm italic">No application state data</p>';
    return;
  }

  const html = `
    <div class="space-y-3">
      <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
        <p class="text-sm text-blue-800 font-medium">Data Summary</p>
      </div>
      
      <div class="space-y-2">
        ${accountCount > 0 ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">YNAB Data</p>
          <p class="text-sm text-gray-600 mt-1">
            ✓ ${accountCount} account${accountCount !== 1 ? 's' : ''} imported
          </p>
        </div>
        ` : ''}

        ${monarchCount > 0 ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Monarch Money Data</p>
          <p class="text-sm text-gray-600 mt-1">
            ✓ ${monarchCount} account${monarchCount !== 1 ? 's' : ''} synced
          </p>
        </div>
        ` : ''}

        ${hasYnabAuth || hasMonarchAuth ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Authentication Status</p>
          <p class="text-sm text-gray-600 mt-1">
            ${hasYnabAuth ? 'YNAB: ✓ Connected<br/>' : ''}
            ${hasMonarchAuth ? 'Monarch: ✓ Connected' : ''}
          </p>
        </div>
        ` : ''}
      </div>
    </div>
  `;
  container.innerHTML = html;
}

/**
 * Display session storage data
 */
function displaySessionStorageData() {
  const container = document.getElementById('sessionStorageSection');
  if (!container) return;

  // Track what types of data are in session storage without revealing sensitive details
  const hasYnabToken = !!sessionStorage.getItem('ynab_access_token');
  const hasYnabRefresh = !!sessionStorage.getItem('ynab_refresh_token');
  const hasYnabExpiry = !!sessionStorage.getItem('ynab_token_expires_at');
  const hasYnabAccounts = !!sessionStorage.getItem('ynab_accounts');
  const hasMonarchAccounts = !!sessionStorage.getItem('monarch_accounts');
  const hasMonarchToken = !!sessionStorage.getItem('monarch_api_token');
  const hasMonarchUuid = !!sessionStorage.getItem('monarch_device_uuid');
  const hasExpectedState = !!sessionStorage.getItem('ynab_oauth_expected_state');

  // Check if there's any data to show
  const hasAnyData = hasYnabToken || hasYnabRefresh || hasYnabExpiry || hasYnabAccounts || 
                      hasMonarchAccounts || hasMonarchToken || hasMonarchUuid || hasExpectedState;

  if (!hasAnyData) {
    container.innerHTML = '<p class="text-gray-500 text-sm italic">No session storage data</p>';
    return;
  }

  const html = `
    <div class="space-y-3">
      <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
        <p class="text-sm text-purple-800 font-medium">Session Data Overview</p>
        <p class="text-xs text-purple-700 mt-1">Data in session storage is cleared when this tab closes</p>
      </div>

      <div class="space-y-2">
        ${hasYnabToken || hasYnabRefresh || hasYnabExpiry ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">YNAB Authentication</p>
          <p class="text-sm text-gray-600 mt-1">
            ${hasYnabToken ? 'Access Token: ✓ Stored<br/>' : ''}
            ${hasYnabRefresh ? 'Refresh Token: ✓ Stored<br/>' : ''}
            ${hasYnabExpiry ? 'Token Expiry: ✓ Set' : ''}
          </p>
        </div>
        ` : ''}

        ${hasYnabAccounts || hasMonarchAccounts ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Account Data</p>
          <p class="text-sm text-gray-600 mt-1">
            ${hasYnabAccounts ? 'YNAB Accounts: ✓ Cached<br/>' : ''}
            ${hasMonarchAccounts ? 'Monarch Accounts: ✓ Cached' : ''}
          </p>
        </div>
        ` : ''}

        ${hasMonarchToken || hasMonarchUuid ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
          <p class="text-sm text-gray-600 mt-1">
            ${hasMonarchToken ? 'API Token: ✓ Stored<br/>' : ''}
            ${hasMonarchUuid ? 'Device UUID: ✓ Stored' : ''}
          </p>
        </div>
        ` : ''}

        ${hasExpectedState ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">OAuth Flow</p>
          <p class="text-sm text-gray-600 mt-1">
            CSRF Token: ✓ Stored
          </p>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Display local storage data
 */
function displayLocalStorageData() {
  const container = document.getElementById('localStorageSection');
  if (!container) return;

  const localData = getLocalStorage();

  // Track what types of data are in local storage without revealing sensitive details
  const hasMonarchEmail = !!localData.email;
  const hasMonarchPassword = !!localData.encryptedPassword;
  const hasMonarchToken = !!localData.token;
  const hasMonarchUuid = !!localData.uuid;
  const rememberMe = localData.remember === true;

  // Get app_state info
  const appStateRaw = localStorage.getItem('app_state');
  let lastPath = null;
  let lastPathTimestamp = null;
  if (appStateRaw) {
    try {
      const appState = JSON.parse(appStateRaw);
      lastPath = appState.lastPath;
      lastPathTimestamp = appState.timestamp;
    } catch (e) {
      // Ignore parse errors
    }
  }

  // Check if there's any data to show
  const hasCredentials = hasMonarchEmail || hasMonarchPassword || hasMonarchToken || hasMonarchUuid;
  const hasAnyData = hasCredentials || rememberMe || lastPath;

  if (!hasAnyData) {
    container.innerHTML = '<p class="text-gray-500 text-sm italic">No local storage data</p>';
    return;
  }

  const html = `
    <div class="space-y-3">
      <div class="p-3 bg-green-50 rounded-lg border border-green-200">
        <p class="text-sm text-green-800 font-medium">Persistent Data Overview</p>
        <p class="text-xs text-green-700 mt-1">Data in local storage persists across browser sessions</p>
      </div>

      <div class="space-y-2">
        ${hasCredentials ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Monarch Authentication</p>
          <p class="text-sm text-gray-600 mt-1">
            ${hasMonarchEmail ? 'Email Address: ✓ Stored<br/>' : ''}
            ${hasMonarchPassword ? 'Encrypted Password: ✓ Stored<br/>' : ''}
            ${hasMonarchToken ? 'API Token: ✓ Stored<br/>' : ''}
            ${hasMonarchUuid ? 'Device UUID: ✓ Stored' : ''}
          </p>
        </div>
        ` : ''}

        ${rememberMe ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">User Preferences</p>
          <p class="text-sm text-gray-600 mt-1">
            Remember Me: ✓ Enabled
          </p>
        </div>
        ` : ''}

        ${lastPath ? `
        <div class="p-3 bg-gray-50 rounded border border-gray-200">
          <p class="text-sm font-medium text-gray-900">Session Information</p>
          <p class="text-sm text-gray-600 mt-1">
            Last Page: ${escapeHtml(lastPath)}<br/>
            Last Visit: ${lastPathTimestamp ? new Date(lastPathTimestamp).toLocaleString() : 'Not available'}
          </p>
        </div>
        ` : ''}
      </div>
    </div>
  `;

  container.innerHTML = html;
}

/**
 * Recursively render a data object as HTML with collapsible sections
 * @param {*} data - The data to render
 * @param {string} prefix - Key prefix for unique IDs
 * @param {number} depth - Current nesting depth
 * @returns {string} HTML string
 */
function renderDataObject(data, prefix = '', depth = 0) {
  if (data === null || data === undefined) {
    return `<span class="text-gray-400 italic">null</span>`;
  }

  if (typeof data === 'boolean') {
    return `<span class="font-mono text-${data ? 'green' : 'red'}-600">${data}</span>`;
  }

  if (typeof data === 'number' || typeof data === 'string') {
    const displayValue = String(data).length > 100
      ? String(data).substring(0, 100) + '...'
      : String(data);
    return `<span class="font-mono text-gray-700">${escapeHtml(displayValue)}</span>`;
  }

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return `<span class="text-gray-400 italic">[ ] (empty array)</span>`;
    }

    const collapsibleId = `collapse_${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    return `
      <div class="ml-2">
        <button 
          class="collapsible-toggle text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium mb-1"
          onclick="toggleCollapse('${collapsibleId}')"
        >
          <svg class="collapse-icon w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
          Array (${data.length} items)
        </button>
        <div id="${collapsibleId}" class="collapsible-content hidden ml-4 space-y-2">
          ${data.map((item, index) => `
            <div class="border-l-2 border-gray-200 pl-3">
              <span class="text-gray-500 font-medium">[${index}]:</span>
              ${renderDataObject(item, `${prefix}_${index}`, depth + 1)}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (typeof data === 'object') {
    const entries = Object.entries(data);

    if (entries.length === 0) {
      return `<span class="text-gray-400 italic">{ } (empty object)</span>`;
    }

    const collapsibleId = `collapse_${prefix}_${Math.random().toString(36).substr(2, 9)}`;
    const hasNestedObjects = entries.some(([_, value]) => typeof value === 'object' && value !== null);

    // Only make collapsible if it has nested objects or is at root level
    if (hasNestedObjects || depth === 0) {
      return `
        <div class="${depth > 0 ? 'ml-2 mt-2' : ''}">
          <button 
            class="collapsible-toggle text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium mb-1"
            onclick="toggleCollapse('${collapsibleId}')"
          >
            <svg class="collapse-icon w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            Object (${entries.length} properties)
          </button>
          <div id="${collapsibleId}" class="collapsible-content hidden ml-4 space-y-2">
            ${entries.map(([key, value]) => {
        const isNested = typeof value === 'object' && value !== null;
        return `
                <div class="border-l-2 ${depth === 0 ? 'border-blue-300' : 'border-gray-200'} pl-3 py-1">
                  <div class="flex items-start">
                    <span class="font-semibold text-gray-700 mr-2">${escapeHtml(key)}:</span>
                    ${!isNested ? renderDataObject(value, `${prefix}_${key}`, depth + 1) : ''}
                  </div>
                  ${isNested ? renderDataObject(value, `${prefix}_${key}`, depth + 1) : ''}
                </div>
              `;
      }).join('')}
          </div>
        </div>
      `;
    }

    // Simple inline rendering for shallow objects
    return `
      <div class="space-y-2 ${depth > 0 ? 'ml-4 mt-1' : ''}">
        ${entries.map(([key, value]) => `
          <div class="border-l-2 border-gray-200 pl-3 py-1">
            <span class="font-semibold text-gray-700 mr-2">${escapeHtml(key)}:</span>
            ${renderDataObject(value, `${prefix}_${key}`, depth + 1)}
          </div>
        `).join('')}
      </div>
    `;
  }

  return `<span class="text-gray-400 italic">(unknown type)</span>`;
}

/**
 * Export all data as a JSON file
 */
function handleExportData() {
  const allData = {
    exportedAt: new Date().toISOString(),
    state: state,
    sessionStorage: {},
    localStorage: {}
  };

  // Collect session storage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    try {
      allData.sessionStorage[key] = JSON.parse(sessionStorage.getItem(key));
    } catch {
      allData.sessionStorage[key] = sessionStorage.getItem(key);
    }
  }

  // Collect local storage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      allData.localStorage[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      allData.localStorage[key] = localStorage.getItem(key);
    }
  }

  // Create and download JSON file
  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ynab-monarch-data-${Date.now()}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Clear all application data and redirect to home
 */
function handleClearAllData() {
  try {
    // Clear all storage
    clearStorage();
    clearAppState();

    // Clear all sessionStorage
    sessionStorage.clear();

    // Reset state object
    state.credentials = {
      email: '',
      encryptedPassword: '',
      otp: '',
      remember: false,
      apiToken: '',
      awaitingOtp: false,
      deviceUuid: ''
    };
    state.monarchAccounts = null;
    state.accounts = {};
    state.ynabOauth = { code: null, state: null, error: null };
  } catch (error) {
    console.error('Error clearing data:', error);
    alert('An error occurred while clearing data. Please try again.');
  }
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
