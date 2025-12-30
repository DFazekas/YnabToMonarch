import state from '../../state.js';
import { clearAppState } from '../../router.js';

export function getStateSummary() {
  const accountCount = state.hasAccounts() ? state.getAccountsSingleton().length() : 0;
  const hasYnabAuth = !!sessionStorage.getItem('ynab_access_token');
  const hasMonarchAuth = !!state.credentials?.apiToken;
  const hasData = accountCount > 0 || hasYnabAuth || hasMonarchAuth;
  return { accountCount, hasYnabAuth, hasMonarchAuth, hasData };
}

export function getSessionStorageSummary() {
  const hasYnabToken = !!sessionStorage.getItem('ynab_access_token');
  const hasYnabRefresh = !!sessionStorage.getItem('ynab_refresh_token');
  const hasYnabExpiry = !!sessionStorage.getItem('ynab_token_expires_at');
  const hasYnabAccounts = !!state.getPersistedAccounts();
  const hasMonarchAccounts = !!sessionStorage.getItem('monarch_accounts');
  const hasMonarchToken = !!sessionStorage.getItem('monarch_api_token');
  const hasMonarchUuid = !!sessionStorage.getItem('monarch_device_uuid');
  const hasExpectedState = !!sessionStorage.getItem('ynab_oauth_expected_state');

  const hasAnyData = hasYnabToken || hasYnabRefresh || hasYnabExpiry || hasYnabAccounts ||
    hasMonarchAccounts || hasMonarchToken || hasMonarchUuid || hasExpectedState;

  return {
    hasYnabToken,
    hasYnabRefresh,
    hasYnabExpiry,
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
    localData,
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