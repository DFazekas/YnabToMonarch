import { openModal, closeModal } from '../../components/modal.js';
import { clearStorage, getLocalStorage } from '../../utils/storage.js';
import { clearAppState } from '../../router.js';
import state from '../../state.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initDataManagementView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
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

  // Attach event listeners
  const exportBtn = document.getElementById('exportDataBtn');
  const clearBtn = document.getElementById('clearAllDataBtn');
  const confirmClearBtn = document.getElementById('confirmClearBtn');
  const cancelClearBtn = document.getElementById('cancelClearBtn');

  exportBtn?.addEventListener('click', handleExportData);
  clearBtn?.addEventListener('click', () => openModal('confirmClearModal'));
  confirmClearBtn?.addEventListener('click', handleClearAllData);
  cancelClearBtn?.addEventListener('click', () => closeModal('confirmClearModal'));

  // Make toggle function globally available for inline onclick handlers
  window.toggleCollapse = toggleCollapse;
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

  const stateData = {
    credentials: {
      email: state.credentials.email || '(not set)',
      hasEncryptedPassword: !!state.credentials.encryptedPassword,
      hasApiToken: !!state.credentials.apiToken,
      hasDeviceUuid: !!state.credentials.deviceUuid,
      remember: state.credentials.remember,
      awaitingOtp: state.credentials.awaitingOtp
    },
    accounts: state.accounts,
    monarchAccounts: state.monarchAccounts,
    ynabOauth: state.ynabOauth
  };

  // Generate summary
  const accountCount = state.accounts ? Object.keys(state.accounts).length : 0;
  const monarchCount = state.monarchAccounts ? (Array.isArray(state.monarchAccounts) ? state.monarchAccounts.length : Object.keys(state.monarchAccounts).length) : 0;
  const summary = `${accountCount} YNAB accounts, ${monarchCount} Monarch accounts, ${state.credentials.email ? 'logged in' : 'not logged in'}`;

  const html = `
    <div class="mb-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
      <p class="text-sm text-blue-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(stateData, 'state')}
  `;
  container.innerHTML = html || '<p class="text-gray-500 text-sm italic">No application state data</p>';
}

/**
 * Display session storage data
 */
function displaySessionStorageData() {
  const container = document.getElementById('sessionStorageSection');
  if (!container) return;

  const sessionData = {};

  // Get all session storage items
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    try {
      const value = sessionStorage.getItem(key);
      // Try to parse as JSON
      sessionData[key] = JSON.parse(value);
    } catch {
      sessionData[key] = sessionStorage.getItem(key);
    }
  }

  const itemCount = sessionStorage.length;
  const summary = itemCount > 0 ? `${itemCount} item${itemCount !== 1 ? 's' : ''} stored` : 'No items stored';

  const html = itemCount > 0 ? `
    <div class="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
      <p class="text-sm text-purple-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(sessionData, 'session')}
  ` : '<p class="text-gray-500 text-sm italic">No session storage data</p>';

  container.innerHTML = html;
}

/**
 * Display local storage data
 */
function displayLocalStorageData() {
  const container = document.getElementById('localStorageSection');
  if (!container) return;

  const localData = getLocalStorage();

  // Also get app_state if it exists
  const appStateRaw = localStorage.getItem('app_state');
  if (appStateRaw) {
    try {
      localData.app_state = JSON.parse(appStateRaw);
    } catch {
      localData.app_state = appStateRaw;
    }
  }

  // Sanitize sensitive data
  const sanitizedData = {
    email: localData.email || '(not set)',
    hasEncryptedPassword: !!localData.encryptedPassword,
    hasToken: !!localData.token,
    hasUuid: !!localData.uuid,
    remember: localData.remember,
    tempForOtp: localData.tempForOtp,
    app_state: localData.app_state
  };

  const hasData = localData.email || localData.encryptedPassword || localData.token || localData.uuid;
  const summary = hasData
    ? `Credentials stored (${localData.email || 'no email'}), Remember: ${localData.remember ? 'Yes' : 'No'}`
    : 'No credentials stored';

  const html = hasData ? `
    <div class="mb-3 p-3 bg-green-50 rounded-lg border border-green-200">
      <p class="text-sm text-green-800 font-medium">Summary: ${summary}</p>
    </div>
    ${renderDataObject(sanitizedData, 'local')}
  ` : '<p class="text-gray-500 text-sm italic">No local storage data</p>';

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

    // Close modal
    closeModal('confirmClearModal');

    // Show success message (optional - you could add a toast notification)
    console.log('All data cleared successfully');
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
