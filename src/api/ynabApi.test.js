import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Accounts from '../schemas/accounts.js';
import Transaction from '../schemas/transaction.js';

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
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'warn').mockImplementation(() => { });
    vi.spyOn(console, 'table').mockImplementation(() => { });

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
    const buildAccount = (overrides = {}) => ({
      id: overrides.id || 'acc1',
      name: overrides.name || 'Checking',
      on_budget: true,
      note: '',
      balance: 0,
      cleared_balance: 0,
      uncleared_balance: 0,
      transfer_payee_id: null,
      direct_import_linked: false,
      direct_import_in_error: false,
      last_reconciled_at: null,
      debt_original_balance: null,
      debt_interest_rates: null,
      debt_minimum_payments: null,
      debt_escrow_amounts: null,
    });

    // Additional tests would go here...
  });
});
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Accounts from '../schemas/accounts.js';
import Transaction from '../schemas/transaction.js';

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
    vi.spyOn(console, 'error').mockImplementation(() => { });
    vi.spyOn(console, 'warn').mockImplementation(() => { });
    vi.spyOn(console, 'table').mockImplementation(() => { });

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
});
