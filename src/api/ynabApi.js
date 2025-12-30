import { startYnabOauth, getExpectedState, clearExpectedState } from './ynabOauth.js';
import { exchangeYnabToken, ynabApiCall } from './ynabTokens.js';
import state from '../state.js';
import { parseYnabAccountApi } from '../services/ynabParser.js';

const YNAB_API_BASE_URL = 'https://api.ynab.com/v1';

export async function redirectToYnabOauth() {
  await startYnabOauth();
}

export async function getBudgets(includeAccounts = false) {
  const endpoint = includeAccounts 
    ? '/budgets?include_accounts=true' 
    : '/budgets';

  try {
    const data = await ynabApiCall(endpoint);
    return data.data.budgets;
  } catch (error) {
    console.error('YNAB API call failed:', error);
    return null;
  }
}

export async function getAccounts() {
  try {
    const data = await ynabApiCall('/budgets/default/accounts');
    const rawAccounts = data.data.accounts;
    const accounts = rawAccounts.filter(acc => !acc.deleted);
    return accounts;
  } catch (error) {
    console.error('YNAB API call failed:', error);
    return null;
  }
}

export async function getTransactions(accountId) {
  try {
    const data = await ynabApiCall(`/budgets/default/accounts/${accountId}/transactions`);
    const transactions = data.data.transactions;
    
    // Filter out deleted transactions
    return transactions.filter(txn => !txn.deleted);
  } catch (error) {
    console.error(`YNAB transactions API call failed for account ${accountId}:`, error);
    return [];
  }
}

export async function handleOauthCallback() {
  const queryParams = new URLSearchParams(window.location.search);
  const code = queryParams.get('code');
  const stateToken = queryParams.get('state');
  const storedState = getExpectedState();

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

  // Exchange code for tokens (stored as HttpOnly cookies)
  const success = await exchangeYnabToken(code);

  if (success) {
    // Fetch accounts using new token (from cookies)
    const accounts = await getAccounts();
    if (accounts && accounts.length > 0) {
      // Parse into standardized schema
      const parsedAccounts = parseYnabAccountApi(accounts);
      state.accounts.init(parsedAccounts);

      // Fetch transactions for each account
      for (const account of accounts) {
        const transactions = await getTransactions(account.id);
        
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
    console.error('Failed to exchange authorization code for tokens.');
    throw new Error('Failed to exchange authorization code for tokens.');
  }
}
