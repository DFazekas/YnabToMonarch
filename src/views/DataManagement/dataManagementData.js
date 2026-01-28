import state from '../../state.js';
import { clearAppState } from '../../router.js';

const YNAB_AUTH_STATUS_ENDPOINT = '/.netlify/functions/ynabAuthStatus';
const DEFAULT_YNAB_AUTH_STATUS = Object.freeze({
  authenticated: false,
  hasAccessToken: false,
  hasRefreshToken: false
});

let ynabAuthStatusCache = null;
let ynabAuthStatusPromise = null;

async function fetchYnabAuthStatus() {
  if (ynabAuthStatusCache) {
    return ynabAuthStatusCache;
  }

  if (!ynabAuthStatusPromise) {
    ynabAuthStatusPromise = (async () => {
      try {
        const response = await fetch(YNAB_AUTH_STATUS_ENDPOINT, { headers: { 'Cache-Control': 'no-store' } });
        if (!response.ok) {
          throw new Error(`Status ${response.status}`);
        }
        const payload = await response.json();
        ynabAuthStatusCache = {
          authenticated: Boolean(payload.authenticated),
          hasAccessToken: Boolean(payload.hasAccessToken),
          hasRefreshToken: Boolean(payload.hasRefreshToken)
        };
      } catch (error) {
        console.warn('Unable to fetch YNAB auth status', error);
        ynabAuthStatusCache = DEFAULT_YNAB_AUTH_STATUS;
      } finally {
        ynabAuthStatusPromise = null;
      }

      return ynabAuthStatusCache;
    })();
  }

  return ynabAuthStatusPromise;
}

export async function getStateSummary() {
  const accountCount = state.hasAccounts() ? state.getAccountsSingleton().length() : 0;
  const ynabAuth = await fetchYnabAuthStatus();
  const hasMonarchAuth = !!state.credentials?.apiToken;
  const hasData = accountCount > 0 || ynabAuth.authenticated || hasMonarchAuth;
  return { accountCount, hasYnabAuth: ynabAuth.authenticated, hasMonarchAuth, hasData };
}

export async function getSessionStorageSummary() {
  const ynabAuth = await fetchYnabAuthStatus();
  const hasYnabAccounts = !!state.getPersistedAccounts();
  const hasMonarchAccounts = !!sessionStorage.getItem('monarch_accounts');
  const hasMonarchToken = !!sessionStorage.getItem('monarch_api_token');
  const hasMonarchUuid = !!sessionStorage.getItem('monarch_device_uuid');
  const hasExpectedState = !!sessionStorage.getItem('ynab_oauth_expected_state');

  const hasAnyData = hasYnabAccounts || hasMonarchAccounts || hasMonarchToken || hasMonarchUuid ||
    hasExpectedState || ynabAuth.hasAccessToken || ynabAuth.hasRefreshToken;

  return {
    ynabAuth,
    hasYnabAccounts,
    hasMonarchAccounts,
    hasMonarchToken,
    hasMonarchUuid,
    hasExpectedState,
    hasAnyData
  };
}

export function getLocalStorageSummary() {
  // Check sessionStorage for Monarch credentials (new storage strategy)
  const hasMonarchEmail = !!sessionStorage.getItem('monarch_email');
  const hasMonarchPassword = !!sessionStorage.getItem('monarch_pwd_enc');
  const hasMonarchToken = !!sessionStorage.getItem('monarch_token');
  const hasMonarchUuid = !!sessionStorage.getItem('monarch_uuid');
  const rememberMe = false; // No longer persisting across sessions

  const appState = state.loadAppState();
  let lastPath = null;
  let lastPathTimestamp = null;
  if (appState) {
    lastPath = appState.lastPath;
    lastPathTimestamp = appState.timestamp;
  }

  const hasCredentials = hasMonarchEmail || hasMonarchPassword || hasMonarchToken || hasMonarchUuid;
  const hasAnyData = hasCredentials || rememberMe || lastPath;

  return {
    hasMonarchEmail,
    hasMonarchPassword,
    hasMonarchToken,
    hasMonarchUuid,
    rememberMe,
    lastPath,
    lastPathTimestamp,
    hasCredentials,
    hasAnyData
  };
}

export function collectExportData(state) {
  const allData = {
    exportedAt: new Date().toISOString(),
    state: state,
    sessionStorage: {},
    localStorage: {}
  };

  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    try {
      allData.sessionStorage[key] = JSON.parse(sessionStorage.getItem(key));
    } catch {
      allData.sessionStorage[key] = sessionStorage.getItem(key);
    }
  }

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    try {
      allData.localStorage[key] = JSON.parse(localStorage.getItem(key));
    } catch {
      allData.localStorage[key] = localStorage.getItem(key);
    }
  }

  const jsonString = JSON.stringify(allData, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const filename = `ynab-monarch-data-${Date.now()}.json`;
  return { blob, filename };
}

export function clearAllData(state) {
  state.clearLocalStorage();
  clearAppState();
  sessionStorage.clear();

  state.credentials.clear();
  state.clearAccounts();
  state.oauth.clear();
}