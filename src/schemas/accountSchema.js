/**
 * Account Schema Definition
 * 
 * Defines the standardized account object structure used across all import methods
 * (OAuth API, ZIP file import, etc.) to ensure consistency with ReusableTable requirements
 * on the Account Review page.
 * 
 * This schema acts as the single source of truth for account data structure throughout
 * the application, ensuring that both OAuth and ZIP import methods produce compatible objects.
 */

/**
 * Transaction object schema
 * Represents a single financial transaction associated with an account.
 * 
 * @typedef {Object} Transaction
 * @property {string} Date - Transaction date in YYYY-MM-DD format
 * @property {string} Merchant - Merchant/payee name
 * @property {string} Category - YNAB category name
 * @property {string} CategoryGroup - YNAB category group name
 * @property {string} Notes - Transaction memo/notes
 * @property {string} Amount - Transaction amount as decimal string (e.g., "123.45", "-50.00")
 * @property {string} Tags - Transaction flags/tags from YNAB
 */

/**
 * Account object schema
 * Represents a complete account with all required properties for the review table.
 * 
 * @typedef {Object} Account
 * 
 * Core Identity Properties:
 * @property {string} id - Unique identifier for the account
 *   - OAuth method: Uses YNAB account ID (UUID)
 *   - ZIP method: Generated using generateId() function
 * @property {string} name - Original account name from YNAB
 * @property {string} modifiedName - User-editable display name (initially same as name)
 * 
 * Account Classification:
 * @property {string} type - Monarch-compatible account type
 *   - Examples: 'depository', 'credit', 'loan', 'investment', 'other_asset', 'other_liability'
 *   - Must match monarchAccountTypes.json type names
 * @property {string|null} subtype - Monarch-compatible account subtype
 *   - Examples: 'checking', 'savings', 'credit_card', 'mortgage', etc.
 *   - Must be valid for the selected type, or null
 * 
 * Transaction Data:
 * @property {Transaction[]} transactions - Array of transaction objects
 *   - Empty array for OAuth method (fetched separately)
 *   - Populated array for ZIP method (extracted from CSV)
 * @property {number} transactionCount - Total number of transactions
 *   - ZIP method: transactions.length
 *   - OAuth method: 0 initially (updated when transactions are fetched)
 * 
 * Financial Data:
 * @property {number} balanceCents - Account balance in cents (integer)
 *   - Used internally for precise calculations
 *   - Example: 12345 represents $123.45
 * @property {number} balance - Account balance in dollars (decimal)
 *   - Derived from balanceCents / 100
 *   - Used for display purposes
 * 
 * UI State Properties:
 * @property {boolean} included - Whether account is included in migration
 *   - true: Account will be migrated to Monarch
 *   - false: Account is excluded from migration
 *   - Default: true (unless transactionCount is 0)
 * @property {boolean} selected - Whether account is currently selected in the table
 *   - Used for bulk operations
 *   - Managed by ReusableTable component
 *   - Default: false
 * @property {string} status - Processing status of the account
 *   - 'unprocessed': Not yet migrated (default)
 *   - 'processed': Successfully migrated to Monarch
 *   - 'failed': Migration failed
 *   - Affects UI rendering and interaction availability
 */

/**
 * Generate a short, pseudo-random unique ID
 * Used by ZIP import method to assign unique identifiers to account objects.
 * 
 * @returns {string} A unique ID string prefixed with "id-"
 * @example
 * generateId(); // Returns: "id-x3k9m2p"
 */
export function generateId() {
  return 'id-' + Math.random().toString(36).slice(2, 11);
}

/**
 * Create a standardized account object from OAuth API data
 * Transforms YNAB OAuth API response into the canonical account schema.
 * 
 * @param {Object} ynabAccount - Raw account object from YNAB API
 * @param {string} ynabAccount.id - YNAB account ID (UUID)
 * @param {string} ynabAccount.name - Account name
 * @param {number} ynabAccount.balance - Balance in milliunits (1000 = $1.00)
 * @param {string} ynabAccount.type - YNAB account type
 * @param {boolean} [ynabAccount.deleted=false] - Whether account is deleted
 * @param {string|null} [inferredType] - Optional pre-inferred Monarch type
 * @param {string|null} [inferredSubtype] - Optional pre-inferred Monarch subtype
 * @returns {Account} Standardized account object
 * 
 * @example
 * const rawAccount = {
 *   id: 'abc-123-def',
 *   name: 'My Checking',
 *   balance: 123450, // $123.45 in milliunits
 *   type: 'checking'
 * };
 * const account = createAccountFromOauth(rawAccount);
 */
export function createAccountFromOauth(ynabAccount, inferredType = null, inferredSubtype = null) {
  // YNAB API returns balance in milliunits (1000 = $1.00)
  // Convert to cents: divide by 10 (10000 milliunits = 1000 cents = $10.00)
  const balanceCents = Math.round(ynabAccount.balance / 10);
  const balanceDollars = balanceCents / 100;

  return {
    // Core Identity
    id: ynabAccount.id,
    name: ynabAccount.name.trim(),
    modifiedName: ynabAccount.name.trim(),

    // Account Classification
    type: inferredType || ynabAccount.type || 'depository',
    subtype: inferredSubtype || null,

    // Transaction Data
    transactions: [],
    transactionCount: 0,

    // Financial Data
    balanceCents: balanceCents,
    balance: balanceDollars,

    // UI State
    included: true,
    selected: false,
    status: 'unprocessed'
  };
}

/**
 * Create a standardized account object from ZIP file CSV data
 * Transforms parsed CSV data into the canonical account schema.
 * 
 * @param {string} accountName - Account name from CSV
 * @param {Transaction[]} transactions - Array of parsed transactions
 * @param {string} inferredType - Inferred Monarch account type
 * @param {string} inferredSubtype - Inferred Monarch account subtype
 * @param {number} balanceCents - Calculated balance in cents
 * @returns {Account} Standardized account object
 * 
 * @example
 * const transactions = [
 *   { Date: '2024-01-15', Merchant: 'Store', Amount: '-50.00', ... },
 *   { Date: '2024-01-16', Merchant: 'Paycheck', Amount: '1000.00', ... }
 * ];
 * const account = createAccountFromCsv(
 *   'My Checking',
 *   transactions,
 *   'depository',
 *   'checking',
 *   95000 // $950.00
 * );
 */
export function createAccountFromCsv(accountName, transactions, inferredType, inferredSubtype, balanceCents) {
  const balanceDollars = balanceCents / 100;
  const transactionCount = transactions.length;

  return {
    // Core Identity
    id: generateId(),
    name: accountName,
    modifiedName: accountName,

    // Account Classification
    type: inferredType,
    subtype: inferredSubtype,

    // Transaction Data
    transactions: transactions,
    transactionCount: transactionCount,

    // Financial Data
    balanceCents: balanceCents,
    balance: balanceDollars,

    // UI State
    included: transactionCount > 0, // Only include accounts with transactions
    selected: false,
    status: 'unprocessed'
  };
}

/**
 * Validate account object against schema
 * Ensures an account object contains all required properties with correct types.
 * 
 * @param {Object} account - Account object to validate
 * @returns {{valid: boolean, errors: string[]}} Validation result
 * 
 * @example
 * const result = validateAccount(myAccount);
 * if (!result.valid) {
 *   console.error('Validation errors:', result.errors);
 * }
 */
export function validateAccount(account) {
  const errors = [];

  // Required string properties
  const requiredStrings = ['id', 'name', 'modifiedName', 'type', 'status'];
  for (const prop of requiredStrings) {
    if (typeof account[prop] !== 'string' || account[prop].length === 0) {
      errors.push(`Missing or invalid required string property: ${prop}`);
    }
  }

  // Subtype can be string or null
  if (account.subtype !== null && typeof account.subtype !== 'string') {
    errors.push('Property "subtype" must be a string or null');
  }

  // Required number properties
  const requiredNumbers = ['transactionCount', 'balanceCents', 'balance'];
  for (const prop of requiredNumbers) {
    if (typeof account[prop] !== 'number' || isNaN(account[prop])) {
      errors.push(`Missing or invalid required number property: ${prop}`);
    }
  }

  // Required boolean properties
  const requiredBooleans = ['included', 'selected'];
  for (const prop of requiredBooleans) {
    if (typeof account[prop] !== 'boolean') {
      errors.push(`Missing or invalid required boolean property: ${prop}`);
    }
  }

  // Transactions must be an array
  if (!Array.isArray(account.transactions)) {
    errors.push('Property "transactions" must be an array');
  }

  // Status must be valid value
  const validStatuses = ['unprocessed', 'processed', 'failed'];
  if (!validStatuses.includes(account.status)) {
    errors.push(`Property "status" must be one of: ${validStatuses.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors: errors
  };
}

/**
 * Create empty account collection
 * Returns an empty object ready to store accounts keyed by their ID.
 * 
 * @returns {Object.<string, Account>} Empty accounts collection
 * 
 * @example
 * const accounts = createAccountCollection();
 * accounts[myAccount.id] = myAccount;
 */
export function createAccountCollection() {
  return {};
}

/**
 * Add account to collection
 * Safely adds an account to the accounts collection after validation.
 * 
 * @param {Object.<string, Account>} collection - Accounts collection
 * @param {Account} account - Account to add
 * @returns {{success: boolean, errors?: string[]}} Operation result
 * 
 * @example
 * const result = addAccountToCollection(accounts, myAccount);
 * if (result.success) {
 *   console.log('Account added successfully');
 * }
 */
export function addAccountToCollection(collection, account) {
  const validation = validateAccount(account);
  
  if (!validation.valid) {
    return {
      success: false,
      errors: validation.errors
    };
  }

  collection[account.id] = account;
  
  return {
    success: true
  };
}

/**
 * Default account template
 * Provides a template object showing all required properties with their default values.
 * Useful for documentation and testing purposes.
 */
export const DEFAULT_ACCOUNT_TEMPLATE = {
  // Core Identity
  id: '',
  name: '',
  modifiedName: '',

  // Account Classification
  type: 'depository',
  subtype: 'checking',

  // Transaction Data
  transactions: [],
  transactionCount: 0,

  // Financial Data
  balanceCents: 0,
  balance: 0.00,

  // UI State
  included: true,
  selected: false,
  status: 'unprocessed'
};
