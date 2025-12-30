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

const YNAB_API_BASE_URL = 'https://api.ynab.com/v1';

let isRefreshing = false;
let refreshPromise = null;

/**
 * Exchange authorization code for access/refresh tokens
 * Called once after OAuth callback
 * 
 * @param {string} code - Authorization code from YNAB OAuth callback
 * @returns {Promise<boolean>} Success status
 */
export async function exchangeYnabToken(code) {
  console.group("exchangeYnabToken");
  try {
    const response = await fetch('/.netlify/functions/ynabTokenExchange', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // Include cookies in request
      body: JSON.stringify({ code })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Token exchange failed:', error);
      console.groupEnd();
      return false;
    }

    const data = await response.json();
    console.log('✅ YNAB tokens stored in HttpOnly cookies');
    return data.success;
  } catch (error) {
    console.error('Token exchange error:', error);
    return false;
  } finally {
    console.groupEnd();
  }
}

/**
 * Refresh expired access token using refresh token from HttpOnly cookie
 * Called automatically when API returns 401
 * 
 * @returns {Promise<boolean>} Success status
 */
async function refreshYnabToken() {
  console.group("refreshYnabToken");

  // Prevent multiple simultaneous refresh attempts
  if (isRefreshing) {
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
        console.error('Token refresh failed - redirecting to login');
        isRefreshing = false;
        // Redirect to home/login page
        console.groupEnd();
        window.location.href = '/';
        return false;
      }

      const data = await response.json();
      console.log('✅ YNAB tokens refreshed');
      console.groupEnd();
      return data.success;
    } catch (error) {
      console.error('Token refresh error:', error);
      isRefreshing = false;
      window.location.href = '/';
      console.groupEnd();
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

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
  console.group(`ynabApiCall: ${endpoint}`);

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
        console.warn('No YNAB tokens found - user needs to authenticate');
        return null;
      }

      console.log('Access token expired, refreshing...');
      const refreshed = await refreshYnabToken();

      if (!refreshed) {
        console.error('Token refresh failed');
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
      console.error(`YNAB API error (${endpoint}):`, errorData);
      throw new Error(`YNAB API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Response received');
    return data;
  } finally {
    console.groupEnd(`ynabApiCall: ${endpoint}`);
  }
}

/**
 * Check if user has valid YNAB tokens (by testing an API call)
 * Automatically refreshes expired tokens and retries
 * 
 * @returns {Promise<boolean>} True if authenticated
 */
export async function isYnabAuthenticated() {
  console.group("isYnabAuthenticated");
  try {
    const result = await ynabApiCall('/user');
    const authenticated = result !== null;
    if (authenticated) {
      console.log('✅ YNAB authenticated');
    } else {
      console.warn('❌ YNAB not authenticated');
    }
    console.groupEnd("isYnabAuthenticated");
    return authenticated;
  } catch (error) {
    console.warn('❌ YNAB authentication check failed:', error.message);
    console.groupEnd("isYnabAuthenticated");
    return false;
  }
}

/**
 * Logout by clearing YNAB tokens
 * Redirects to home page
 */
export async function logoutYnab() {
  console.group("logoutYnab");

  // Clear cookies by setting expired cookies
  document.cookie = 'ynab_access_token=; Max-Age=0; Path=/;';
  document.cookie = 'ynab_refresh_token=; Max-Age=0; Path=/;';

  console.log('✅ Logged out from YNAB');
  console.groupEnd("logoutYnab");
  window.location.href = '/';
}
