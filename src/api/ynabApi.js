import { startYnabOauth, getExpectedState, clearExpectedState } from './ynabOauth.js';
import { exchangeYnabToken, ynabApiCall } from './ynabTokens.js';
import state from '../state.js';
import Account from '../schemas/account.js';
import Accounts from '../schemas/accounts.js';
import Transaction from '../schemas/transaction.js';


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

/** Fetch accounts from YNAB API and return as standardized Account objects.
 * @returns {Promise<Accounts>} Accounts instance.
 */
export async function getAccounts() {
  try {
    const response = await ynabApiCall('/budgets/default/accounts');
    if (response.error) {
      throw new Error(response.error.id, response.error.name, response.error.detail);
    }
    console.warn("getAccounts response:", response);

    const accountData = response.data.accounts;
    console.warn("getAccounts accountData:", accountData);
    const accountList = new Accounts();
    accountData.forEach(acc => {
      const account = new Account(acc['id']);
      account.initFromApiData(acc);
      accountList.add(account);
    });

    return accountList;
  } catch (error) {
    console.error('YNAB API call (getAccounts) failed:', error);
    throw new Error('Failed to fetch accounts from YNAB API');
  }
}

/** Fetch transactions for a specific account from YNAB API and return as standardized Transaction objects.
 * @param {string} accountId - The ID of the account.
 * @returns {Promise<Set<Transaction>>} Set of Transaction instances.
 */
export async function getTransactions(accountId) {
  try {
    const response = await ynabApiCall(`/budgets/default/accounts/${accountId}/transactions`);
    if (response.error) {
      throw new Error(response.error.id, response.error.name, response.error.detail);
    }

    const transactionsData = response.data.transactions;
    const transactionsList = new Set();

    transactionsData.forEach(txn => {
      const transaction = new Transaction(txn['id']);
      transaction.initFromApiData(txn);
      transactionsList.add(transaction);
    });

    return transactionsList;
  } catch (error) {
    console.error(`YNAB API call (getTransactions) failed for account ${accountId}:`, error);
    throw new Error('Failed to fetch transactions from YNAB API');
  }
}

export async function getAllTransactions(){
  try {
    const response = await ynabApiCall('/budgets/default/transactions');
    if (response.error) {
      throw new Error(response.error.id, response.error.name, response.error.detail);
    }

    const transactionsData = response.data.transactions;
    const transactionsList = new Set();

    transactionsData.forEach(txn => {
      const transaction = new Transaction(txn['id']);
      transaction.initFromApiData(txn);
      transactionsList.add(transaction);
    });

    return transactionsList;
  } catch(error) {
    console.error('YNAB API call (getAllTransactions) failed:', error);
    throw new Error('Failed to fetch all transactions from YNAB API');
  }
}

/** Queries YNAB API to fetch all accounts and their transactions.
 * @return {Promise<Accounts>} Accounts instance with transactions populated.
 */
export async function getAllData(){
  const accountList = await getAccounts();
  await Promise.all(
    accountList.accounts.map(async (account) => {
      const transactions = await getTransactions(account.id);
      console.log(`Fetched transactions for account '${account.id}':`, transactions);
      account.transactions = Array.from(transactions);
    })
  );
  return accountList;
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
  if (!success) {
    console.error('Failed to exchange authorization code for tokens.');
    throw new Error('Failed to exchange authorization code for tokens.');
  }

  console.table(state);
  return 'success';
}

const ynabApi = {
  redirectToYnabOauth,
  getBudgets,
  getAccounts,
  getTransactions,
  handleOauthCallback,
  getAllData
};
export default ynabApi;