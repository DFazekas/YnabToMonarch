import db from '../utils/indexedDB.js';
import getLogger, { setLoggerConfig } from '../utils/logger.js';
import { AccountType as YnabAccountType, AccountTypeValues } from '../utils/enumYnabAccountType.js';
import { AccountMigrationStatus } from '../utils/enumAccountMigrationStatus.js';
import { centsToDollars } from '../utils/currency.js';
import parseDate from '../utils/date.js';
import Transaction from './transaction.js';

const logger = getLogger('Account');

setLoggerConfig({
  namespaces: { Account: true },
  methods: {},
  levels: { debug: true, group: true, groupEnd: true },
});

export default class Account {
  constructor(id) {
    /** The unique identifier for the account.
     * @type {string}
    */
    this.id = id;

    /** The current name of the account.
     * @type {string}
     */
    this._ynabName = "";

    /** The original name of the account before any modifications. 
     * @type {string}
    */
    this._monarchName = "";

    /** The current balance of the account in dollars.
     * @type {number}
     */
    this._balanceDollars = 0.00;

    /** The current cleared balance of the account in dollars.
     * @type {number}
     */
    this._clearedBalanceDollars = 0.00;

    /** The current uncleared balance of the account in dollars.
     * @type {number}
     */
    this._unclearedBalanceDollars = 0.00;

    /** Whether the account is linked to a financial institution for automatic transaction import. 
     * @type {boolean}
    */
    this._isDirectImportLinked = false;

    /** A date/time specifying when the account was last reconciled. 
     * @type {Date|null}
    */
    this._lastReconciledAt = null;

    /** The type of the account.
     * @type {AccountType}
     */
    this._ynabType = null;

    /** The original type of the account before any modifications. 
     * @type {null|AccountType}
     */
    this._ynabOriginalType = null;

    /** Monarch Money account type.
     * @type {string|null}
     */
    this._monarchType = null;

    /** Monarch Money account type before any modifications. 
     * @type {string|null}
     */
    this._monarchOriginalType = null;

    /** Monarch Money account subtype.
     * @type {string|null}
     */
    this._monarchSubtype = null;

    /** Monarch Money account subtype before any modifications. 
     * @type {string|null}
     */
    this._monarchOriginalSubtype = null;


    /** The transactions associated with the account.
     * @type {Map<string, Transaction>}
     */
    this._transactions = new Map();

    /** The status of the account processing.
     * @type {AccountMigrationStatus}
     */
    this._migrationStatus = AccountMigrationStatus.UNPROCESSED;

    /** Whether the account is selected for bulk operations.
     * @type {boolean}
     */
    this._isSelected = false;

    /** Whether the user approved the account mapping.
     * @type {boolean}
     */
    this._isUserApproved = false;

    /** Whether the account will be migrated.
     * @type {boolean}
     */
    this._isIncluded = true;

    /** Whether the YNAB account is closed or not.
     * @type {boolean}
     */
    this._isYnabClosed = false;

    /** Whether the Monarch account is closed or not.
     * @type {boolean}
     */
    this._isMonarchClosed = false;

    /** Whether this account is deleted or not.
     * @type {boolean}
     */
    this._isDeleted = false;

    /** A note associated with the account.
     * @type {string|null}
     */
    this._note = null;

    /** Whether the account has been modified.
     * @type {boolean}
     */
    this._isModified = false;

    /** Whether the account is a budget or tracking account.
     * @type {boolean}
     */
    this._isOnBudget = true;

    this._transferPayeeId = null;
  }

  // Name

  /** Gets the current account name.
   * @type {string}
   */
  get ynabName() {
    return this._ynabName;
  }
  /** Sets the current account name and original name if not already set.
   * @param {string} name - The new name for the account.
   */
  set ynabName(name) {
    const methodName = "set ynab name";
    logger.group(methodName);
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0) {
      logger.error(methodName, "Attempted to set empty name for account ID:", this.id);
      logger.groupEnd(methodName);
      throw new Error("Account name cannot be empty.");
    }

    logger.debug(methodName, `Setting name to '${sanitizedName}'`);
    this._ynabName = sanitizedName;
    logger.groupEnd(methodName);
  }
  
  set monarchName(name) {
    const methodName = "set monarch name";
    logger.group(methodName);
    const sanitizedName = name.trim();
    if (sanitizedName.length === 0) {
      logger.error(methodName, "Attempted to set empty monarch name for account ID:", this.id);
      logger.groupEnd(methodName);
      throw new Error("Monarch account name cannot be empty.");
    }
    logger.debug(methodName, `Setting monarch name to '${sanitizedName}'`);
    this._monarchName = sanitizedName;
    logger.groupEnd(methodName);
  }
  /** Gets the original account name.
   * @type {string}
   */
  get monarchName() {
    return this._monarchName;
  }

  // YNAB Type

  /** Gets the current YNAB account type.
   * @type {AccountType}
   */
  get ynabType() {
    return this._ynabType ?? this._type ?? null;
  }
  /** Sets the current YNAB account type and original type if not already set.
   * @param {AccountType} type - The new YNAB account type.
   */
  set ynabType(type) {
    const methodName = "set ynab type";
    logger.group(methodName);

    if (!Object.values(YnabAccountType).includes(type)) {
      logger.error(methodName, `Invalid type '${type}' for account ID: '${this.id}'`);
      logger.groupEnd(methodName);
      throw new Error(`Type must be one of: ${AccountTypeValues.join(', ')}`);
    }

    logger.debug(methodName, `Setting type to '${type}'`);
    this._ynabType = type;
    if (this._ynabOriginalType === null) {
      this._ynabOriginalType = type;
    }
    logger.groupEnd(methodName);
  }
  /** Gets the original YNAB account type.
   * @type {AccountType}
   */
  get ynabOriginalType() {
    return this._ynabOriginalType;
  }

  // Monarch Type

  /** Gets the current Monarch Money account type.
   * @type {string|null}
   */
  get monarchType() {
    return this._monarchType;
  }
  /** Sets the current Monarch Money account type and original type if not already set.
   * @param {string|null} type - The new Monarch Money account type.
   */
  set monarchType(type) {
    const methodName = "set monarch type";
    logger.group(methodName);
    this._monarchType = type;
    if (this._monarchOriginalType === null) {
      this._monarchOriginalType = type;
    }
    logger.groupEnd(methodName);
  }
  /** Gets the original Monarch Money account type.
   * @type {string|null}
   */
  get monarchOriginalType() {
    return this._monarchOriginalType;
  }

  // Monarch Subtype

  /** Gets the current Monarch Money account subtype.
   * @type {string|null}
   */
  get monarchSubtype() {
    return this._monarchSubtype;
  }
  /** Sets the current Monarch Money account subtype and original subtype if not already set.
   * @param {string|null} subtype - The new Monarch Money account subtype.
   */
  set monarchSubtype(subtype) {
    const methodName = "set monarch subtype";
    logger.group(methodName);
    this._monarchSubtype = subtype;
    if (this._monarchOriginalSubtype === null) {
      this._monarchOriginalSubtype = subtype;
    }
    logger.groupEnd(methodName);
  }
  /** Gets the original Monarch Money account subtype.
   * @type {string|null}
   */
  get monarchOriginalSubtype() {
    return this._monarchOriginalSubtype;
  }

  // Category Group

  /** Gets the current category group.
   * @type {string}
   */
  get categoryGroup() {
    return this._categoryGroup;
  }
  /** Sets the current category group.
   * @param {string} categoryGroup - The new category group.
   * @throws Will throw an error if the category group is empty.
   */
  set categoryGroup(categoryGroup) {
    logger.group('set categoryGroup');
    if (!categoryGroup || categoryGroup.trim().length === 0) {
      logger.error('set categoryGroup', "Attempted to set empty categoryGroup for account ID:", this.id);
      logger.groupEnd('set categoryGroup');
      throw new Error("Category group cannot be empty.");
    }

    logger.debug('set categoryGroup', `Setting categoryGroup to '${categoryGroup}'`);
    this._categoryGroup = categoryGroup;
    logger.groupEnd('set categoryGroup');
  }
  /** Gets the original category group.
   * @type {string}
   */
  get originalCategoryGroup() {
    return this._originalCategoryGroup;
  }

  // Balance

  /** Gets the current balance in dollars.
   * @type {number}
   */
  get balance() {
    return this._balanceDollars;
  }
  /** Sets the current balance in dollars.
   * @param {number} amountDollars - The new balance amount in dollars.
   * @throws Will throw an error if the amount is not a valid number.
   */
  set balance(amountDollars) {
    logger.group('set balance');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      logger.error('set balance', `Attempted to set invalid balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
      logger.groupEnd('set balance');
      throw new Error("Account balance must be a valid number.");
    }

    logger.debug('set balance', `Setting balance to '${amountDollars}'`);
    this._balanceDollars = amountDollars;
    logger.groupEnd('set balance');
  }
  /** Adds a specified amount to the current balance in dollars.
   * @param {number} amountDollars - The amount to add to the balance.
   * @throws Will throw an error if the amount is not a valid number.
   */
  addToBalance(amountDollars) {
    logger.group('addToBalance');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      logger.error('addToBalance', `Attempted to add invalid amount to balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
      logger.groupEnd('addToBalance');
      throw new Error("Amount to add to account balance must be a valid number.");
    }

    logger.debug('addToBalance', `Adding '${amountDollars}' to current balance '${this._balanceDollars}'`);
    this._balanceDollars += amountDollars;
    logger.debug('addToBalance', `New balance is '${this._balanceDollars}'`);
    logger.groupEnd('addToBalance');
  }
  /** Sets the current cleared balance in dollars.
   * @param {number} amountDollars - The new cleared balance amount in dollars.
   * @throws Will throw an error if the amount is not a valid number.
   */
  set clearedBalance(amountDollars) {
    logger.group('set clearedBalance');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      logger.error('set clearedBalance', `Attempted to set invalid cleared balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
      logger.groupEnd('set clearedBalance');
      throw new Error("Account cleared balance must be a valid number.");
    }

    logger.debug('set clearedBalance', `Setting cleared balance to '${amountDollars}'`);
    this._clearedBalanceDollars = amountDollars;
    logger.groupEnd('set clearedBalance');
  }
  /** Sets the current uncleared balance in dollars.
   * @param {number} amountDollars - The new uncleared balance amount in dollars.
   * @throws Will throw an error if the amount is not a valid number.
   */
  set unclearedBalance(amountDollars) {
    logger.group('set unclearedBalance');
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      logger.error('set unclearedBalance', `Attempted to set invalid uncleared balance for account ID: '${this.id}', Amount: '${amountDollars}'`);
      logger.groupEnd('set unclearedBalance');
      throw new Error("Account uncleared balance must be a valid number.");
    }

    logger.debug('set unclearedBalance', `Setting uncleared balance to '${amountDollars}'`);
    this._unclearedBalanceDollars = amountDollars;
    logger.groupEnd('set unclearedBalance');
  }

  // Migration Status

  /** Gets the migration status for the account.
   * @type {AccountMigrationStatus}
   */
  get migrationStatus() {
    return this._migrationStatus;
  }
  /** Sets the migration status for the account.
   * @param {AccountMigrationStatus} status - The new migration status
   * @throws Will throw an error if the status is not a valid AccountMigrationStatus
   */
  set migrationStatus(status) {
    const methodName = 'set migrationStatus';
    logger.group(methodName);
    if (!Object.values(AccountMigrationStatus).includes(status)) {
      logger.error(methodName, `Attempted to set invalid migration status for account ID: '${this.id}', Status: '${status}'`);
      logger.groupEnd(methodName);
      throw new Error(`Migration status must be one of: ${Object.values(AccountMigrationStatus).join(', ')}`);
    }
    logger.debug(methodName, `Setting migration status to '${status}'`);
    this._migrationStatus = status;
    logger.groupEnd(methodName);
  }

  // Included

  /** Gets whether the account is included.
   * @type {boolean}
   */
  get included() {
    return this._isIncluded;
  }
  /** Sets whether the account is included.
   * @param {boolean} value - The new included status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set included(value) {
    logger.group('set included');
    if (typeof value !== 'boolean') {
      logger.error('set included', `Attempted to set invalid included value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("Included value must be a boolean.");
    }

    this._isIncluded = value;
    logger.groupEnd('set included');
  }

  // Selected

  /** Gets whether the account is selected.
   * @type {boolean}
   */
  get selected() {
    return this._isSelected;
  }
  /** Sets whether the account is selected.
   * @param {boolean} value - The new selected status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set selected(value) {
    logger.group('set selected');
    if (typeof value !== 'boolean') {
      logger.error('set selected', `Attempted to set invalid selected value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("Selected value must be a boolean.");
    }

    this._isSelected = value;
    logger.groupEnd('set selected');
  }

  // User Approved

  /** Gets whether the account mapping is user approved.
   * @type {boolean}
   */
  get isUserApproved() {
    return this._isUserApproved;
  }
  /** Sets whether the account mapping is user approved.
   * @param {boolean} value - The new approval status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isUserApproved(value) {
    logger.group('set user approved');
    if (typeof value !== 'boolean') {
      logger.error('set user approved', `Attempted to set invalid isUserApproved value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isUserApproved value must be a boolean.");
    }

    this._isUserApproved = value;
    logger.groupEnd('set user approved');
  }

  // Closed

  /** Gets whether the account is closed.
   * @type {boolean}
   */
  get closed() {
    return this._isClosed === 'closed';
  }
  /** Sets whether the account is closed.
   * @param {boolean} value - The new closed status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set closed(value) {
    logger.group('set closed');
    if (typeof value !== 'boolean') {
      logger.error('set closed', `Attempted to set invalid closed value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("Closed value must be a boolean.");
    }

    this._isClosed = value;
    logger.groupEnd('set closed');
  }

  // Transactions

  /** Gets the transactions for the account.
   * @type {Array<Transaction>}
   */
  get transactions() {
    return Array.from(this._transactions.values());
  }
  /** Gets the number of transactions for the account.
   * @type {number}
   */
  get transactionCount() {
    return this._transactions.size;
  }
  /** Sets the transactions for the account.
   * @param {Array<Transaction>} transactions - Array of Transaction instances to set for the account.
   * @throws Will throw an error if the input is not a valid array of Transaction objects.
   */
  set transactions(transactions) {
    logger.group('set transactions');
    if (!Array.isArray(transactions)) {
      logger.error('set transactions', `Attempted to set invalid transactions for account ID: '${this.id}'. Type '${typeof transactions}'. Transactions: '${transactions}'`);
      logger.groupEnd('set transactions');
      throw new Error("Transactions must be an array of Transaction objects.");
    }

    transactions.forEach(txn => this._transactions.set(txn.id, txn));
    logger.groupEnd('set transactions');
  }
  /** Adds a transaction to the account.
   * @param {Transaction} transaction - The transaction to add.
   * @throws Will throw an error if the input is not a valid Transaction object.
   */
  addTransaction(transaction) {
    logger.group('addTransaction');
    if (!(transaction instanceof Transaction)) {
      logger.error('addTransaction', `Attempted to add invalid transaction to account ID: '${this.id}', Transaction: ${transaction}`);
      logger.groupEnd('addTransaction');
      return new Error(`Invalid transaction object for account ID: '${this.id}':`, transaction);
    }

    logger.debug('addTransaction', `Adding transaction ID '${transaction.id}' to account ID '${this.id}'`);
    this._transactions.set(transaction.id, transaction);
    logger.groupEnd('addTransaction');
  }

  // Budget

  get isOnBudget() {
    return this._isOnBudget;
  }

  set isOnBudget(value) {
    logger.group('set isOnBudget');
    if (typeof value !== 'boolean') {
      logger.error('set isOnBudget', `Attempted to set invalid isOnBudget value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isOnBudget value must be a boolean.");
    }

    this._isOnBudget = value;
    logger.groupEnd('set isOnBudget');
  }

  // Note

  /** Sets the note for the account.
   * @param {string|null} value - The new note value.
   * @throws Will throw an error if the value is not a string or null.
   */
  set note(value) {
    logger.group('set note');
    if (value !== null && typeof value !== 'string') {
      logger.error('set note', `Attempted to set invalid note value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("Note value must be a string or null.");
    }

    this._note = value;
    logger.groupEnd('set note');
  }

  // Debt

  /** Sets the original balance for the debt.
   * @param {number|null} value - The new original balance.
   * @throws Will throw an error if the value is not a number or null.
   */
  set debtOriginalBalance(value) {
    logger.group('set debtOriginalBalance');
    if (value !== null && typeof value !== 'number') {
      logger.error('set debtOriginalBalance', `Attempted to set invalid debtOriginalBalance value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("debtOriginalBalance value must be a number or null.");
    }

    this._debtOriginalBalance = value;
    logger.groupEnd('set debtOriginalBalance');
  }
  /** Sets the interest rates for the debt.
   * @param {object|null} value - The new interest rates.
   * @throws Will throw an error if the value is not an object or null.
   */
  set debtInterestRates(value) {
    logger.group('set debtInterestRates');
    if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
      logger.error('set debtInterestRates', `Attempted to set invalid debtInterestRates value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("debtInterestRates value must be an object or null.");
    }

    this._debtInterestRates = value;
    logger.groupEnd('set debtInterestRates');
  }
  /** Sets the minimum payments for the debt.
   * @param {object|null} value - The new minimum payments.
   * @throws Will throw an error if the value is not an object or null.
   */
  set debtMinimumPayments(value) {
    logger.group('set debtMinimumPayments');
    if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
      logger.error('set debtMinimumPayments', `Attempted to set invalid debtMinimumPayments value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("debtMinimumPayments value must be an object or null.");
    }

    this._debtMinimumPayments = value;
    logger.groupEnd('set debtMinimumPayments');
  }
  /** Sets the escrow amounts for the debt.
   * @param {object|null} value - The new escrow amounts.
   * @throws Will throw an error if the value is not an object or null.
   */
  set debtEscrowAmounts(value) {
    logger.group('set debtEscrowAmounts');
    if (value !== null && (typeof value !== 'object' || Array.isArray(value))) {
      logger.error('set debtEscrowAmounts', `Attempted to set invalid debtEscrowAmounts value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("debtEscrowAmounts value must be an object or null.");
    }

    this._debtEscrowAmounts = value;
    logger.groupEnd('set debtEscrowAmounts');
  }

  // Transfers

  /** Sets the transfer payee ID.
   * @param {string|null} value - The new transfer payee ID.
   * @throws Will throw an error if the value is not a string or null.
   */
  set transferPayeeId(value) {
    logger.group('set transferPayeeId');
    if (value !== null && typeof value !== 'string') {
      logger.error('set transferPayeeId', `Attempted to set invalid transferPayeeId value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("transferPayeeId value must be a string or null.");
    }

    this._transferPayeeId = value;
    logger.groupEnd('set transferPayeeId');
  }

  // Direct Import

  /** Sets whether the account is linked for direct import.
   * @param {boolean} value - The new direct import linked status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isDirectImportLinked(value) {
    logger.group('set isDirectImportLinked');
    if (typeof value !== 'boolean') {
      logger.error('set isDirectImportLinked', `Attempted to set invalid isDirectImportLinked value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isDirectImportLinked value must be a boolean.");
    }

    this._isDirectImportLinked = value;
    logger.groupEnd('set isDirectImportLinked');
  }
  /** Gets whether the account is linked for direct import.
   * @type {boolean}
   */
  get isDirectImportLinked(){
    return this._isDirectImportLinked;
  }

  /** Sets whether the account is in direct import error.
   * @param {boolean} value - The new direct import error status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isDirectImportOnError(value) {
    logger.group('set isDirectImportOnError');
    if (typeof value !== 'boolean') {
      logger.error('set isDirectImportOnError', `Attempted to set invalid isDirectImportOnError value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isDirectImportOnError value must be a boolean.");
    }

    this._isDirectImportOnError = value;
    logger.groupEnd('set isDirectImportOnError');
  }

  // Reconciled

  /** Sets the last reconciled date/time.
   * @param {Date|null} value - The new last reconciled date/time.
   * @throws Will throw an error if the value is not a Date object or null.
   */
  set lastReconciledAt(value) {
    logger.group('set lastReconciledAt');
    if (value !== null && !(value instanceof Date)) {
      logger.error('set lastReconciledAt', `Attempted to set invalid lastReconciledAt value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("lastReconciledAt value must be a Date object or null.");
    }

    this._lastReconciledAt = value;
    logger.groupEnd('set lastReconciledAt');
  }

  // YNAB Closed

  /** Gets whether the YNAB account is closed.
   * @type {boolean}
   */
  get isYnabClosed() {
    return this._isYnabClosed;
  }
  /** Sets whether the YNAB account is closed.
   * @param {boolean} value - The new closed status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isYnabClosed(value) {
    logger.group('set isYnabClosed');
    if (typeof value !== 'boolean') {
      logger.error('set isYnabClosed', `Attempted to set invalid isYnabClosed value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isYnabClosed value must be a boolean.");
    }

    this._isYnabClosed = value;
    logger.groupEnd('set isYnabClosed');
  }

  // Monarch Closed

  /** Gets whether the Monarch account is closed.
   * @type {boolean}
   */
  get isMonarchClosed() {
    return this._isMonarchClosed;
  }
  /** Sets whether the Monarch account is closed.
   * @param {boolean} value - The new closed status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isMonarchClosed(value) {
    logger.group('set isMonarchClosed');
    if (typeof value !== 'boolean') {
      logger.error('set isMonarchClosed', `Attempted to set invalid isMonarchClosed value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isMonarchClosed value must be a boolean.");
    }

    this._isMonarchClosed = value;
    logger.groupEnd('set isMonarchClosed');
  }

  // Deleted

  /** Gets whether the account is deleted.
   * @type {boolean}
   */
  get isDeleted() {
    return this._isDeleted;
  }
  /** Sets whether the account is deleted.
   * @param {boolean} value - The new deleted status.
   * @throws Will throw an error if the value is not a boolean.
   */
  set isDeleted(value) {
    logger.group('set isDeleted');
    if (typeof value !== 'boolean') {
      logger.error('set isDeleted', `Attempted to set invalid isDeleted value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("isDeleted value must be a boolean.");
    }

    this._isDeleted = value;
    logger.groupEnd('set isDeleted');
  }

  // Modifications

  /** Gets whether the account has been modified.
   * @type {boolean}
   */
  get isModified() {
    const methodName = 'get isModified';
    logger.group(methodName);
    const hasNameChanged = this._ynabName !== this._monarchName;
    const hasTypeChanged = this._ynabType !== this._ynabOriginalType;
    const hasSubtypeChanged = this._subtype !== this._originalSubtype;
    const modified = hasNameChanged || hasTypeChanged || hasSubtypeChanged;
    logger.debug(methodName, `Account ID: '${this.id}', isModified: '${modified}'`);
    logger.groupEnd(methodName);
    return modified;
  }
  /** Sets whether the account has been modified.
   * @param {boolean} value
   */
  set isModified(value) {
    logger.group('set modified');
    if (typeof value !== 'boolean') {
      logger.error('set modified', `Attempted to set invalid modified value for account ID: '${this.id}', Value: '${value}'`);
      throw new Error("Modified value must be a boolean.");
    }

    this._isModified = value;
    logger.groupEnd('set modified');
  }
  /** Undoes any changes made to the account, reverting to the original state.
   * @returns {Promise<void>}
   * @throws Will throw an error if unable to update the database.
   */
  async undoChanges() {
    logger.group('undoChanges');
    this._ynabName = this._monarchName;
    this._category = this._originalCategory;
    this._categoryGroup = this._originalCategoryGroup;
    this._isModified = false;

    await db.updateAccountModification(this.id, {
      name: this._ynabName,
      type: this._category,
      subtype: this._categoryGroup,
      modified: this._isModified
    });

    logger.groupEnd('undoChanges');
  }

  // Database

  /** Synchronizes the modifications of the account with the database.
   * @returns {Promise<void>}
   * @throws Will throw an error if the account is not found in the database.
   */
  async syncDbModifications() {
    logger.group('syncDbModifications');
    const accountInDb = await db.getAccount(this.id);
    if (!accountInDb) {
      logger.error('syncDbModifications', `Account ID '${this.id}' not found in database; cannot sync modifications.`);
      logger.groupEnd('syncDbModifications');
      throw new Error(`Account ID '${this.id}' not found in database.`);
    }

    const modifications = {};

    if (this._ynabName !== this._monarchName && this._ynabName !== accountInDb.name) {
      modifications.name = this._ynabName;
    }
    if (this._ynabType !== this._ynabOriginalType && this._ynabType !== accountInDb.type) {
      modifications.type = this._ynabType;
    }
    if (this._subtype !== this._originalSubtype && this._subtype !== accountInDb.subtype) {
      modifications.subtype = this._subtype;
    }

    if (Object.keys(modifications).length > 0) {
      if (this._isModified === false) {
        modifications.modified = true;
        this._isModified = true;
      }
    } else {
      if (this._isModified === true) {
        modifications.modified = false;
        this._isModified = false;
      }
    }

    // Non-modification fields
    modifications.included = this._isIncluded;
    modifications.selected = this._isSelected;

    if (Object.keys(modifications).length > 0) {
      logger.debug('syncDbModifications', `Updating account ID '${this.id}' with modifications:`, modifications);
      await db.updateAccountModification(this.id, modifications);
    } else {
      logger.debug('syncDbModifications', `No modifications to sync for account ID '${this.id}'`);
    }

    logger.groupEnd('syncDbModifications');
  }

  /** Initializes the account from API data.
   * @param {object} data - The API data object.
   */
  initFromApiData(data) {
    console.warn("Account initFromApiData, data:", data);
    this.ynabName = data["name"];
    this.monarchName = data["name"];
    this.ynabType = data["type"];
    this.isOnBudget = data["on_budget"];
    this.note = data["note"];
    this.balance = centsToDollars(data["balance"]);
    this.clearedBalance = centsToDollars(data["cleared_balance"]);
    this.unclearedBalance = centsToDollars(data["uncleared_balance"]);
    this.transferPayeeId = data["transfer_payee_id"];
    this.isDirectImportLinked = data["direct_import_linked"];
    this.isDirectImportOnError = data["direct_import_in_error"];
    this.lastReconciledAt = parseDate(data["last_reconciled_at"]);
    this.debtOriginalBalance = data["debt_original_balance"];
    this.debtInterestRates = data["debt_interest_rates"];
    this.debtMinimumPayments = data["debt_minimum_payments"];
    this.debtEscrowAmounts = data["debt_escrow_amounts"];
    this.isYnabClosed = data["closed"];
    this.isMonarchClosed = data["closed"];
    this.isUserApproved = false;
  }

  // Serialization

  toObject() {
    const serialized = {};

    Object.entries(this).forEach(([key, value]) => {
      const normalizedKey = key.startsWith('_') ? key.slice(1) : key;
      serialized[normalizedKey] = this._serializeForStorage(normalizedKey, value);
    });

    return serialized;
  }

  _serializeForStorage(key, value) {
    if (value instanceof Map) {
      if (key === 'transactions') {
        return Array.from(value.values()).map(txn => (txn && typeof txn === 'object' && 'id' in txn ? txn.id : txn));
      }
      return Array.from(value.entries());
    }

    if (value instanceof Set) {
      return Array.from(value);
    }

    return value;
  }
}
