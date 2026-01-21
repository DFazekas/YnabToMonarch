import parseDate from '../utils/date.js';
import generateId from '../utils/idGenerator.js'
import { parseCurrencyToCents, centsToDollars } from '../utils/currency.js';
import getLogger, { setLoggerConfig } from '../utils/logger.js';
import { TransactionClearedStatus, TransactionClearedStatusValues } from '../utils/enumTransactionClearedStatus.js';
import { FlagColor, FlagColorValues } from '../utils/enumFlagColor.js';
import { TransactionType, TransactionTypeValues } from '../utils/enumTransactionType.js';


const txnLogger = getLogger('Transaction');

setLoggerConfig({
  namespaces: { Transaction: false },
  methods: {},
  levels: { debug: true, group: true, groupEnd: true },
});

export default class Transaction {
  constructor(id = null) {
    /** Unique identifier for the transaction.
     * @type {string}
    */
    this.id = id || generateId();

    /** Represents the date of the transaction in YYYY-MM-DD format. 
     * @type {Date|null}
    */
    this._date = null;

    /** Represents the transaction amount in dollars. 
     * @type {float}
    */
    this._amountDollars = 0.00;

    /** Represents the memo for the transaction.
     * @type {string|null}
    */
    this._memo = null;

    /** Cleared status of the transaction.
     * @type {TransactionClearedStatus}
    */
    this._clearedStatus = TransactionClearedStatus.CLEARED;

    /** Approval status of the transaction.
     * @type {boolean}
    */
    this._isApproved = true;

    /** The color of the flag. 
     * @type {FlagColor|null}
    */
    this._flagColor = null;

    /** Represents the flag name of the transaction.
     * @type {string|null}
    */
    this._flagName = null;

    /** The account ID associated with the transaction. 
     * @type {string|null}
     */
    this._accountId = null;

    /** Represents the payee for the transaction. 
     * @type {string|null}
    */
    this._payeeId = null;

    /** Represents the category for the transaction.
     * @type {string|null}
    */
    this._categoryId = null;

    /** If a transfer transaction, the ID of the account to which this transaction transfers.
     * @type {string|null}
    */
    this._transferAccountId = null;

    /** If a transfer transaction, the ID of the transaction on the other side of the transfer.
     * @type {string|null}
    */
    this._transferTransactionId = null;

    /** If the transaction is a debt/loan account transaction, the type of transaction.
     * @type {TransactionType|null}
     */
    this._debtTransactionType = null;

    /** If a split transaction, the subtransactions.
     * @type {Array<string>}
     */
    this._subtransactionIds = [];
  }

  // Date
  get date() {
    return this._date;
  }
  set date(date) {
    const methodName = 'setDate';
    txnLogger.group(methodName);
    const formattedDate = parseDate(date);
    if (!formattedDate) {
      txnLogger.error(methodName, "Attempted to set invalid date for transaction ID:", this.id, "Input date:", date);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting date to '${formattedDate}'`);
    this._date = formattedDate;
    txnLogger.groupEnd(methodName);
  }

  // Amount
  get amount() {
    return this._amountDollars;
  }
  set amount(amountDollars) {
    const methodName = 'setAmount';
    txnLogger.group(methodName);
    if (typeof amountDollars !== 'number' || isNaN(amountDollars)) {
      txnLogger.error(methodName, "Attempted to set invalid amount for transaction ID:", this.id, "Amount:", amountDollars);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting amount to '${amountDollars}'`);
    this._amountDollars = amountDollars;
    txnLogger.groupEnd(methodName);
  }

  // Memo
  get memo() {
    return this._memo;
  }
  set memo(memo) {
    const methodName = 'setMemo';
    txnLogger.group(methodName);
    const sanitizedMemo = memo?.trim() || null;
    if (!sanitizedMemo || sanitizedMemo.length === 0) {
      txnLogger.debug(methodName, "Setting empty memo for transaction ID:", this.id);
      this._memo = null;
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting memo to '${sanitizedMemo}'`);
    this._memo = sanitizedMemo;
    txnLogger.groupEnd(methodName);
  }

  // Cleared Status
  get clearedStatus() {
    return this._clearedStatus;
  }
  set clearedStatus(status) {
    const methodName = 'setClearedStatus';
    txnLogger.group(methodName);
    const standardizedStatus = status.trim().toLowerCase();

    if (!TransactionClearedStatusValues.includes(standardizedStatus)) {
      txnLogger.warn(methodName, `Attempted to set invalid status for transaction ID: '${this.id}', Status: '${standardizedStatus}'. Valid values are: ${TransactionClearedStatusValues.join(', ')}`);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting status to '${standardizedStatus}'`);
    this._clearedStatus = standardizedStatus;
    txnLogger.groupEnd(methodName);
  }

  // Is Approved
  get isApproved() {
    return this._isApproved;
  }
  set isApproved(isApproved) {
    const methodName = 'setIsApproved';
    txnLogger.group(methodName);
    if (typeof isApproved !== 'boolean') {
      txnLogger.error(methodName, "Attempted to set invalid isApproved value for transaction ID:", this.id, "Value:", isApproved);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting isApproved to '${isApproved}'`);
    this._isApproved = isApproved;
    txnLogger.groupEnd(methodName);
  }

  // Flag Color
  get flagColor() {
    return this._flagColor;
  }
  set flagColor(color) {
    const methodName = 'setFlagColor';
    txnLogger.group(methodName);
    const standardizedColor = color?.trim().toLowerCase() || null;

    if (!standardizedColor) {
      txnLogger.debug(methodName, "Setting empty flag color for transaction ID:", this.id);
      this._flagColor = null;
      txnLogger.groupEnd(methodName);
      return;
    }
    if (!FlagColorValues.includes(standardizedColor)) {
      txnLogger.warn(methodName, `Attempted to set invalid flag color for transaction ID: '${this.id}', Color: '${standardizedColor}'. Valid values are: ${FlagColorValues.join(', ')}`);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting flag color to '${standardizedColor}'`);
    this._flagColor = standardizedColor;
    txnLogger.groupEnd(methodName);
  }

  // Flag Name
  get flagName() {
    return this._flagName;
  }
  set flagName(flagName) {
    const methodName = 'setFlagName';
    txnLogger.group(methodName);
    const sanitizedFlagName = flagName?.trim() || null;
    if (!sanitizedFlagName || sanitizedFlagName.length === 0) {
      txnLogger.debug(methodName, "Setting empty flag name for transaction ID:", this.id);
      this._flagName = null;
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting flag name to '${sanitizedFlagName}'`);
    this._flagName = sanitizedFlagName;
    txnLogger.groupEnd(methodName);
  }

  // Account ID
  
  /** Gets the account ID associated with this transaction.
   * @type {string|null}
   */
  get accountId() {
    return this._accountId;
  }
  /** Sets the account ID associated with this transaction.
   * @param {string|null} accountId
   */
  set accountId(accountId) {
    const methodName = 'setAccountId';
    txnLogger.group(methodName);
    if (!accountId || accountId.trim().length === 0) {
      txnLogger.warn(methodName, "Attempted to set empty account ID for transaction ID:", this.id);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting account ID to '${accountId}'`);
    this._accountId = accountId;
    txnLogger.groupEnd(methodName);
  }

  // Payee ID
  get payeeId() {
    return this._payeeId;
  }
  set payeeId(payeeId) {
    const methodName = 'setPayeeId';
    txnLogger.group(methodName);
    if (!payeeId || payeeId.trim().length === 0) {
      txnLogger.warn(methodName, "Attempted to set empty payee ID for transaction ID:", this.id);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting payee ID to '${payeeId}'`);
    this._payeeId = payeeId;
    txnLogger.groupEnd(methodName);
  }

  // Category ID
  get categoryId() {
    return this._categoryId;
  }
  set categoryId(categoryId) {
    const methodName = 'setCategoryId';
    txnLogger.group(methodName);
    if (!categoryId || categoryId.trim().length === 0) {
      txnLogger.warn(methodName, "Attempted to set empty category ID for transaction ID:", this.id);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting category ID to '${categoryId}'`);
    this._categoryId = categoryId;
    txnLogger.groupEnd(methodName);
  }

  // Transfer Account ID
  get transferAccountId() {
    return this._transferAccountId;
  }
  set transferAccountId(transferAccountId) {
    const methodName = 'setTransferAccountId';
    txnLogger.group(methodName);
    txnLogger.debug(methodName, `Setting transfer account ID to '${transferAccountId}'`);
    this._transferAccountId = transferAccountId;
    txnLogger.groupEnd(methodName);
  }

  // Transfer Transaction ID
  get transferTransactionId() {
    return this._transferTransactionId;
  }
  set transferTransactionId(transferTransactionId) {
    const methodName = 'setTransferTransactionId';
    txnLogger.group(methodName);
    txnLogger.debug(methodName, `Setting transfer transaction ID to '${transferTransactionId}'`);
    this._transferTransactionId = transferTransactionId;
    txnLogger.groupEnd(methodName);
  }

  // Debt Transaction Type
  get debtTransactionType() {
    return this._debtTransactionType;
  }
  set debtTransactionType(type) {
    const methodName = 'setDebtTransactionType';
    txnLogger.group(methodName);
    const standardizedType = type?.trim().toLowerCase() || null;

    if (!standardizedType) {
      txnLogger.debug(methodName, "Setting empty debt transaction type for transaction ID:", this.id);
      this._debtTransactionType = null;
      txnLogger.groupEnd(methodName);
      return;
    }
    if (!TransactionTypeValues.includes(standardizedType)) {
      txnLogger.warn(methodName, `Attempted to set invalid debt transaction type for transaction ID: '${this.id}', Type: '${standardizedType}'. Valid values are: ${TransactionTypeValues.join(', ')}`);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting debt transaction type to '${standardizedType}'`);
    this._debtTransactionType = standardizedType;
    txnLogger.groupEnd(methodName);
  }

  // Subtransaction IDs
  get subtransactionIds() {
    return this._subtransactionIds;
  }
  set subtransactionIds(subtransactionIds) {
    const methodName = 'setSubtransactionIds';
    txnLogger.group(methodName);
    if (!Array.isArray(subtransactionIds)) {
      txnLogger.error(methodName, "Attempted to set invalid subtransaction IDs for transaction ID:", this.id, "Value:", subtransactionIds);
      txnLogger.groupEnd(methodName);
      return;
    }

    txnLogger.debug(methodName, `Setting subtransaction IDs to '${subtransactionIds.join(', ')}'`);
    this._subtransactionIds = subtransactionIds;
    txnLogger.groupEnd(methodName);
  }

  ///// Initializers

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

  initFromApiData(data) {
    this.date = data["date"];
    this.amount = centsToDollars(data["amount"]);
    this.memo = data["memo"];
    this.clearedStatus = data["cleared"];
    this.isApproved = data["approved"];
    this.flagColor = data["flag_color"];
    this.flagName = data["flag_name"];
    this.accountId = data["account_id"];
    this.payeeId = data["payee_id"];
    this.categoryId = data["category_id"];
    this.transferAccountId = data["transfer_account_id"];
    this.transferTransactionId = data["transfer_transaction_id"];
    this.matchedTransactionId = data["matched_transaction_id"];
    this.importId = data["import_id"];
    this.debtTransactionType = data["debt_transaction_type"];
    this.subtransactionIds = data["subtransactions"];
  }

  // Serialization

  toObject() {
    return {
      id: this.id,
      date: this._date,
      amountDollars: this._amountDollars,
      memo: this._memo,
      clearedStatus: this._clearedStatus,
      isApproved: this._isApproved,
      flagColor: this._flagColor,
      flagName: this._flagName,
      accountId: this._accountId,
      payeeId: this._payeeId,
      categoryId: this._categoryId,
      transferAccountId: this._transferAccountId,
      transferTransactionId: this._transferTransactionId,
      debtTransactionType: this._debtTransactionType,
      subtransactionIds: this._subtransactionIds,
    };
  }
}