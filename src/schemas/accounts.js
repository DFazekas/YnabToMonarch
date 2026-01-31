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
    let normalized;
    if (accountsData instanceof Accounts) {
      normalized = accountsData;
    } else if (Array.isArray(accountsData)) {
      normalized = Accounts.from(accountsData);
    } else if (accountsData && typeof accountsData === 'object') {
      normalized = Accounts.from(Object.values(accountsData));
    } else {
      normalized = new Accounts();
    }

    this._accounts = new Map(normalized._accounts);
    this._transactionIds = new Set(normalized._transactionIds || []);
    return this;
  }

  /** Get all accounts as an array.
   * @returns {Account[]} Array of Account instances
  */
  get accounts() {
    return Array.from(this._accounts.values());
  }

  _populateAccount(account, data) {
    const numberFrom = (...fields) => {
      for (const field of fields) {
        const value = data[field];
        if (value !== undefined && value !== null) {
          const numeric = typeof value === 'number' ? value : Number(value);
          return isNaN(numeric) ? 0 : numeric;
        }
      }
      return 0;
    };

    account._ynabName = data.ynabName;
    account._monarchName = data.monarchName;
    account._ynabType = data.ynabType;
    account._ynabOriginalType = data.ynabOriginalType ?? data.originalType ?? account._ynabType;
    account._subtype = data.subtype ?? data.originalSubtype ?? null;
    account._balanceDollars = numberFrom('balanceDollars', 'balance');
    account._clearedBalanceDollars = numberFrom('clearedBalanceDollars', 'clearedBalance');
    account._unclearedBalanceDollars = numberFrom('unclearedBalanceDollars', 'unclearedBalance');
    account._migrationStatus = data.migrationStatus ?? data.status ?? account._migrationStatus;
    account._isIncluded = data.isIncluded ?? data.included ?? true;
    account._isSelected = data.isSelected ?? data.selected ?? false;
    account._isUserApproved = data.isUserApproved ?? false;
    account._isOnBudget = data.isOnBudget ?? data.onBudget ?? account._isOnBudget;
    account._isYnabClosed = data.isYnabClosed ?? data.isClosed ?? data.closed ?? account._isYnabClosed;
    account._isMonarchClosed = data.isMonarchClosed ?? false;
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
    const result = Array.from(this._accounts.values()).some(acc => acc.ynabName === sanitizedName);
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

    const account = Array.from(this._accounts.values()).find(acc => acc._ynabName === sanitizedName) || null;
    accountsLogger.debug('getByName', `Accounts.getByName: retrieving "${sanitizedName}" ->`, account);
    accountsLogger.groupEnd('getByName');
    return account;
  }

  // Database

  /** Load accounts from IndexedDB.
   * @return {Promise<Accounts>} The Accounts instance
   */
  async loadFromDb() {
    console.warn("Loading accounts from DB");
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

  async setInclusion(accountId, included) {
    const account = this._accounts.get(accountId);
    if (!account || typeof included !== 'boolean') {
      return;
    }

    account.included = included;
    await db.updateAccountModification(account.id, { included });
  }

  async toggleInclusion(accountId) {
    const account = this._accounts.get(accountId);
    if (!account) {
      return false;
    }

    const nextState = !account.included;
    await this.setInclusion(account.id, nextState);
    return nextState;
  }

  async setInclusionFor(accountIds, included) {
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return;
    }

    await Promise.all(accountIds.map(id => this.setInclusion(id, included)));
  }

  async setSelected(accountId, selected) {
    const account = this._accounts.get(accountId);
    if (!account) return;

    account.selected = selected;
    await db.updateAccountModification(account.id, { selected });
  }

  async setSelectedFor(accountIds, selected) {
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return;
    }

    await Promise.all(accountIds.map(id => this.setSelected(id, selected)));
  }

  async bulkRename(pattern, indexStart) {
    const selected = Array.from(this._accounts.values()).filter(acc => acc.selected);

    await Promise.all(
      selected.map((acc, i) => {
        const newName = applyPattern(pattern, acc, i + indexStart);
        acc.ynabName = newName;
        acc.isModified = true;
        return db.updateAccountModification(acc.id, { name: newName });
      })
    );
  }

  async bulkEditType(type, subtype) {
    const selected = Array.from(this._accounts.values()).filter(acc => acc.selected);

    await Promise.all(
      selected.map(acc => {
        acc.ynabType = type;
        acc.monarchSubtype = subtype;
        acc.isModified = true;
        return db.updateAccountModification(acc.id, { type, subtype });
      })
    );
  }

  getSelected() {
    return Array.from(this._accounts.values()).filter(acc => acc.selected);
  }

  getVisible(filters) {
    console.warn("Accounts.getVisible called");
    console.log("Filters:", filters);
    console.log("Accounts:", this._accounts);
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
        account.selected = false;
        return db.updateAccountModification(account.id, { selected: false });
      })
    );
  }

  async selectAll() {
    await Promise.all(
      Array.from(this._accounts.values()).map(account => {
        account.selected = true;
        return db.updateAccountModification(account.id, { selected: true });
      })
    );
  }

  async clear() {
    await db.clearAccounts();
    this._accounts = new Map();
  }

  async removeAccounts(accountIds) {
    if (!Array.isArray(accountIds) || accountIds.length === 0) {
      return;
    }

    await db.deleteAccounts(accountIds);
    accountIds.forEach(id => this._accounts.delete(id));
  }

  async updateAccount(account) {
    if (!account || !account.id) {
      return;
    }

    await db.saveAccount(account);
    this._accounts.set(account.id, account);
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
