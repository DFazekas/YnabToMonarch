const STORAGE_KEYS = {
  EMAIL: 'monarchEmail',
  ENCRYPTED_PASSWORD: 'monarchPasswordBase64',
  TOKEN: 'monarchApiToken',
  UUID: 'monarchDeviceUuid',
  REMEMBER: 'monarchRememberMe',
  TEMP_FOR_OTP: 'monarchTempForOtp'
};

/**
 * Load all persisted credential values from localStorage.
 * This includes email, encrypted password, device UUID, token, remember flag, and temp flag.
 * 
 * @returns {{
 *   email: string | null,
 *   encryptedPassword: string | null,
 *   token: string | null,
 *   uuid: string | null,
 *   remember: boolean,
 *   tempForOtp: boolean
 * }}
 */
export function getLocalStorage() {
  return {
    email: get(STORAGE_KEYS.EMAIL),
    encryptedPassword: get(STORAGE_KEYS.ENCRYPTED_PASSWORD),
    token: get(STORAGE_KEYS.TOKEN),
    uuid: get(STORAGE_KEYS.UUID),
    remember: get(STORAGE_KEYS.REMEMBER) === 'true',
    tempForOtp: get(STORAGE_KEYS.TEMP_FOR_OTP) === 'true'
  };
}

/**
 * Persist one or more credential values to localStorage.
 * 
 * @param {{
 *   email?: string,
 *   encryptedPassword?: string,
 *   token?: string,
 *   uuid?: string,
 *   remember?: boolean,
 *   tempForOtp?: boolean
 * }}
 */
export function saveToLocalStorage({ email, encryptedPassword, token, uuid, remember, tempForOtp }) {
  if (email) set(STORAGE_KEYS.EMAIL, email);
  if (encryptedPassword) set(STORAGE_KEYS.ENCRYPTED_PASSWORD, encryptedPassword);
  if (token) set(STORAGE_KEYS.TOKEN, token);
  if (uuid) set(STORAGE_KEYS.UUID, uuid);
  if (typeof remember === 'boolean') set(STORAGE_KEYS.REMEMBER, remember ? 'true' : 'false');
  if (typeof tempForOtp === 'boolean') set(STORAGE_KEYS.TEMP_FOR_OTP, tempForOtp ? 'true' : 'false');
}

/**
 * Remove all credential-related values from localStorage.
 */
export function clearStorage() {
  Object.values(STORAGE_KEYS).forEach(remove);
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
