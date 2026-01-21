/**
 * IndexedDB Manager for Financial Data
 * 
 * Manages persistent storage of accounts and transactions using IndexedDB.
 * Provides OOP interface for CRUD operations.
 * 
 * Usage:
 *   import FinancialDataDB from './utils/indexedDB.js';
 *   const db = new FinancialDataDB();
 *   await db.init();
 *   await db.saveAccounts(accountsData);
 *   const accounts = await db.getAccounts();
 */

import Account from '../schemas/account.js';
import Accounts from '../schemas/accounts.js';
import Transaction from '../schemas/transaction.js';

const DB_NAME = 'YnabToMonarchDB';
const DB_VERSION = 2;

// Check if IndexedDB is available (not in Node.js environment)
const isIndexedDBAvailable = typeof indexedDB !== 'undefined';

class FinancialDataDB {
  constructor() {
    this.db = null;
  }

  /**
   * Initialize the database connection and create object stores
   * @returns {Promise<void>}
   */
  async init() {
    console.group('Initializing IndexedDB:');
    if (!isIndexedDBAvailable) {
      console.warn('IndexedDB not available in this environment');
      console.groupEnd();
      return;
    }

    // Skip if already initialized
    if (this.db) {
      console.log('✅ IndexedDB already initialized, skipping');
      console.groupEnd();
      return;
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('IndexedDB failed to open:', request.error);
        console.groupEnd();
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized');
        console.groupEnd();
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create or upgrade accounts store
        let accountStore;
        if (!db.objectStoreNames.contains('accounts')) {
          accountStore = db.createObjectStore('accounts', { keyPath: 'id' });
          console.log('Created "accounts" object store');
        } else {
          accountStore = event.target.transaction.objectStore('accounts');
          console.log('Upgrading "accounts" object store');
        }

        // Ensure indices exist
        if (accountStore && !accountStore.indexNames.contains('name')) {
          accountStore.createIndex('name', 'name', { unique: false });
        }
        if (accountStore && !accountStore.indexNames.contains('type')) {
          accountStore.createIndex('type', 'type', { unique: false });
        }
        if (accountStore && !accountStore.indexNames.contains('included')) {
          accountStore.createIndex('included', 'included', { unique: false });
        }
        if (accountStore && !accountStore.indexNames.contains('modified')) {
          accountStore.createIndex('modified', 'modified', { unique: false });
        }
        if (accountStore && !accountStore.indexNames.contains('syncedAt')) {
          accountStore.createIndex('syncedAt', 'syncedAt', { unique: false });
        }

        // Create transactions store
        if (!db.objectStoreNames.contains('transactions')) {
          const txnStore = db.createObjectStore('transactions', { keyPath: 'id', autoIncrement: true });
          txnStore.createIndex('accountId', 'accountId', { unique: false });
          txnStore.createIndex('date', 'date', { unique: false });
          console.log('Created "transactions" object store');
        }

        // Create upload state tracking
        if (!db.objectStoreNames.contains('uploadStates')) {
          const uploadStore = db.createObjectStore('uploadStates', { keyPath: 'itemId' });
          uploadStore.createIndex('status', 'status', { unique: false });
          uploadStore.createIndex('timestamp', 'timestamp', { unique: false });
          console.log('Created "uploadStates" object store');
        }

        // Create metadata store for app state
        if (!db.objectStoreNames.contains('metadata')) {
          db.createObjectStore('metadata', { keyPath: 'key' });
          console.log('Created "metadata" object store');
        }

        console.groupEnd();
      };
    });
  }

  /**
   * Save all accounts to IndexedDB
   * @param {Accounts} accountsData - Accounts object with account IDs as keys
   * @returns {Promise<void>}
   */
  async saveAccounts(accountsData) {
    console.group('saveAccounts:');

    if (!(accountsData instanceof Accounts)) {
      console.error('Invalid accountsData provided, expected Accounts instance');
      console.groupEnd();
      throw new Error('Invalid accountsData provided, expected Accounts instance');
    }

    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, skipping save');
      console.groupEnd();
      return;
    }

    console.log(`Saving ${accountsData.accounts.length} accounts to IndexedDB`);

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['accounts', 'transactions'], 'readwrite');
      const accountStore = tx.objectStore('accounts');
      const txnStore = tx.objectStore('transactions');

      // Clear existing data
      console.log('Clearing existing accounts and transactions...');
      accountStore.clear();
      txnStore.clear();

      // Save each account and its transactions
      for (const account of accountsData.accounts) {
        console.debug(`Account data for '${account.id}':`, account);

        const transactionIds = new Set();

        // Save transactions to Transactions store and collect IDs
        console.log(`Processing (${account.transactions.length}) transactions for account '${account.id}'`);
        for (const txn of account.transactions) {
          try {
            console.debug(`Storing transaction:`, txn);
            txnStore.put(txn.toObject());
            transactionIds.add(txn.id);
          } catch (e) {
            console.error(`Error storing transaction for account ${account.id}:`, e);
          }
        }

        console.log(`Saving account '${account.name}' with ID '${account.id}' with (${transactionIds.size}) transaction IDs`);
        accountStore.put(account.toObject());
      }

      tx.oncomplete = () => {
        console.log(`Saved (${accountsData.accounts.length}) accounts to IndexedDB.`);
        console.groupEnd();
        resolve();
      };

      tx.onerror = () => {
        console.error('Error saving accounts to IndexedDB:', tx.error);
        console.groupEnd();
        reject(tx.error);
      };
    });
  }

  /**
   * Get all accounts with their transactions
   * @returns {Promise<Accounts>} Accounts instance containing Account and Transaction instances
   */
  async getAccounts() {
    console.group('getAccounts:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, returning empty Accounts');
      console.groupEnd();
      throw new Error('IndexedDB not initialized');
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['accounts', 'transactions'], 'readonly');
      const accountStore = tx.objectStore('accounts');
      const txnStore = tx.objectStore('transactions');
      const accountsData = {};

      const cursorRequest = accountStore.openCursor();

      cursorRequest.onsuccess = async (event) => {
        const cursor = event.target.result;

        if (!cursor) {
          console.debug(`✅ Retrieved ${Object.keys(accountsData).length} accounts from IndexedDB`);
          const accounts = new Accounts();
          await accounts.init(accountsData);
          console.groupEnd();
          resolve(accounts);
          return;
        }

        const accountData = cursor.value;
        const accountId = accountData.id;

        // Get transactions for this account from transactions store
        const txnIndex = txnStore.index('accountId');
        const txnRequest = txnIndex.getAll(accountId);

        txnRequest.onsuccess = () => {
          const { transactionIds, ...restAccountData } = accountData;
          accountsData[accountId] = {
            ...restAccountData,
            transactions: txnRequest.result.map(txn => {
              const { accountId, ...rest } = txn;
              return rest;
            })
          };
          console.debug(`Retrieved account ${accountId} with ${txnRequest.result.length} transactions`);
          cursor.continue();
        };

        txnRequest.onerror = () => {
          console.error('Error retrieving transactions:', txnRequest.error);
          console.groupEnd();
          reject(txnRequest.error);
        };
      };

      cursorRequest.onerror = () => {
        console.error('Error opening cursor:', cursorRequest.error);
        console.groupEnd();
        reject(cursorRequest.error);
      };
    });
  }

  /**
   * Get a single account by ID
   * @param {string} accountId
   * @returns {Promise<Object|null>}
   */
  async getAccount(accountId) {
    console.group('getAccount:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized');
      console.groupEnd();
      return null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['accounts', 'transactions'], 'readonly');
      const accountStore = tx.objectStore('accounts');
      const txnStore = tx.objectStore('transactions');

      const getRequest = accountStore.get(accountId);

      getRequest.onsuccess = () => {
        const account = getRequest.result;

        if (!account) {
          console.warn(`Account ${accountId} not found`);
          console.groupEnd();
          resolve(null);
          return;
        }

        // Get transactions for this account from transactions store
        const txnIndex = txnStore.index('accountId');
        const txnRequest = txnIndex.getAll(accountId);

        txnRequest.onsuccess = () => {
          const { transactionIds, ...accountData } = account;
          const result = {
            ...accountData,
            transactions: txnRequest.result.map(txn => {
              const { accountId, ...rest } = txn;
              return rest;
            })
          };
          console.log(`✅ Retrieved account ${accountId} with ${txnRequest.result.length} transactions`);
          console.groupEnd();
          resolve(result);
        };

        txnRequest.onerror = () => {
          console.error('Error retrieving transactions:', txnRequest.error);
          console.groupEnd();
          reject(txnRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Error retrieving account:', getRequest.error);
        console.groupEnd();
        reject(getRequest.error);
      };
    });
  }

  /**
   * Save an account and all its transactions to IndexedDB
   * @param {string} accountId - The account ID
   * @param {Object} accountData - Account object with all properties and transactions array
   * @returns {Promise<void>}
   */
  // async saveAccount(accountId, accountData) {
  //   console.group('FinancialDataDB.saveAccount');
  //   if (!isIndexedDBAvailable || !this.db) {
  //     console.error('IndexedDB not initialized, skipping account save');
  //     console.groupEnd();
  //     return;
  //   }

  //   return new Promise((resolve, reject) => {
  //     const tx = this.db.transaction(['accounts', 'transactions'], 'readwrite');
  //     const accountStore = tx.objectStore('accounts');
  //     const txnStore = tx.objectStore('transactions');

  //     const now = Date.now();
  //     const account = {
  //       id: accountId,
  //       balance: accountData.balance || 0,
  //       included: accountData.included !== undefined ? accountData.included : true,
  //       modified: accountData.modified !== undefined ? accountData.modified : false,
  //       name: accountData.name,
  //       originalName: accountData.originalName || accountData.name,
  //       originalType: accountData.originalType || accountData.type,
  //       originalSubtype: accountData.originalSubtype || accountData.subtype,
  //       selected: accountData.selected || false,
  //       status: accountData.status || 'pending',
  //       subtype: accountData.subtype,
  //       type: accountData.type,
  //       lastModified: accountData.lastModified || now,
  //       syncedAt: now
  //     };

  //     console.log(`Saving account ${accountId} with ${accountData.transactions?.length || 0} transactions`);
  //     accountStore.put(account);

  //     // Save transactions if they exist
  //     if (accountData.transactions && Array.isArray(accountData.transactions)) {
  //       console.log(`Processing ${accountData.transactions.length} transactions for account ${accountId}`);
  //       for (const txn of accountData.transactions) {
  //         try {
  //           const txnToStore = {
  //             ...txn,
  //             accountId: accountId
  //           };
  //           console.debug(`Storing transaction:`, txnToStore);
  //           txnStore.put(txnToStore);
  //         } catch (e) {
  //           console.error(`Error storing transaction for account ${accountId}:`, e);
  //         }
  //       }
  //     }

  //     tx.oncomplete = () => {
  //       console.log(`✅ Account ${accountId} and its transactions saved to IndexedDB`);
  //       console.groupEnd();
  //       resolve();
  //     };

  //     tx.onerror = () => {
  //       console.error('Error saving account:', tx.error);
  //       console.groupEnd();
  //       reject(tx.error);
  //     };
  //   });
  // }

  /**
   * Check if accounts exist in the database
   * @returns {Promise<boolean>}
   */
  async hasAccounts() {
    console.group('hasAccounts:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized');
      console.groupEnd();
      return false;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('accounts', 'readonly');
      const store = tx.objectStore('accounts');
      const request = store.count();

      request.onsuccess = () => {
        const hasAccounts = request.result > 0;
        console.log(`✅ Database has ${request.result} accounts`);
        console.groupEnd();
        resolve(hasAccounts);
      };

      request.onerror = () => {
        console.error('Error checking accounts:', request.error);
        console.groupEnd();
        resolve(false);
      };
    });
  }

  /**
   * Update modification-related fields for a single account
   * @param {string} accountId
   * @param {Object} updates - { included?, name?, type?, subtype?, modified? }
   */
  async updateAccountModification(accountId, updates = {}) {
    console.group('updateAccountModification:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized');
      console.groupEnd();
      return;
    }

    const tx = this.db.transaction('accounts', 'readwrite');
    const store = tx.objectStore('accounts');

    return new Promise((resolve, reject) => {
      console.log(`Updating account ${accountId} with`, updates);

      const getRequest = store.get(accountId);

      getRequest.onsuccess = () => {
        const current = getRequest.result;
        console.log('Current account data:', current);

        if (!current) {
          console.warn(`Account ${accountId} not found`);
          console.groupEnd();
          resolve();
          return;
        }

        const now = Date.now();
        const updated = {
          ...current,
          ...('included' in updates ? { included: updates.included } : {}),
          ...('selected' in updates ? { selected: updates.selected } : {}),
          ...('name' in updates ? { name: updates.name } : {}),
          ...('type' in updates ? { type: updates.type } : {}),
          ...('subtype' in updates ? { subtype: updates.subtype } : {}),
          modified: updates.modified !== undefined ? updates.modified : false,
          lastModified: now
        };
        console.log('Updated account data:', updated);

        const putRequest = store.put(updated);

        putRequest.onsuccess = () => {
          console.log(`✅ Account ${accountId} updated successfully`);
          console.groupEnd();
          resolve();
        };

        putRequest.onerror = () => {
          console.error('Error updating account modification:', putRequest.error);
          console.groupEnd();
          reject(putRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Error retrieving account:', getRequest.error);
        console.groupEnd();
        reject(getRequest.error);
      };
    });
  }

  /**
   * Clear all accounts and transactions
   * @returns {Promise<void>}
   */
  async clearAccounts() {
    console.group('clearAccounts:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, nothing to clear');
      console.groupEnd();
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(['accounts', 'transactions'], 'readwrite');

      tx.objectStore('accounts').clear();
      tx.objectStore('transactions').clear();

      tx.oncomplete = () => {
        console.log('✅ Cleared all accounts from IndexedDB');
        console.groupEnd();
        resolve();
      };

      tx.onerror = () => {
        console.error('Error clearing accounts:', tx.error);
        console.groupEnd();
        reject(tx.error);
      };
    });
  }

  /**
   * Save upload state for tracking retry logic
   * @param {string} itemId - Unique identifier for the item
   * @param {string} status - 'pending' | 'success' | 'failed'
   * @param {string|null} errorMsg - Error message if failed
   * @returns {Promise<void>}
   */
  async saveUploadState(itemId, status, errorMsg = null) {
    console.group('saveUploadState:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, skipping upload state save');
      console.groupEnd();
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('uploadStates', 'readwrite');
      const store = tx.objectStore('uploadStates');

      const getRequest = store.get(itemId);

      getRequest.onsuccess = () => {
        const existing = getRequest.result;
        const retryCount = existing ? (existing.retryCount || 0) + 1 : 0;

        const putRequest = store.put({
          itemId,
          status,
          retryCount,
          lastError: errorMsg,
          timestamp: Date.now()
        });

        putRequest.onsuccess = () => {
          console.log(`✅ Upload state for item ${itemId} saved as "${status}"`);
          console.groupEnd();
          resolve();
        }
        putRequest.onerror = () => {
          console.error('Error saving upload state:', putRequest.error);
          console.groupEnd();
          reject(putRequest.error);
        };
      };

      getRequest.onerror = () => {
        console.error('Error retrieving existing upload state:', getRequest.error);
        console.groupEnd();
        reject(getRequest.error);
      };
    });
  }

  /**
   * Get all upload states by status
   * @param {string} status - 'pending' | 'success' | 'failed'
   * @returns {Promise<Array>}
   */
  async getUploadStatesByStatus(status) {
    console.group('getUploadStatesByStatus:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, returning empty list');
      console.groupEnd();
      return [];
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('uploadStates', 'readonly');
      const store = tx.objectStore('uploadStates');
      const index = store.index('status');
      const request = index.getAll(status);

      request.onsuccess = () => {
        console.log(`✅ Retrieved ${request.result.length} upload states with status "${status}"`);
        console.groupEnd();
        resolve(request.result || []);
      }
      request.onerror = () => {
        console.error('Error retrieving upload states:', request.error);
        console.groupEnd();
        resolve([]);
      };
    });
  }

  /**
   * Clear all upload states
   * @returns {Promise<void>}
   */
  async clearUploadStates() {
    console.group('clearUploadStates:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, nothing to clear');
      console.groupEnd();
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('uploadStates', 'readwrite');
      tx.objectStore('uploadStates').clear();

      tx.oncomplete = () => {
        console.log('✅ Cleared upload states');
        console.groupEnd();
        resolve();
      };

      tx.onerror = () => {
        console.error('Error clearing upload states:', tx.error);
        console.groupEnd();
        reject(tx.error);
      };
    });
  }

  /**
   * Save metadata (app state, settings, etc.)
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async saveMetadata(key, value) {
    console.group('saveMetadata:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, skipping metadata save');
      console.groupEnd();
      return;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('metadata', 'readwrite');
      const store = tx.objectStore('metadata');
      const request = store.put({ key, value, timestamp: Date.now() });

      request.onsuccess = () => {
        console.log(`✅ Metadata for key "${key}" saved`);
        console.groupEnd();
        resolve();
      }
      request.onerror = () => {
        console.error('Error saving metadata:', request.error);
        console.groupEnd();
        reject(request.error);
      };
    });
  }

  /**
   * Get metadata by key
   * @param {string} key
   * @returns {Promise<any|null>}
   */
  async getMetadata(key) {
    console.group('getMetadata:');
    if (!isIndexedDBAvailable || !this.db) {
      console.warn('IndexedDB not initialized, returning null');
      console.groupEnd();
      return null;
    }

    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('metadata', 'readonly');
      const store = tx.objectStore('metadata');
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result;
        console.log(`✅ Retrieved metadata for key "${key}":`, result);
        console.groupEnd();
        resolve(result ? result.value : null);
      };

      request.onerror = () => {
        console.error('Error retrieving metadata:', request.error);
        console.groupEnd();
        resolve(null);
      };
    });
  }

  /**
   * Close the database connection
   */
  close() {
    console.group('close IndexedDB:');
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('✅ IndexedDB connection closed');
    } else {
      console.log('IndexedDB was not open');
    }
    console.groupEnd();
  }
}

// Export singleton instance - created once on module load
const db = new FinancialDataDB();
export default db;
