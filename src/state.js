import Accounts from "./schemas/accounts.js"

class StorageManager {
  constructor() {
    this.monarchCredentials = {
      email: null,
      encryptedPassword: null,
      accessToken: null,
      uuid: null,
      otp: null,
    };
    this.history = [];
    this.userPreferences = {};
  }

  /**
   * Get value from localStorage
   * @param {string} key
   * @returns {string|null}
   */
  _lsGet(key) { return localStorage.getItem(key); }

  /**
   * Set value in localStorage
   * @param {string} key
   * @param {string} value
   */
  _lsSet(key, value) { localStorage.setItem(key, value); }

  /**
   * Remove value from localStorage
   * @param {string} key
   */
  _lsRemove(key) { localStorage.removeItem(key); }

  /**
   * Get value from sessionStorage
   * @param {string} key
   * @returns {string|null}
   */
  _ssGet(key) { return sessionStorage.getItem(key); }

  /**
   * Set value in sessionStorage
   * @param {string} key
   * @param {string} value
   */
  _ssSet(key, value) { sessionStorage.setItem(key, value); }

  /**
   * Remove value from sessionStorage
   * @param {string} key
   */
  _ssRemove(key) { sessionStorage.removeItem(key); }
}

const State = new StorageManager();
export default State;

/** TODOS
 * YNAB OAuth Tokens:
 *   - Managed via HttpOnly cookies only; never expose to sessionStorage/localStorage
 *   - Use /.netlify/functions/ynabAuthStatus to check auth state from the client
 * Financial data -> IndexedDB
 * - Edits -> IndexedDB + sessionStorage backup
 *   - Periodically persist to IndexedDB
 * - Statuses -> IndexedDB
 * MM Credentials:
 * - (email, password) -> sessionStorage ONLY
 * - Access Token -> sessionStorage
 * UI State -> localStorage
 */