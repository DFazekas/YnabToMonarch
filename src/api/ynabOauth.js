const AUTHORIZE_BASE_URL = 'https://app.youneedabudget.com/oauth/authorize';
const CALLBACK_PATH = '/oauth/ynab/callback';
const EXPECTED_STATE_KEY = 'ynab_oauth_expected_state';

const ALERT_MESSAGE = 'Please provide your YNAB OAuth client ID via window.YNAB_OAUTH_CLIENT_ID before using the login button.';

function getRedirectUri() {
  return `${location.origin}${CALLBACK_PATH}`;
}

function getClientId() {
  return (window.YNAB_OAUTH_CLIENT_ID || '').trim();
}

function safeSessionStorage() {
  try {
    return window.sessionStorage;
  } catch (error) {
    console.warn('Session storage unavailable:', error);
    return null;
  }
}

function persistExpectedState(state) {
  const storage = safeSessionStorage();
  if (!storage) return;
  storage.setItem(EXPECTED_STATE_KEY, state);
}

function grabExpectedState() {
  const storage = safeSessionStorage();
  if (!storage) return null;
  return storage.getItem(EXPECTED_STATE_KEY);
}

function dropExpectedState() {
  const storage = safeSessionStorage();
  if (!storage) return;
  storage.removeItem(EXPECTED_STATE_KEY);
}

function buildState() {
  const cryptoSource = window.crypto || window.msCrypto;
  if (cryptoSource?.randomUUID) {
    return cryptoSource.randomUUID();
  }

  if (cryptoSource?.getRandomValues) {
    const array = new Uint8Array(16);
    cryptoSource.getRandomValues(array);
    return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
  }

  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

function buildAuthorizeUrl(stateValue) {
  const base = new URL(AUTHORIZE_BASE_URL);
  base.searchParams.set('client_id', getClientId());
  base.searchParams.set('response_type', 'code');
  base.searchParams.set('redirect_uri', getRedirectUri());
  base.searchParams.set('state', stateValue);
  return base.toString();
}

export function startYnabOauth() {
  const clientId = getClientId();
  if (!clientId) {
    window.alert(ALERT_MESSAGE);
    return null;
  }

  const state = buildState();
  persistExpectedState(state);

  const url = buildAuthorizeUrl(state);
  window.location.assign(url);
  return url;
}

export function getExpectedState() {
  return grabExpectedState();
}

export function clearExpectedState() {
  return dropExpectedState();
}
