import { describe, it, expect, beforeEach, vi } from 'vitest';

let Accounts;
let Account;
let Transaction;

describe('FinancialDataDB', () => {
  let mockIDBDatabase;
  let mockTransaction;
  let mockObjectStore;
  let mockIndex;
  let mockOpenRequest;

  beforeEach(async () => {
    vi.resetModules();
    mockIndex = {
      getAll: vi.fn()
    };

    mockObjectStore = {
      put: vi.fn(),
      get: vi.fn(),
      getAll: vi.fn(),
      clear: vi.fn(),
      count: vi.fn(),
      openCursor: vi.fn(),
      index: vi.fn(() => mockIndex),
      indexNames: { contains: vi.fn(() => false) },
      createIndex: vi.fn()
    };

    mockTransaction = {
      objectStore: vi.fn(() => mockObjectStore),
      oncomplete: null,
      onerror: null
    };

    mockIDBDatabase = {
      transaction: vi.fn(() => mockTransaction),
      objectStoreNames: { contains: vi.fn(() => false) },
      createObjectStore: vi.fn(() => mockObjectStore),
      close: vi.fn()
    };

    mockOpenRequest = {
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
      result: mockIDBDatabase
    };

    global.indexedDB = {
      open: vi.fn(() => mockOpenRequest)
    };

    ({ default: Accounts } = await import('../schemas/accounts.js'));
    ({ default: Account } = await import('../schemas/account.js'));
    ({ default: Transaction } = await import('../schemas/transaction.js'));
  });

  describe('init', () => {
    it('initializes database connection', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      
      await initPromise;
      
      expect(global.indexedDB.open).toHaveBeenCalledWith('YnabToMonarchDB', 2);
    });

    it('creates object stores on upgrade', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onupgradeneeded?.({ 
        target: { result: mockIDBDatabase, transaction: mockTransaction } 
      });
      mockOpenRequest.onsuccess?.();
      
      await initPromise;
      
      expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith('accounts', { keyPath: 'id' });
      expect(mockIDBDatabase.createObjectStore).toHaveBeenCalledWith('transactions', { keyPath: 'id', autoIncrement: true });
    });
  });

  describe('saveAccounts', () => {
    it('saves accounts with transactions', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;

      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const accounts = new Accounts();
      const account = new Account('acc1');
      account.name = 'Checking';
      const txn = new Transaction('txn1');
      txn.accountId = 'acc1';
      account.transactions = [txn];
      accounts.add(account);

      const savePromise = FinancialDataDB.saveAccounts(accounts);
      mockTransaction.oncomplete?.();
      await savePromise;

      expect(mockObjectStore.put).toHaveBeenCalled();
    });
  });

  describe('hasAccounts', () => {
    it('returns true when accounts exist', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const countRequest = { onsuccess: null, result: 5 };
      mockObjectStore.count.mockReturnValue(countRequest);

      const promise = FinancialDataDB.hasAccounts();
      countRequest.onsuccess?.();
      const result = await promise;

      expect(result).toBe(true);
    });

    it('returns false when no accounts exist', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const countRequest = { onsuccess: null, result: 0 };
      mockObjectStore.count.mockReturnValue(countRequest);

      const promise = FinancialDataDB.hasAccounts();
      countRequest.onsuccess?.();
      const result = await promise;

      expect(result).toBe(false);
    });
  });

  describe('clearAccounts', () => {
    it('clears all accounts and transactions', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const clearPromise = FinancialDataDB.clearAccounts();
      mockTransaction.oncomplete?.();
      await clearPromise;

      expect(mockObjectStore.clear).toHaveBeenCalledTimes(2);
    });
  });

  describe('saveMetadata', () => {
    it('saves metadata key-value pair', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const putRequest = { onsuccess: null };
      mockObjectStore.put.mockReturnValue(putRequest);

      const promise = FinancialDataDB.saveMetadata('lastSync', 12345);
      putRequest.onsuccess?.();
      await promise;

      expect(mockObjectStore.put).toHaveBeenCalled();
    });
  });

  describe('getMetadata', () => {
    it('retrieves metadata by key', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const getRequest = { 
        onsuccess: null, 
        result: { key: 'lastSync', value: 12345 } 
      };
      mockObjectStore.get.mockReturnValue(getRequest);

      const promise = FinancialDataDB.getMetadata('lastSync');
      getRequest.onsuccess?.();
      const result = await promise;

      expect(result).toBe(12345);
    });

    it('returns null for non-existent key', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      const getRequest = { onsuccess: null, result: null };
      mockObjectStore.get.mockReturnValue(getRequest);

      const promise = FinancialDataDB.getMetadata('nonexistent');
      getRequest.onsuccess?.();
      const result = await promise;

      expect(result).toBeNull();
    });
  });

  describe('close', () => {
    it('closes database connection', async () => {
      const FinancialDataDB = (await import('./indexedDB.js')).default;
      
      const initPromise = FinancialDataDB.init();
      mockOpenRequest.onsuccess?.();
      await initPromise;

      FinancialDataDB.close();
      
      expect(mockIDBDatabase.close).toHaveBeenCalled();
    });
  });
});
