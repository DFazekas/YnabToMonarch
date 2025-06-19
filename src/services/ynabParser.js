import Papa from 'papaparse';
import JSZip from 'jszip';

/**
 * Generate a short, pseudo-random unique ID.
 * Used to assign unique identifiers to account objects.
 * 
 * @returns {string} A unique ID string prefixed with "id-".
 */
function generateId() {
  return 'id-' + Math.random().toString(36).slice(2, 11);
}

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
              id: generateId(),
              name: accountName,
              modifiedName: accountName,
              type,         // Monarch compatible type (ex: 'depository')
              subtype,      // Monarch compatible subtype (ex: 'checking')
              transactions: [],
              transactionCount: 0,
              balanceCents: 0,
              included: true,
              selected: false,
              status: 'unprocessed',
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
          account.transactionCount += 1;
          account.balanceCents += netCents;
        };

        for (const account of accounts.values()) {
          account.balance = account.balanceCents / 100;
          account.included = account.transactionCount > 0;
        };

        console.groupEnd("parseCSV");
        resolve(Object.fromEntries(accounts));
      },
      error: (err) => reject(err)
    });
  });
}
