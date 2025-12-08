import Papa from 'papaparse';
import JSZip from 'jszip';
import { createAccountFromOauth, createAccountFromCsv, createAccountCollection, addAccountToCollection } from '../schemas/accountSchema.js';

/**
 * Convert a currency-formatted string (e.g., "$1,234.56") into an integer value in cents.
 *
 * @param {string} str - The currency string to parse.
 * @returns {number} Amount in cents (e.g., 123456) or 0 if invalid.
 */
function parseCurrencyToCents(str) {
  if (!str) return 0;
  const normalized = str.replace(/[^0-9.-]+/g, '').trim();
  const floatVal = parseFloat(normalized);
  return isNaN(floatVal) ? 0 : Math.round(floatVal * 100);
}

/**
 * Attempt to infer Monarch-compatible account type and subtype based on account name.
 * 
 * @param {string} accountName - The name of the account (e.g., "My Checking Account").
 * @returns {{ type: string, subtype: string }} The inferred type and subtype.
 */
function inferMonarchType(accountName) {
  const lowered = accountName.toLowerCase();

  // Attempt simple keyword detection
  if (lowered.includes("credit")) {
    return { type: 'credit', subtype: 'credit_card' };
  }

  if (lowered.includes("loan") || lowered.includes("mortgage") || lowered.includes("student loan")) {
    return { type: 'loan', subtype: 'loan' };
  }

  if (lowered.includes("savings")) {
    return { type: 'depository', subtype: 'savings' };
  }

  if (lowered.includes("checking") || lowered.includes("debit")) {
    return { type: 'depository', subtype: 'checking' };
  }

  // Default fallback to Monarch's "Cash -> Checking"
  return { type: 'depository', subtype: 'checking' };
}

/**
 * Parses a YNAB CSV file embedded inside a ZIP archive and transforms it into a structure
 * compatible with Monarch Money account import. Automatically detects and extracts the CSV.
 * 
 * @param {File|Blob} zipFile - A ZIP file uploaded by the user (exported from YNAB).
 * @param {Object} monarchAccountTypes - Optional pre-supplied account type hints.
 * @returns {Promise<Object>} Parsed and structured account data with transaction lists.
 */
export default async function parseYNABCSV(zipFile, monarchAccountTypes) {
  console.group("parseYNABCSV");
  const zip = await JSZip.loadAsync(zipFile);
  const targetFile = Object.keys(zip.files).find(name => name.toLowerCase().includes('register') && name.toLowerCase().endsWith('.csv'));

  if (!targetFile) {
    console.error("❌ No register CSV found in the ZIP file");
    console.groupEnd("parseYNABCSV");
    throw new Error("No register CSV found in the ZIP file");
  }

  const csvContent = await zip.files[targetFile].async('string');
  console.groupEnd("parseYNABCSV");
  return parseCSV(csvContent, monarchAccountTypes)
}

/**
 * Parses a raw CSV string and transforms it into structured account and transaction data.
 * 
 * @param {string} csvContent - The content of the YNAB register CSV.
 * @param {Object} monarchAccountTypes - Optional mapping to assist with type inference.
 * @returns {Promise<Object>} A mapping of account names to account metadata and transactions.
 */
function parseCSV(csvContent, monarchAccountTypes) {
  console.group("parseCSV");
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: ({ data }) => {
        if (!data || data.length === 0) {
          console.groupEnd("parseCSV");
          return reject(new Error("❌ CSV file appears to be empty or invalid."));
        }

        const accounts = new Map();

        for (const row of data) {
          const accountName = row['Account']?.trim();
          if (!accountName) {
            console.warn("❌ Skipping row with missing account name:", row);
            continue;
          }

          // Convert date: MM/DD/YYYY → YYYY-MM-DD
          if (row['Date']) {
            const [mm, dd, yyyy] = row['Date'].split('/');
            if (mm && dd && yyyy) {
              row['Date'] = `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
            }
          }

          const inflowCents = parseCurrencyToCents(row['Inflow']);
          const outflowCents = parseCurrencyToCents(row['Outflow']);
          const netCents = inflowCents - outflowCents;

          if (inflowCents > 0) {
            row.Amount = (inflowCents / 100).toFixed(2);
          } else if (outflowCents > 0) {
            row.Amount = (-outflowCents / 100).toFixed(2);
          } else {
            row.Amount = '0.00';
          }

          if (!accounts.has(accountName)) {
            const { type, subtype } = inferMonarchType(accountName, monarchAccountTypes);

            accounts.set(accountName, {
              type,
              subtype,
              transactions: [],
              balanceCents: 0
            });
          }

          const account = accounts.get(accountName);
          account.transactions.push({
            Date: row.Date,
            Merchant: row.Payee || '',
            Category: row.Category || '',
            'Category Group': row['Category Group'] || '',
            Notes: row.Memo || '',
            Amount: row.Amount,
            Tags: row.Flag || '',
          });
          account.balanceCents += netCents;
        };

        // Convert temporary account data to standardized schema
        const accountCollection = createAccountCollection();
        for (const [accountName, accountData] of accounts.entries()) {
          const standardizedAccount = createAccountFromCsv(
            accountName,
            accountData.transactions,
            accountData.type,
            accountData.subtype,
            accountData.balanceCents
          );
          addAccountToCollection(accountCollection, standardizedAccount);
        };

        console.groupEnd("parseCSV");
        resolve(accountCollection);
      },
      error: (err) => reject(err)
    });
  });
}

export function parseYnabAccountApi(data) {
  console.group("parseYnabAccountApi");
  const accountCollection = createAccountCollection();

  try {
    for (const row of data) {
      console.log("Parsing account:", row['name'], "Balance (milliunits):", row['balance']);
      
      // Infer Monarch type from YNAB type if possible
      const { type, subtype } = inferMonarchType(row['name']);
      
      const standardizedAccount = createAccountFromOauth(
        row,
        type,
        subtype
      );
      
      addAccountToCollection(accountCollection, standardizedAccount);
    }
  } catch (err) {
    console.error("❌ Error parsing YNAB account API data:", err);
  } finally {
    console.log("Parsed accounts:", accountCollection);
    console.groupEnd();
    return accountCollection;
  }
}