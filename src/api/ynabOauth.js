const AUTHORIZE_BASE_URL = 'https://app.ynab.com/oauth/authorize';
const CALLBACK_PATH = '/oauth/ynab/callback';
const EXPECTED_STATE_KEY = 'ynab_oauth_expected_state';

const ALERT_MESSAGE = 'Could not retrieve YNAB OAuth client ID. Please try again.';

let cachedClientId = null;

function getRedirectUri() {
  return `${location.origin}${CALLBACK_PATH}`;
}

async function getClientId() {
  // Return cached value if available
  if (cachedClientId) {
    return cachedClientId;
  }

  try {
    const response = await fetch('/.netlify/functions/config');
    if (!response.ok) {
      throw new Error('Failed to fetch config');
    }
    const config = await response.json();
    cachedClientId = config.ynabClientId;
    return cachedClientId;
  } catch (error) {
    console.error('Error fetching YNAB client ID:', error);
    return null;
  }
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

function buildAuthorizeUrl(clientId, stateValue) {
  const base = new URL(AUTHORIZE_BASE_URL);
  base.searchParams.set('client_id', clientId);
  base.searchParams.set('response_type', 'code');
  base.searchParams.set('redirect_uri', getRedirectUri());
  base.searchParams.set('state', stateValue);
  return base.toString();
}

export async function startYnabOauth() {
  const clientId = await getClientId();
  if (!clientId) {
    window.alert(ALERT_MESSAGE);
    return null;
  }

  const state = buildState();
  persistExpectedState(state);

  const url = buildAuthorizeUrl(clientId, state);
  window.location.assign(url);
  return url;
}

export function getExpectedState() {
  return grabExpectedState();
}

export function clearExpectedState() {
  return dropExpectedState();
}
