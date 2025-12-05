import { getConfig } from './config.js';
import { navigate } from '../router.js';
import state from '../state.js';

const YNAB_API_BASE_URL = 'https://api.ynab.com/v1';

function generateCsrfToken() {
  const randomBytes = new Uint8Array(32);
  window.crypto.getRandomValues(randomBytes);
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function redirectToYnabOauth() {
  const { ynabClientId, ynabRedirectUri } = await getConfig();
  console.log('Redirecting to YNAB OAuth with Client ID:', ynabClientId);
  console.log('Redirect URI:', ynabRedirectUri);
  const csrfToken = generateCsrfToken();
  sessionStorage.setItem('ynab_csrf_token', csrfToken);

  const authUrl = new URL('https://app.ynab.com/oauth/authorize');
  authUrl.searchParams.append('client_id', ynabClientId);
  authUrl.searchParams.append('redirect_uri', ynabRedirectUri);
  authUrl.searchParams.append('response_type', 'code');
  authUrl.searchParams.append('scope', 'read-only');
  authUrl.searchParams.append('state', csrfToken);

  window.location.href = authUrl.toString();
}

export async function getBudgets(accessToken, includeAccounts = false) {
  const url = new URL(`${YNAB_API_BASE_URL}/budgets`);
  if (includeAccounts) {
    url.searchParams.append('include_accounts', 'true');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching YNAB budgets:', errorData);
      throw new Error(`Failed to fetch YNAB budgets. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.budgets;
  } catch (error) {
    console.error('YNAB API call failed:', error);
    navigate('/upload');
    return null;
  }
}

export async function getAccounts(accessToken, budgetId) {
  const url = new URL(`${YNAB_API_BASE_URL}/${budgetId}/accounts`);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error fetching YNAB accounts:', errorData);
      throw new Error(`Failed to fetch YNAB accounts. Status: ${response.status}`);
    }

    const data = await response.json();
    return data.data.accounts;
  } catch (error) {
    console.error('YNAB API call failed:', error);
    navigate('/upload');
    return null;
  }
}

async function exchangeCodeForToken(code) {
  try {
    const response = await fetch('/.netlify/functions/ynabTokenExchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        code: code,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('YNAB token exchange failed:', data);
      throw new Error('Failed to exchange authorization code for a token.');
    }

    return data;
  } catch (error) {
    console.error('Error during token exchange:', error);
    return null;
  }
}

export async function handleOauthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');
  const stateToken = queryParams.get('state');
  const storedState = sessionStorage.getItem('ynab_csrf_token');

  sessionStorage.removeItem('ynab_csrf_token');

  if (!stateToken || stateToken !== storedState) {
    console.error('Invalid CSRF token on OAuth callback.');
    alert('Security error. Please try connecting to YNAB again.');
    navigate('/upload', true);
    return;
  }

  if (!code) {
    console.error('OAuth callback did not contain an authorization code.');
    alert('Could not authenticate with YNAB. Please try again.');
    navigate('/upload', true);
    return;
  }

  const tokenData = await exchangeCodeForToken(code);

  if (tokenData && tokenData.access_token) {
    state.ynab_access_token = tokenData.access_token;
    sessionStorage.setItem('ynab_access_token', tokenData.access_token);
    sessionStorage.setItem('ynab_refresh_token', tokenData.refresh_token);
    sessionStorage.setItem('ynab_token_expires_at', Date.now() + tokenData.expires_in * 1000);

    const accounts = await getAccounts(tokenData.access_token);
    if (accounts && accounts.length > 0) {
      state.accounts = accounts.reduce((acc, account) => {
        if (!account.deleted) {
          acc[account.id] = {
            ...account,
            selected: true,
            transactions: [],
          };
        }   
        return acc;
      }, {});

      console.table(state.accounts);

      navigate('/review');
    } else {
      alert('No budgets found in your YNAB account.');
      navigate('/upload');
    }
  } else {
    alert('Failed to get access token from YNAB. Please try again.');
    navigate('/upload', true);
  }
}
