const STORAGE_KEYS = {
  EMAIL: 'monarchEmail',
  ENCRYPTED_PASSWORD: 'monarchPasswordBase64',
  TOKEN: 'monarchApiToken',
  UUID: 'monarchDeviceUuid',
  REMEMBER: 'monarchRememberMe',
  ACCOUNTS: 'monarchAccounts',
  ACCOUNTS_TS: 'monarchAccountsTimestamp'
};

/**
 * Load all persisted credential values from localStorage.
 * This includes email, encrypted password, device UUID, token, and remember flag.
 * 
 * @returns {{
 *   email: string | null,
 *   encryptedPassword: string | null,
 *   token: string | null,
 *   uuid: string | null,
 *   remember: boolean
 * }}
 */
export function getLocalStorage() {
  return {
    email: get(STORAGE_KEYS.EMAIL),
    encryptedPassword: get(STORAGE_KEYS.ENCRYPTED_PASSWORD),
    token: get(STORAGE_KEYS.TOKEN),
    uuid: get(STORAGE_KEYS.UUID),
    remember: get(STORAGE_KEYS.REMEMBER) === 'true'
  };
}

/**
 * Persist one or more credential values to localStorage.
 * Any undefined values will be skipped.
 * 
 * @param {{
 *   email?: string,
 *   encryptedPassword?: string,
 *   token?: string,
 *   uuid?: string,
 *   remember?: boolean
 * }}
 */
export function saveToLocalStorage({ email, encryptedPassword, token, uuid, remember }) {
  if (email) set(STORAGE_KEYS.EMAIL, email);
  if (encryptedPassword) set(STORAGE_KEYS.ENCRYPTED_PASSWORD, encryptedPassword);
  if (token) set(STORAGE_KEYS.TOKEN, token);
  if (uuid) set(STORAGE_KEYS.UUID, uuid);
  if (typeof remember === 'boolean') set(STORAGE_KEYS.REMEMBER, remember ? 'true' : 'false');
}

/**
 * Remove all credential-related values from localStorage.
 */
export function clearStorage() {
  Object.values(STORAGE_KEYS).forEach(remove);
}

/**
 * Get cached accounts list from localStorage, returns parsed array or empty array.
 */
export function getCachedAccounts() {
  try {
    const json = localStorage.getItem(STORAGE_KEYS.ACCOUNTS);
    return json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
}

/**
 * Save accounts to localStorage with timestamp.
 */
export function saveAccountsToCache(accounts) {
  try {
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS, JSON.stringify(accounts));
    localStorage.setItem(STORAGE_KEYS.ACCOUNTS_TS, Date.now().toString());
  } catch {
    // ignore quota errors
  }
}

/**
 * Clear cached accounts and timestamp.
 */
export function clearAccountsCache() {
  localStorage.removeItem(STORAGE_KEYS.ACCOUNTS);
  localStorage.removeItem(STORAGE_KEYS.ACCOUNTS_TS);
}

function get(key) {
  return localStorage.getItem(key);
}

function set(key, value) {
  localStorage.setItem(key, value);
}

function remove(key) {
  localStorage.removeItem(key);
}
