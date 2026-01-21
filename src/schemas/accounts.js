import db from '../utils/indexedDB.js';
import Account from './account.js';
import Transaction from './transaction.js';
import getLogger, { setLoggerConfig } from '../utils/logger.js';


const accountsLogger = getLogger('Accounts');

setLoggerConfig({
  namespaces: { Accounts: false },
  methods: { 'Accounts.getByName': true },
  levels: { debug: true, group: true, groupEnd: true },
});

export default class Accounts {
  static from(accountList) {
    if (accountList instanceof Accounts) {
      return accountList;
    }

    const instance = new Accounts();
    if (!Array.isArray(accountList)) {
      return instance;
    }

    accountList.forEach(entry => {
      if (entry instanceof Account) {
        instance._accounts.set(entry.id, entry);
        return;
      }

      if (entry && typeof entry === 'object') {
        const account = new Account(entry.id);
        instance._populateAccount(account, entry);
        instance._accounts.set(account.id, account);
      }
    });

    return instance;
  }

  constructor() {
    /** Map of accounts.
     * @type {Map<string, Account>}
     */
    this._accounts = new Map();
    this._transactionIds = new Set();
  }

  async init(accountsData) {
    const map = new Map();
    if (Array.isArray(accountsData)) {
      accountsData.forEach(data => {
        const account = new Account(data.id);
        this._populateAccount(account, data);
        map.set(account.id, account);
      });
    } else if (accountsData && typeof accountsData === 'object') {
      Object.values(accountsData).forEach(data => {
        const account = new Account(data.id);
        this._populateAccount(account, data);
        map.set(account.id, account);
      });
    }
    this._accounts = map;
    return this;
  }

  /** Get all accounts as an array.
   * @returns {Account[]} Array of Account instances
  */
  get accounts() {
    return Array.from(this._accounts.values());
  }

  _populateAccount(account, data) {
    account._name = data.name;
    account._originalName = data.originalName || data.name;
    account._type = data.type;
    account._subtype = data.subtype;
    account._balanceDollars = data.balance || 0;
    account._status = data.status || 'unprocessed';
    account._included = data.included !== undefined ? data.included : true;
    account._selected = data.selected || false;
    account._isModified = data.modified || false;

    if (data.transactions && Array.isArray(data.transactions)) {
      data.transactions.forEach(txnData => {
        const txn = new Transaction();
        Object.assign(txn, {
          id: txnData.id,
          _accountId: txnData.accountId,
          _flagName: txnData.flagName,
          _date: txnData.date,
          _payee: txnData.payee,
          _categoryGroup: txnData.categoryGroup,
          _category: txnData.category,
          _memo: txnData.memo,
          _amountDollars: txnData.amountDollars,
          _state: txnData.state,
          _deleted: txnData.deleted,
          _transferAccountName: txnData.transferAccountName
        });
        account._transactions.set(txn.id, txn);
      });
    }
  }

  add(account) {
    accountsLogger.group('add');
    if (!this._accounts.has(account.id)) {
      accountsLogger.debug('add', `Adding account with ID '${account.id}' to Accounts`);
      this._accounts.set(account.id, account);
    } else {
      accountsLogger.warn('add', `Account with ID ${account.id} already exists:\nAccountData:`, account, `\nExisting Account:`, this._accounts.get(account.id));
    }
    accountsLogger.groupEnd('add');
  }

  has(accountName) {
    accountsLogger.group('has');
    const sanitizedName = accountName.trim();
    if (sanitizedName.length === 0) {
      accountsLogger.warn('has', "❌ Attempted to check empty name in Accounts.has");
      accountsLogger.groupEnd('has');
      return false;
    }
    const result = Array.from(this._accounts.values()).some(acc => acc.name === sanitizedName);
    accountsLogger.debug('has', `Accounts.has: checking for "${sanitizedName}" ->`, result);
    accountsLogger.groupEnd('has');
    return result;
  }

  /**
   * Get account by name.
   *
   * @param {string} accountName - The name of the account to retrieve.
   * @returns {Account|null} The account object if found, otherwise null.
   */
  getByName(accountName) {
    accountsLogger.group('getByName');
    const sanitizedName = accountName.trim();
    if (sanitizedName.length === 0) {
      accountsLogger.error('getByName', "Attempted to get empty name in Accounts.getByName");
      accountsLogger.groupEnd('getByName');
      throw new Error("Account name cannot be empty.");
    }

    const account = Array.from(this._accounts.values()).find(acc => acc._name === sanitizedName) || null;
    accountsLogger.debug('getByName', `Accounts.getByName: retrieving "${sanitizedName}" ->`, account);
    accountsLogger.groupEnd('getByName');
    return account;
  }

  // Database

  /** Load accounts from IndexedDB.
   * @return {Promise<Accounts>} The Accounts instance
   */
  async loadFromDb() {
    await db.init();
    const accountsData = await db.getAccounts();
    return this.init(accountsData);
  }
  /** Saves accounts to IndexedDB.
   * @return {Promise<void>}
   */
  async saveToDb() {
    accountsLogger.group('saveToDb');
    await db.init();
    await db.saveAccounts(this);
    accountsLogger.log('saveToDb', "✅ All accounts saved successfully");
    accountsLogger.groupEnd('saveToDb');
  }

  /** Iterates over each account and executes the provided callback function.
   * @param {function} callback - The function to execute for each account.
   */
  async forEach(callback) {
    for (const account of this._accounts.values()) {
      await callback(account);
    }
  }

  length() {
    return this._accounts.size;
  }

  totalTransactionCount() {
    return this._transactionIds.size;
  }

  async hasChanges() {
    return Array.from(this._accounts.values()).some(acc => acc.isModified);
  }

  async isAccountModified(accountId) {
    const account = this._accounts.get(accountId);
    return account ? account.isModified : false;
  }

  async includeAll() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => {
        account._included = true;
        return db.updateAccountModification(account.id, { included: true });
      })
    );
  }

  async excludeAll() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => {
        account._included = false;
        return db.updateAccountModification(account.id, { included: false });
      })
    );
  }

  async bulkRename(pattern, indexStart) {
    const selected = Array.from(this._accounts.values()).filter(acc => acc.selected);

    await Promise.all(
      selected.map((acc, i) => {
        const newName = applyPattern(pattern, acc, i + indexStart);
        acc._name = newName;
        acc._isModified = true;
        return db.updateAccountModification(acc.id, { name: newName });
      })
    );
  }

  async bulkEditType(type, subtype) {
    const selected = Array.from(this._accounts.values()).filter(acc => acc.selected);

    await Promise.all(
      selected.map(acc => {
        acc._ynabType = type;
        acc._subtype = subtype;
        acc._isModified = true;
        return db.updateAccountModification(acc.id, { type, subtype });
      })
    );
  }

  getSelected() {
    return Array.from(this._accounts.values()).filter(acc => acc.selected);
  }

  getVisible(filters) {
    const result = Array.from(this._accounts.values()).filter(acc => filters.passesFilters(acc));
    return result;
  }

  getIncludedAndUnprocessed() {
    return Array.from(this._accounts.values()).filter(acc => acc.included && acc.migrationStatus !== 'processed');
  }

  async undoAccountChanges(accountId) {
    const account = this._accounts.get(accountId);
    if (account) {
      await account.undoChanges();
    }
  }

  async undoAllChanges() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => account.undoChanges())
    );
  }

  async deselectAll() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => {
        account._selected = false;
        return db.updateAccountModification(account.id, { selected: false });
      })
    );
  }

  async selectAll() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => {
        account._selected = true;
        return db.updateAccountModification(account.id, { selected: true });
      })
    );
  }

  async clear() {
    await db.clearAccounts();
    this._accounts = new Map();
  }

  addTransaction(transactionId) {
    accountsLogger.group('addTransaction');
    if (this._transactionIds.has(transactionId)) {
      accountsLogger.warn('addTransaction', "❌ Attempted to add duplicate transaction ID to Accounts:", transactionId);
      accountsLogger.groupEnd('addTransaction');
      return;
    }
    this._transactionIds.add(transactionId);
    accountsLogger.groupEnd('addTransaction');
  }
}

// TODO: Move somewhere appropriate.
function applyPattern(pattern, account, index) {
  return pattern
    .replace(/{name}/g, account.name)
    .replace(/{type}/g, account.type)
    .replace(/{index}/g, index);
}
