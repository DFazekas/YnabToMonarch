/**
 * Generates a CSV string from a list of transactions for a given account.
 *
 * Each row represents a transaction with columns:
 * Date, Merchant, Category, Account, Original Statement, Notes, Amount, Tags.
 *
 * Fields are wrapped in double quotes and comma-separated for proper CSV formatting.
 *
 * @param {string} accountName - The name of the account to include in the "Account" column.
 * @param {Array<Object>} transactions - An array of transaction objects with fields:
 *   - Date {string}
 *   - Merchant {string}
 *   - Category {string}
 *   - Notes {string}
 *   - Amount {string|number}
 *   - Tags {string}
 *
 * @returns {string} - A well-formed CSV string including headers and all transaction rows.
 */
export default function generateCSV(accountName, transactions) {
  const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`;
  const rows = transactions.map(tx =>
    `"${tx.Date}","${tx.Merchant}","${tx.Category}","${accountName}","","${tx.Notes}","${tx.Amount}","${tx.Tags}"`
  );
  return [headers, ...rows].join('\n');
}
