/**
 * YNAB Token Management (Client-Side)
 * 
 * Handles OAuth token exchange and automatic token refresh for YNAB API calls.
 * Tokens are stored as HttpOnly cookies (set by backend) for security.
 * 
 * Usage:
 *   import { exchangeYnabToken, ynabApiCall } from './api/ynabTokens.js';
 * 
 *   // After OAuth callback with authorization code:
 *   await exchangeYnabToken(code);
 * 
 *   // Make API calls (auto-refreshes on 401):
 *   const budgets = await ynabApiCall('/budgets');
 */

import { getLogger, setLoggerConfig } from '../utils/logger.js';

const YNAB_API_BASE_URL = 'https://api.ynab.com/v1';

let isRefreshing = false;
let refreshPromise = null;

const logger = getLogger('YnabTokens');
setLoggerConfig({
  namespaces: { 'YnabTokens': false }
});

/**
 * Exchange authorization code for access/refresh tokens
 * Called once after OAuth callback
 * 
 * @param {string} code - Authorization code from YNAB OAuth callback
 * @returns {Promise<boolean>} Success status
 */
export async function exchangeYnabToken(code) {
  const methodName = "exchangeYnabToken";
  logger.group(methodName);
  try {
    const response = await fetch('/.netlify/functions/ynabTokenExchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies in request
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      logger.error(methodName, 'Token exchange failed:', error);
      logger.groupEnd(methodName);
      return false;
    }

    const data = await response.json();
    logger.log(methodName, '✅ YNAB tokens stored in HttpOnly cookies');
    return data.success;
  } catch (error) {
    logger.error(methodName, 'Token exchange error:', error);
    return false;
  } finally {
    logger.groupEnd(methodName);
  }
}

/**
 * Refresh expired access token using refresh token from HttpOnly cookie
 * Called automatically when API returns 401
 * 
 * @returns {Promise<boolean>} Success status
 */
async function refreshYnabToken() {
  const methodName = "refreshYnabToken";
  logger.group(methodName);

  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing) {
    logger.debug(methodName, 'Refresh already in progress, waiting for result...');
    logger.groupEnd(methodName);
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch('/.netlify/functions/ynabTokenRefresh', {
        method: 'POST',
        credentials: 'include' // Send HttpOnly cookies
      });

      if (!response.ok) {
        logger.error(methodName, 'Token refresh failed - redirecting to login');
        isRefreshing = false;
        logger.groupEnd(methodName);
        window.location.href = '/'; // Redirect to home/login page
        return false;
      }

      const data = await response.json();
      logger.log(methodName, '✅ YNAB tokens refreshed');
      logger.groupEnd(methodName);
      return data.success;
    } catch (error) {
      logger.error(methodName, 'Token refresh error:', error);
      isRefreshing = false;
      window.location.href = '/';
      logger.groupEnd(methodName);
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  logger.groupEnd(methodName);
  return refreshPromise;
}

/**
 * Make authenticated API call to YNAB
 * Automatically refreshes token on 401 and retries
 * 
 * Note: Access token is extracted from HttpOnly cookie on the backend.
 * For direct YNAB API calls from frontend, we need a proxy endpoint.
 * 
 * @param {string} endpoint - API endpoint (e.g., '/budgets' or '/budgets/default/accounts')
 * @param {Object} options - Fetch options (method, headers, body, etc.)
 * @returns {Promise<any>} Response data or null on error
 */
export async function ynabApiCall(endpoint, options = {}) {
  const methodName = "ynabApiCall";
  logger.group(methodName, `Endpoint: ${endpoint}`);

  try {
    // Use a Netlify function proxy to add the Authorization header from HttpOnly cookie
    const url = `/.netlify/functions/ynabProxy?endpoint=${encodeURIComponent(endpoint)}`;

    let response = await fetch(url, {
      ...options,
      credentials: 'include', // Include HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    // Token expired or missing - attempt refresh only if we have a refresh token
    if (response.status === 401) {
      const errorData = await response.json();

      // If error message indicates no token (not expired), don't attempt refresh
      if (errorData.error && errorData.error.includes('No access token found')) {
        logger.warn(methodName, 'No YNAB tokens found - user needs to authenticate');
        logger.groupEnd(methodName);
        return null;
      }

      logger.log(methodName, 'Access token expired, refreshing...');
      const refreshed = await refreshYnabToken();

      if (!refreshed) {
        logger.error(methodName, 'Token refresh failed');
        logger.groupEnd(methodName);
        return null;
      }

      // Retry original request with new token
      response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
    }

    if (!response.ok) {
      const errorData = await response.json();
      logger.error(methodName, `YNAB API error (${endpoint}):`, errorData);
      logger.groupEnd(methodName);
      throw new Error(`YNAB API request failed: ${response.status}`);
    }

    const data = await response.json();
    logger.log(methodName, 'Response received');
    logger.groupEnd(methodName);
    return data;
  } finally {
    logger.groupEnd(methodName);
  }
}

/**
 * Check if user has valid YNAB tokens (by testing an API call)
 * Automatically refreshes expired tokens and retries
 * 
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isYnabAuthenticated() {
  const methodName = "isYnabAuthenticated";
  logger.group(methodName);
  try {
    const result = await ynabApiCall('/user');
    const authenticated = result !== null;
    if (authenticated) {
      logger.log(methodName, 'YNAB authenticated');
    } else {
      logger.warn(methodName, 'YNAB not authenticated');
    }
    logger.groupEnd(methodName);
    return authenticated;
  } catch (error) {
    logger.warn(methodName, 'YNAB authentication check failed:', error.message);
    logger.groupEnd(methodName);
    return false;
  }
}

/**
 * Logout by clearing YNAB tokens
 * Redirects to home page
 */
export async function logoutYnab() {
  const methodName = "logoutYnab";
  logger.group(methodName);

  // Clear cookies by setting expired cookies
  document.cookie = 'ynab_access_token=; Max-Age=0; Path=/;';
  document.cookie = 'ynab_refresh_token=; Max-Age=0; Path=/;';

  logger.log(methodName, 'Logged out from YNAB');
  logger.groupEnd(methodName);
  window.location.href = '/';
}
