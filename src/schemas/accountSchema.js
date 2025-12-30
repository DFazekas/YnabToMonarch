
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
