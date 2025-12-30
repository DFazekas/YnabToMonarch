import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock dependencies
vi.mock('./ynabOauth.js', () => ({
  startYnabOauth: vi.fn(),
  getExpectedState: vi.fn(),
  clearExpectedState: vi.fn(),
}));

vi.mock('./ynabTokens.js', () => ({
  exchangeYnabToken: vi.fn(),
  ynabApiCall: vi.fn(),
}));

vi.mock('../state.js', () => ({
  default: {
    accounts: {
      init: vi.fn(),
    },
  },
}));

vi.mock('../services/ynabParser.js', () => ({
  parseYnabAccountApi: vi.fn((accounts) => accounts),
}));

import { redirectToYnabOauth, getBudgets, getAccounts, getTransactions, handleOauthCallback } from './ynabApi.js';
import { startYnabOauth, getExpectedState, clearExpectedState } from './ynabOauth.js';
import { exchangeYnabToken, ynabApiCall } from './ynabTokens.js';
import state from '../state.js';
import { parseYnabAccountApi } from '../services/ynabParser.js';

describe('ynabApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'table').mockImplementation(() => {});

    delete window.location;
    window.location = { search: '', origin: 'https://example.com' };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('redirectToYnabOauth', () => {
    it('should call startYnabOauth', async () => {
      startYnabOauth.mockResolvedValueOnce('https://ynab.com/oauth');

      await redirectToYnabOauth();

      expect(startYnabOauth).toHaveBeenCalled();
    });

    it('should handle errors from startYnabOauth', async () => {
      startYnabOauth.mockRejectedValueOnce(new Error('OAuth failed'));

      await expect(redirectToYnabOauth()).rejects.toThrow('OAuth failed');
    });
  });

  describe('getBudgets', () => {
    it('should fetch budgets without accounts', async () => {
      const mockBudgets = [
        { id: 'budget1', name: 'Budget 1' },
        { id: 'budget2', name: 'Budget 2' },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { budgets: mockBudgets } });

      const result = await getBudgets(false);

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets');
      expect(result).toEqual(mockBudgets);
    });

    it('should fetch budgets with accounts when requested', async () => {
      const mockBudgets = [
        { id: 'budget1', name: 'Budget 1', accounts: [] },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { budgets: mockBudgets } });

      const result = await getBudgets(true);

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets?include_accounts=true');
      expect(result).toEqual(mockBudgets);
    });

    it('should return null on API error', async () => {
      ynabApiCall.mockRejectedValueOnce(new Error('API error'));

      const result = await getBudgets();

      expect(result).toBeNull();
    });

    it('should default to not including accounts', async () => {
      ynabApiCall.mockResolvedValueOnce({ data: { budgets: [] } });

      await getBudgets();

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets');
    });
  });

  describe('getAccounts', () => {
    it('should fetch accounts from default budget', async () => {
      const mockAccounts = [
        { id: 'acc1', name: 'Checking', deleted: false },
        { id: 'acc2', name: 'Savings', deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: mockAccounts } });

      const result = await getAccounts();

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets/default/accounts');
      expect(result).toEqual(mockAccounts);
    });

    it('should filter out deleted accounts', async () => {
      const mockAccounts = [
        { id: 'acc1', name: 'Checking', deleted: false },
        { id: 'acc2', name: 'Old Account', deleted: true },
        { id: 'acc3', name: 'Savings', deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: mockAccounts } });

      const result = await getAccounts();

      expect(result).toHaveLength(2);
      expect(result.every(acc => !acc.deleted)).toBe(true);
    });

    it('should return null on API error', async () => {
      ynabApiCall.mockRejectedValueOnce(new Error('API error'));

      const result = await getAccounts();

      expect(result).toBeNull();
    });

    it('should handle empty accounts array', async () => {
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: [] } });

      const result = await getAccounts();

      expect(result).toEqual([]);
    });
  });

  describe('getTransactions', () => {
    it('should fetch transactions for specific account', async () => {
      const accountId = 'acc123';
      const mockTransactions = [
        { id: 'txn1', amount: 1000, deleted: false },
        { id: 'txn2', amount: 2000, deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      const result = await getTransactions(accountId);

      expect(ynabApiCall).toHaveBeenCalledWith(`/budgets/default/accounts/${accountId}/transactions`);
      expect(result).toEqual(mockTransactions);
    });

    it('should filter out deleted transactions', async () => {
      const mockTransactions = [
        { id: 'txn1', amount: 1000, deleted: false },
        { id: 'txn2', amount: 2000, deleted: true },
        { id: 'txn3', amount: 3000, deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      const result = await getTransactions('acc123');

      expect(result).toHaveLength(2);
      expect(result.every(txn => !txn.deleted)).toBe(true);
    });

    it('should return empty array on API error', async () => {
      ynabApiCall.mockRejectedValueOnce(new Error('API error'));

      const result = await getTransactions('acc123');

      expect(result).toEqual([]);
    });

    it('should handle empty transactions array', async () => {
      ynabApiCall.mockResolvedValueOnce({ data: { transactions: [] } });

      const result = await getTransactions('acc123');

      expect(result).toEqual([]);
    });
  });

  describe('handleOauthCallback', () => {
    beforeEach(() => {
      window.location.search = '?code=auth_code_123&state=state_token_456';
    });

    it('should validate CSRF token', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');

      exchangeYnabToken.mockResolvedValueOnce(true);
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: [] } });
      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      await handleOauthCallback();

      expect(getExpectedState).toHaveBeenCalled();
      expect(clearExpectedState).toHaveBeenCalled();
    });

    it('should throw error on CSRF token mismatch', async () => {
      getExpectedState.mockReturnValueOnce('wrong_state');

      await expect(handleOauthCallback()).rejects.toThrow('Invalid CSRF token on OAuth callback.');
      expect(clearExpectedState).toHaveBeenCalled();
    });

    it('should throw error when state is missing', async () => {
      window.location.search = '?code=auth_code_123';
      getExpectedState.mockReturnValueOnce('expected_state');

      await expect(handleOauthCallback()).rejects.toThrow('Invalid CSRF token on OAuth callback.');
    });

    it('should throw error when code is missing', async () => {
      window.location.search = '?state=state_token_456';
      getExpectedState.mockReturnValueOnce('state_token_456');

      await expect(handleOauthCallback()).rejects.toThrow('OAuth callback did not contain an authorization code.');
    });

    it('should exchange code for tokens', async () => {
      const code = 'auth_code_123';
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: [] } });
      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      await handleOauthCallback();

      expect(exchangeYnabToken).toHaveBeenCalledWith(code);
    });

    it('should fetch accounts after token exchange', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [
        { id: 'acc1', name: 'Checking', deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: mockAccounts } });

      const result = await handleOauthCallback();

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets/default/accounts');
      expect(result).toBe('success');
    });

    it('should parse and initialize accounts in state', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [
        { id: 'acc1', name: 'Checking', deleted: false },
      ];
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: mockAccounts } });
      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      await handleOauthCallback();

      expect(parseYnabAccountApi).toHaveBeenCalledWith(mockAccounts);
      expect(state.accounts.init).toHaveBeenCalledWith(mockAccounts);
    });

    it('should fetch transactions for each account', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [
        { id: 'acc1', name: 'Checking', deleted: false },
        { id: 'acc2', name: 'Savings', deleted: false },
      ];

      // First call for accounts, then one call per account for transactions
      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: [] } })
        .mockResolvedValueOnce({ data: { transactions: [] } });

      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      await handleOauthCallback();

      expect(ynabApiCall).toHaveBeenCalledWith('/budgets/default/accounts/acc1/transactions');
      expect(ynabApiCall).toHaveBeenCalledWith('/budgets/default/accounts/acc2/transactions');
    });

    it('should transform YNAB transactions to schema format', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      const mockTransactions = [
        {
          id: 'txn1',
          date: '2024-01-15',
          amount: 50000, // YNAB uses milliunits
          payee_name: 'Store',
          category_name: 'Groceries',
          category_group_name: 'Food',
          memo: 'Weekly shopping',
          flag_name: 'red',
          deleted: false,
        },
      ];

      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      // Mock state.accounts to have the account structure
      state.accounts.acc1 = {};

      await handleOauthCallback();

      expect(state.accounts.acc1.transactions).toEqual([
        {
          Date: '2024-01-15',
          Merchant: 'Store',
          Category: 'Groceries',
          CategoryGroup: 'Food',
          Notes: 'Weekly shopping',
          Amount: '50.00',
          Tags: 'red',
        },
      ]);
      expect(state.accounts.acc1.transactionCount).toBe(1);
    });

    it('should handle transactions with missing fields', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      const mockTransactions = [
        {
          id: 'txn1',
          date: '2024-01-15',
          amount: 1000,
          deleted: false,
        },
      ];

      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);
      state.accounts.acc1 = {};

      await handleOauthCallback();

      expect(state.accounts.acc1.transactions[0]).toEqual({
        Date: '2024-01-15',
        Merchant: '',
        Category: '',
        CategoryGroup: '',
        Notes: '',
        Amount: '1.00',
        Tags: '',
      });
    });

    it('should throw error when token exchange fails', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(false);

      await expect(handleOauthCallback()).rejects.toThrow('Failed to exchange authorization code for tokens.');
    });

    it('should throw error when no accounts retrieved', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      ynabApiCall.mockResolvedValueOnce({ data: { accounts: [] } });

      await expect(handleOauthCallback()).rejects.toThrow('No accounts retrieved from YNAB API.');
    });

    it('should throw error when accounts API call returns null', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      ynabApiCall.mockResolvedValueOnce(null);

      await expect(handleOauthCallback()).rejects.toThrow('No accounts retrieved from YNAB API.');
    });

    it('should convert negative YNAB amounts correctly', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      const mockTransactions = [
        { id: 'txn1', date: '2024-01-15', amount: -25500, deleted: false },
      ];

      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: mockTransactions } });

      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);
      state.accounts.acc1 = {};

      await handleOauthCallback();

      expect(state.accounts.acc1.transactions[0].Amount).toBe('-25.50');
    });

    it('should return success after complete flow', async () => {
      getExpectedState.mockReturnValueOnce('state_token_456');
      exchangeYnabToken.mockResolvedValueOnce(true);
      
      const mockAccounts = [{ id: 'acc1', name: 'Checking', deleted: false }];
      ynabApiCall
        .mockResolvedValueOnce({ data: { accounts: mockAccounts } })
        .mockResolvedValueOnce({ data: { transactions: [] } });

      parseYnabAccountApi.mockReturnValueOnce(mockAccounts);

      const result = await handleOauthCallback();

      expect(result).toBe('success');
    });
  });
});
