import db from '../utils/indexedDB.js';
import parseDate from '../utils/date.js';
import generateId from '../utils/idGenerator.js'
import parseCurrencyToCents from '../utils/currency.js';
import getLogger, {setLoggerConfig} from '../utils/logger.js';

const txnLogger = getLogger('Transaction');
const accountLogger = getLogger('Account');
const accountsLogger = getLogger('Accounts');

setLoggerConfig({
  namespaces: { Accounts: false, Account: false, Transaction: false },
  methods: { 'Accounts.getByName': true },
  levels: { debug: true, group: true, groupEnd: true },
});

export class Transaction {
  constructor() {
    /** Unique identifier for the transaction.
     * @type {string}
    */
    this.id = generateId();

    /** The account ID associated with the transaction. 
     * @type {string|null}
     */
    this._accountId = null;

    /** Represents the flag name of the transaction.
     * @type {string|null}
    */
    this._flagName = null;

    /** Represents the date of the transaction in YYYY-MM-DD format. 
     * @type {Date|null}
    */
    this._date = null;

    /** Represents the payee for the transaction. 
     * @type {string|null}
    */
    this._payee = null;

    /** Represents the category group for the transaction.
     * @type {string|null}
    */
    this._categoryGroup = null;

    /** Represents the category for the transaction.
     * @type {string|null}
    */
    this._category = null;

    /** Represents the memo for the transaction.
     * @type {string|null}
    */
    this._memo = null;

    /** Represents the transaction amount in dollars. 
     * @type {float}
    */
    this._amountDollars = 0.00;

    /** Represents the cleared state of the transaction.
     * @type {string}
    */
    this._state = 'uncleared'; // Enum (cleared, uncleared, reconciled)

    /** Represents whether the transaction has been deleted.
     * @type {boolean}
    */
    this._deleted = false;

    /** Represents the linked account name for transfer transactions.
     * @type {string|null}
    */
    this._transferAccountName = null;
  }

  init(data) {
    txnLogger.group('init');

    // Detect if transaction is an account transfer
    this._setTransferAccount(data['Payee']);
    this.setDate(data['Date']);
    this.setPayee(data['Payee']);
    this.setFlagName(data['Flag']);
    this.setCategory(data['Category'], data['Category Group']);
    this.setMemo(data['Memo']);
    this.setState(data['Cleared']);
    this.setAccountId(data['Account']);

    // Parse inflow/outflow to determine net amount
    const txnInflowCents = parseCurrencyToCents(data['Inflow']);
    const txnOutflowCents = parseCurrencyToCents(data['Outflow']);
    const txnNetDollars = (txnInflowCents - txnOutflowCents) / 100;
    this.setAmount(txnNetDollars);

    txnLogger.groupEnd('init');
  }

  setAmount(amountDollars) {
    txnLogger.group('setAmount');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      txnLogger.error('setAmount', "Attempted to set invalid amount for transaction ID:", this.id, "Amount:", amountDollars);
      txnLogger.groupEnd('setAmount');
      return;
    }
    txnLogger.debug('setAmount', `Setting amount to '${amountDollars}'`);
    this._amountDollars = amountDollars;
    txnLogger.groupEnd('setAmount');
  }

  get amount() {
    return this._amountDollars;
  }

  setDate(date) {
    txnLogger.group('setDate');
    const formattedDate = parseDate(date);
    if (!formattedDate) {
      txnLogger.error('setDate', "Attempted to set invalid date for transaction ID:", this.id, "Input date:", date);
      txnLogger.groupEnd('setDate');
      return;
    }
    txnLogger.debug('setDate', `Setting date to '${formattedDate}'`);
    this._date = formattedDate;
    txnLogger.groupEnd('setDate');
  }

  setPayee(payee) {
    txnLogger.group('setPayee');
    const sanitizedPayee = payee?.trim() || '';
    if (sanitizedPayee.length === 0) {
      txnLogger.debug('setPayee', "Setting empty Payee for balance adjustment.");
      this._payee = null;
      txnLogger.groupEnd('setPayee');
      return;
    }

    txnLogger.debug('setPayee', `Setting Payee to '${sanitizedPayee}'`);
    this._payee = sanitizedPayee;
    txnLogger.groupEnd('setPayee');
  }

  setFlagName(flagName) {
    txnLogger.group('setFlagName');
    const sanitizedFlagName = flagName.trim();
    if (sanitizedFlagName.length === 0) {
      txnLogger.debug('setFlagName', "Setting empty flag name for transaction ID:", this.id);
      txnLogger.groupEnd('setFlagName');
      return;
    }
    txnLogger.debug('setFlagName', `Setting flag name to '${sanitizedFlagName}'`);
    this._flagName = sanitizedFlagName;
    txnLogger.groupEnd('setFlagName');
  }

  setCategory(category, categoryGroup) {
    txnLogger.group('setCategory');
    const sanitizedCategory = category.trim();
    const sanitizedCategoryGroup = categoryGroup.trim();
    const hasCategory = sanitizedCategory.length > 0;
    const hasCategoryGroup = sanitizedCategoryGroup.length > 0;

    // Both can be empty, or both must be set
    if (hasCategory !== hasCategoryGroup) {
      txnLogger.error('setCategory', `Attempted to set Category and Category Group inconsistently; Category: '${sanitizedCategory}' | Category Group: '${sanitizedCategoryGroup}'`);
      txnLogger.groupEnd('setCategory');
      return;
    }

    if (!hasCategory) {
      txnLogger.debug('setCategory', "Setting empty Category and Category Group");
      this._category = null;
      this._categoryGroup = null;
    } else {
      txnLogger.debug('setCategory', `Setting Category to '${sanitizedCategory}' and Category Group to '${sanitizedCategoryGroup}'`);
      this._category = sanitizedCategory;
      this._categoryGroup = sanitizedCategoryGroup;
    }

    txnLogger.groupEnd('setCategory');
  }

  setMemo(memo) {
    txnLogger.group('setMemo');
    const sanitizedMemo = memo.trim();
    if (sanitizedMemo.length === 0) {
      txnLogger.debug('setMemo', "Setting empty memo for transaction ID:", this.id);
      txnLogger.groupEnd('setMemo');
      return;
    }
    txnLogger.debug('setMemo', `Setting memo to '${sanitizedMemo}'`);
    this._memo = sanitizedMemo;
    txnLogger.groupEnd('setMemo');
  }

  setState(state) {
    txnLogger.group('setState');
    const sanitizedState = state.trim().toLowerCase();
    const validStates = ['cleared', 'uncleared', 'reconciled'];
    if (!validStates.includes(sanitizedState)) {
      txnLogger.warn('setState', `Attempted to set invalid state for transaction ID: '${this.id}', State: '${sanitizedState}'`);
      txnLogger.groupEnd('setState');
      return;
    }
    txnLogger.debug('setState', `Setting state to '${sanitizedState}'`);
    this._state = sanitizedState;
    txnLogger.groupEnd('setState');
  }

  setAccountId(accountId) {
    txnLogger.group('setAccountId');
    if (!accountId || accountId.trim().length === 0) {
      txnLogger.warn('setAccountId', "Attempted to set empty account ID for transaction ID:", this.id);
      txnLogger.groupEnd('setAccountId');
      return;
    }
    txnLogger.debug('setAccountId', `Setting account ID to '${accountId}'`);
    this._accountId = accountId;
    txnLogger.groupEnd('setAccountId');
  }

  _setTransferAccount(payee) {
    txnLogger.group('_setTransferAccount');
    const sanitizedPayee = payee?.trim() || '';
    const transferPrefix = 'Transfer : ';

    if (sanitizedPayee.length === 0) {
      txnLogger.debug('_setTransferAccount', "Payee is empty; skipping.");
      txnLogger.groupEnd('_setTransferAccount');
      return false;
    }

    if (!sanitizedPayee.startsWith(transferPrefix)) {
      txnLogger.debug('_setTransferAccount', "Payee does not indicate a transfer; skipping.");
      txnLogger.groupEnd('_setTransferAccount');
      return false;
    }

    const accountName = sanitizedPayee.substring(transferPrefix.length).trim();
    if (accountName.length === 0) {
      txnLogger.warn('_setTransferAccount', `Transfer payee has no account name specified.`);
      txnLogger.groupEnd('_setTransferAccount');
      return false;
    }

    txnLogger.debug('_setTransferAccount', `Detected an account transfer to '${accountName}'`);
    this._transferAccountName = accountName;
    txnLogger.groupEnd('_setTransferAccount');
    return true;
  }

  toObject() {
    return {
      id: this.id,
      accountId: this._accountId,
      flagName: this._flagName,
      date: this._date,
      payee: this._payee,
      categoryGroup: this._categoryGroup,
      category: this._category,
      memo: this._memo,
      amountDollars: this._amountDollars,
      state: this._state,
      deleted: this._deleted,
      transferAccountName: this._transferAccountName
    };
  }
}

export class Account {
  constructor(id) {
    /** The unique identifier for the account.
     * @type {string}
    */
    this.id = id;

    /** The current name of the account.
     * @type {string|null}
     */
    this._name = null;

    /** The original name of the account before any modifications. 
     * @type {string|null}
    */
    this._originalName = null;

    /** The balance of the account in dollars.
     * @type {number}
     */
    this._balanceDollars = 0.00;

    /** The type of the account.
     * @type {string|null}
     */
    this._type = null;

    /** The subtype of the account.
     * @type {string|null}
     */
    this._subtype = null;

    /** The transactions associated with the account.
     * @type {Map<string, Transaction>}
     */
    this._transactions = new Map();

    /** The status of the account processing.
     * @type {string}
     */
    this._status = "unprocessed";

    /** Whether the account is selected for bulk operations.
     * @type {boolean}
     */
    this._selected = false;

    /** Whether the account will be migrated.
     * @type {boolean}
     */
    this._included = true;

    /** Whether the account has been modified.
     * @type {boolean}
     */
    this._isModified = false;
  }

  get name() {
    return this._name;
  }

  get type() {
    return this._type;
  }

  get subtype() {
    return this._subtype;
  }

  get status() {
    return this._status;
  }

  get included() {
    return this._included;
  }

  set included(value) {
    this._included = value;
  }

  get selected() {
    return this._selected;
  }

  set selected(value) {
    this._selected = value;
  }

  get transactions() {
    return Array.from(this._transactions.values());
  }

  get transactionCount() {
    return this._transactions.size;
  }

  get balance() {
    return this._balanceDollars;
  }

  get original() {
    return {
      name: this._originalName,
      type: this._type,
      subtype: this._subtype
    };
  }

  get current() {
    return {
      name: this._name,
      type: this._type,
      subtype: this._subtype
    };
  }

  isModified() {
    return this._isModified;
  }

  // Sync setters

  setName(name) {
    accountLogger.group('setName');
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0) {
      accountLogger.warn('setName', "❌ Attempted to set empty name for account ID:", this.id);
      accountLogger.groupEnd('setName');
      return;
    }
    accountLogger.debug('setName', `Setting name to '${sanitizedName}'`);
    if (!this._originalName) {
      this._originalName = sanitizedName;
    }
    this._name = sanitizedName;
    accountLogger.groupEnd('setName');
  }

  addToBalance(amountDollars) {
    accountLogger.group('addToBalance');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      accountLogger.warn('addToBalance', "❌ Attempted to add invalid amount to balance for account ID:", this.id, "Amount:", amountDollars);
      accountLogger.groupEnd('addToBalance');
      return;
    }
    accountLogger.debug('addToBalance', `Adding '${amountDollars}' to current balance ${this._balanceDollars}`);
    this._balanceDollars += amountDollars;
    accountLogger.debug('addToBalance', `New balance is '${this._balanceDollars}'`);
    accountLogger.groupEnd('addToBalance');
  }

  setType(type) {
    accountLogger.group('setType');
    if (!type || type.trim().length === 0) {
      accountLogger.warn('setType', "❌ Attempted to set empty type for account ID:", this.id);
      accountLogger.groupEnd('setType');
      return;
    }
    accountLogger.debug('setType', `Setting type to '${type}'`);
    this._type = type;
    accountLogger.groupEnd('setType');
  }

  setSubtype(subtype) {
    accountLogger.group('setSubtype');
    if (!subtype || subtype.trim().length === 0) {
      accountLogger.warn('setSubtype', "❌ Attempted to set empty subtype for account ID:", this.id);
      accountLogger.groupEnd('setSubtype');
      return;
    }
    accountLogger.debug('setSubtype', `Setting subtype to '${subtype}'`);
    this._subtype = subtype;
    accountLogger.groupEnd('setSubtype');
  }

  async toggleInclusion() {
    accountLogger.group('toggleInclusion');
    this._included = !this._included;
    await db.updateAccountModification(this.id, { included: this._included });
    accountLogger.groupEnd('toggleInclusion');
  }

  async undoChanges() {
    accountLogger.group('undoChanges');
    this._name = this._originalName;
    this._included = true;
    this._isModified = false;
    await db.updateAccountModification(this.id, {
      name: this._originalName,
      type: this._type,
      subtype: this._subtype,
      included: true,
      modified: false
    });
    accountLogger.groupEnd('undoChanges');
  }

  isProcessed() {
    accountLogger.group('isProcessed');
    const result = this.status === 'processed';
    accountLogger.debug('isProcessed', `Account ID ${this.id} isProcessed ->`, result);
    accountLogger.groupEnd('isProcessed');
    return result;
  }

  addTransaction(transaction) {
    accountLogger.group('addTransaction');
    if (!(transaction instanceof Transaction)) {
      accountLogger.error('addTransaction', "❌ Attempted to add invalid transaction to account ID:", this.id, "Transaction:", transaction);
      accountLogger.groupEnd('addTransaction');
      return;
    }

    accountLogger.debug('addTransaction', `Adding transaction ID '${transaction.id}' to account ID '${this.id}'`);
    this._transactions.set(transaction.id, transaction);
    accountLogger.groupEnd('addTransaction');
  }

  toObject() {
    return {
      id: this.id,
      name: this._name,
      originalName: this._originalName,
      type: this._type,
      originalType: this._type,
      subtype: this._subtype,
      originalSubtype: this._subtype,
      balance: this._balanceDollars,
      status: this._status,
      included: this._included,
      selected: this._selected,
      transactions: Array.from(this._transactions.values()).map(txn => txn.toObject()),
      modified: this._isModified
    };
  }
}

export default class Accounts {
  constructor() {
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
      accountsLogger.warn('getByName', "❌ Attempted to get empty name in Accounts.getByName");
      accountsLogger.groupEnd('getByName');
      return null;
    }

    const account = Array.from(this._accounts.values()).find(acc => acc._name === sanitizedName) || null;
    accountsLogger.debug('getByName', `Accounts.getByName: retrieving "${sanitizedName}" ->`, account);
    accountsLogger.groupEnd('getByName');
    return account;
  }

  async load() {
    await db.init();
    const accountsData = await db.getAccounts();
    return this.init(accountsData);
  }

  async saveToDb() {
    accountsLogger.group('saveToDb');
    await db.init();

    const accountsData = {};
    for (const account of this._accounts.values()) {
      console.log(`Preparing to save account:`, account);
      accountsData[account.id] = account.toObject();
    }

    await db.saveAccounts(accountsData);
    accountsLogger.log('saveToDb', "✅ All accounts saved successfully");
    accountsLogger.groupEnd('saveToDb');
  }

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
    return Array.from(this._accounts.values()).some(acc => acc.isModified());
  }

  async isAccountModified(accountId) {
    const account = this._accounts.get(accountId);
    return account ? account.isModified() : false;
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
        acc._type = type;
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
    return Array.from(this._accounts.values()).filter(acc => acc.included && acc.status !== 'processed');
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
