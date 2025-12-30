import Papa from 'papaparse';
import JSZip from 'jszip';
import { createAccountFromOauth } from '../schemas/accountSchema.js';
import generateId from '../utils/idGenerator.js'
import Accounts, { Account, Transaction } from '../schemas/accounts.js';
import getLogger, {setLoggerConfig} from '../utils/logger.js';

const parserLogger = getLogger('YnabParser');
setLoggerConfig({
  levels: { log: true, debug: true, group: true, groupEnd: true },
  namespaces: { YnabParser: true, parseCSV: true, parseYnabAccountApi: true },
});

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
  const inferred = { type: 'depository', subtype: 'checking' };
  parserLogger.debug('inferMonarchType', 'inferMonarchType:', accountName, '->', inferred);
  return inferred;
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
  parserLogger.group('parseYNABCSV');
  const zip = await JSZip.loadAsync(zipFile);
  parserLogger.log('parseYNABCSV', 'ZIP entries:', Object.keys(zip.files).length);
  const targetFile = Object.keys(zip.files).find(name => name.toLowerCase().includes('register') && name.toLowerCase().endsWith('.csv'));

  if (!targetFile) {
    parserLogger.error('parseYNABCSV', "❌ No register CSV found in the ZIP file");
    parserLogger.groupEnd('parseYNABCSV');
    throw new Error("No register CSV found in the ZIP file");
  }

  const csvContent = await zip.files[targetFile].async('string');
  parserLogger.log('parseYNABCSV', 'Selected CSV file:', targetFile, 'size:', csvContent.length);
  parserLogger.groupEnd('parseYNABCSV');
  return parseCSV(csvContent, monarchAccountTypes)
}

/**
 * Parses a raw CSV string and transforms it into structured account and transaction data.
 * 
 * @param {string} csvContent - The content of the YNAB register CSV.
 * @param {Object} monarchAccountTypes - Optional mapping to assist with type inference.
 * @returns {Promise<Accounts>} A mapping of account names to account metadata and transactions.
 */
function parseCSV(csvContent, monarchAccountTypes) {
  parserLogger.group('parseCSV');
  parserLogger.log('parseCSV', 'CSV content length:', csvContent?.length || 0);
  return new Promise((resolve, reject) => {
    Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true,
      complete: async ({ data }) => {
        if (!data || data.length === 0) {
          parserLogger.groupEnd('parseCSV');
          return reject(new Error("❌ CSV file appears to be empty or invalid."));
        }

        parserLogger.log('parseCSV', 'Parsed CSV rows:', data.length);
        const accounts = new Accounts();

        // Each row represents a transaction, which are grouped by account
        let tempCount = 0;
        for (const row of data) {
          if (tempCount >= 20) break;
          parserLogger.group('ProcessingRow', row);
          try {
            // TODO: Figure out why the accounts are not being merged.

            // Create or get existing Account instance
            let account = accounts.getByName(row['Account']);
            const accountSnapshot = account ? {
              id: account.id,
              name: account._name,
              type: account._type,
              subtype: account._subtype,
              balance: account._balanceDollars,
              transactionCount: account._transactions.size,
            } : null;
            const accountsSnapshot = Array.from(accounts._accounts.values()).map(acc => ({
              id: acc.id,
              name: acc._name,
              type: acc._type,
              subtype: acc._subtype,
              balance: acc._balanceDollars,
              transactionCount: acc._transactions.size,
            }));
            parserLogger.warn('ProcessingRow', 'accounts.getByName snapshot:', accountSnapshot);
            parserLogger.warn('ProcessingRow', 'Current accounts snapshot:', accountsSnapshot);
            if (account === null) {
              const { type, subtype } = inferMonarchType(row['Account'], monarchAccountTypes);

              account = new Account(generateId());
              account.setName(row['Account']);
              account.setType(type);
              account.setSubtype(subtype);

              accounts.add(account);
            }

            // TODO: Handle transfer between accounts. Be mindful, recipient account may not have been created yet.

            // TODO: Handle reconcilation transactions that don't have a payee, category, or category group; they're just for balance adjustments.

            // Create transaction instance
            const transaction = new Transaction();
            transaction.init(row);
            account.addToBalance(transaction.amount);

            // Append transaction
            account.addTransaction(transaction);
            accounts.addTransaction(transaction.id);

            parserLogger.groupEnd('ProcessingRow');
          } catch (err) {
            parserLogger.error('ProcessingRow', "❌ Error processing row:", row, err);
            parserLogger.groupEnd('ProcessingRow');
          }
          tempCount++;
        }

        parserLogger.log('parseCSV', 'Accounts discovered:', accounts.length(), 'Total transactions:', accounts.totalTransactionCount());

        await accounts.saveToDb();

        parserLogger.groupEnd('parseCSV');
        resolve(accounts);
      },
      error: (err) => reject(err)
    });
  });
}

export function parseYnabAccountApi(data) {
  parserLogger.group('parseYnabAccountApi');
  const accountCollection = createAccountCollection();

  try {
    parserLogger.log('parseYnabAccountApi', 'YNAB API accounts count:', data?.length || 0);
    for (const row of data) {
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
    parserLogger.error('parseYnabAccountApi', "❌ Error parsing YNAB account API data:", err);
  } finally {
    parserLogger.log('parseYnabAccountApi', "Parsed accounts collection keys:", Object.keys(accountCollection));
    parserLogger.groupEnd('parseYnabAccountApi');
    return accountCollection;
  }
}