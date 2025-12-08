import { startYnabOauth, getExpectedState, clearExpectedState } from './ynabOauth.js';
import state from '../state.js';
import { parseYnabAccountApi } from '../services/ynabParser.js';

const YNAB_API_BASE_URL = 'https://api.ynab.com/v1';

export async function redirectToYnabOauth() {
  await startYnabOauth();
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
    return null;
  }
}

export async function getAccounts(accessToken) {
  const url = new URL(`${YNAB_API_BASE_URL}/budgets/default/accounts`);

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
    const rawAccounts = data.data.accounts;
    const accounts = rawAccounts.filter(acc => !acc.deleted);
    return accounts;
  } catch (error) {
    console.error('YNAB API call failed:', error);
    return null;
  }
}

export async function getTransactions(accessToken, accountId) {
  const url = new URL(`${YNAB_API_BASE_URL}/budgets/default/accounts/${accountId}/transactions`);

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error(`Error fetching YNAB transactions for account ${accountId}:`, errorData);
      throw new Error(`Failed to fetch YNAB transactions. Status: ${response.status}`);
    }

    const data = await response.json();
    const transactions = data.data.transactions;
    
    // Filter out split transactions and transfer transactions that we don't want to duplicate
    return transactions.filter(txn => {
      // Exclude deleted transactions
      if (txn.deleted) return false;
      // Include all other transactions
      return true;
    });
  } catch (error) {
    console.error(`YNAB transactions API call failed for account ${accountId}:`, error);
    return [];
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

export async function refreshAccessToken(refreshToken) {
  try {
    const response = await fetch('/.netlify/functions/ynabTokenExchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('YNAB token refresh failed:', data);
      throw new Error('Failed to refresh access token.');
    }

    // Update sessionStorage with new tokens
    sessionStorage.setItem('ynab_access_token', data.access_token);
    if (data.refresh_token) {
      sessionStorage.setItem('ynab_refresh_token', data.refresh_token);
    }
    sessionStorage.setItem('ynab_token_expires_at', Date.now() + data.expires_in * 1000);

    return data;
  } catch (error) {
    console.error('Error during token refresh:', error);
    return null;
  }
}

export async function handleOauthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');
  const stateToken = queryParams.get('state');
  const storedState = getExpectedState();

  console.log('OAuth callback params:', { code, stateToken, storedState, fullUrl: window.location.href });

  if (!stateToken || stateToken !== storedState) {
    console.error('Invalid CSRF token on OAuth callback.', { stateToken, storedState });
    clearExpectedState();
    throw new Error('Invalid CSRF token on OAuth callback.');
  }

  clearExpectedState();

  if (!code) {
    console.error('OAuth callback did not contain an authorization code.');
    throw new Error('OAuth callback did not contain an authorization code.');
  }

  const tokenData = await exchangeCodeForToken(code);

  if (tokenData && tokenData.access_token) {
    state.ynab_access_token = tokenData.access_token;
    sessionStorage.setItem('ynab_access_token', tokenData.access_token);
    sessionStorage.setItem('ynab_refresh_token', tokenData.refresh_token);
    sessionStorage.setItem('ynab_token_expires_at', Date.now() + tokenData.expires_in * 1000);

    const accounts = await getAccounts(tokenData.access_token);
    if (accounts && accounts.length > 0) {
      // Filter out deleted accounts and parse into standardized schema
      const activeAccounts = accounts.filter(acc => !acc.deleted);
      state.accounts = parseYnabAccountApi(activeAccounts);

      // Fetch transactions for each account
      console.log('Fetching transactions for', activeAccounts.length, 'accounts...');
      for (const account of activeAccounts) {
        const transactions = await getTransactions(tokenData.access_token, account.id);
        
        if (transactions && transactions.length > 0) {
          // Transform YNAB transactions to match schema
          const transformedTransactions = transactions.map(txn => {
            // Convert YNAB date format (YYYY-MM-DD) - keep as is
            const date = txn.date;
            
            // Parse amount: YNAB stores in milliunits (1000 = $1.00)
            const amountDollars = (txn.amount / 1000).toFixed(2);
            
            return {
              Date: date,
              Merchant: txn.payee_name || '',
              Category: txn.category_name || '',
              CategoryGroup: txn.category_group_name || '',
              Notes: txn.memo || '',
              Amount: amountDollars,
              Tags: txn.flag_name || ''
            };
          });

          // Update account with transactions
          if (state.accounts[account.id]) {
            state.accounts[account.id].transactions = transformedTransactions;
            state.accounts[account.id].transactionCount = transformedTransactions.length;
            console.log(`Account ${account.name}: ${transformedTransactions.length} transactions loaded`);
          }
        }
      }

      console.table(state.accounts);
      return 'success';
    } else {
      console.warn('No accounts retrieved from YNAB API.');
      throw new Error('No accounts retrieved from YNAB API.');
    }
  } else {
    console.error('Failed to get access token from YNAB.');
    throw new Error('Failed to get access token from YNAB.');
  }
}
