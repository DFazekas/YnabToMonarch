import Papa from 'papaparse';
import JSZip from 'jszip';
import generateId from '../utils/idGenerator.js'
import Accounts from '../schemas/accounts.js';
import Account from '../schemas/account.js';
import Transaction from '../schemas/transaction.js';
import getLogger, { setLoggerConfig } from '../utils/logger.js';
import monarchAccountTypes from '../../public/static-data/monarchAccountTypes.json' assert { type: 'json' };

const parserLogger = getLogger('YnabParser');
setLoggerConfig({
  levels: { log: true, debug: true, group: true, groupEnd: true },
  namespaces: { YnabParser: true, parseCSV: true, parseYnabAccountApi: true },
});

/**
 * Attempt to infer Monarch-compatible account type and subtype based on account name.
 * 
 * YNAB CSV does not provide Account type information, only Transaction category and category-group.
 * This function matches the account name against known Monarch Money account types and subtypes.
 * If no strong match is found, returns { type: null, subtype: null }.
 * 
 * @example "YNAB Account Name 'Scotiabank Debit' -> { type: 'depository', subtype: 'checking' }"
 * 
 * @param {string} accountName - The name of the account (e.g., "My Checking Account").
 * @returns {{ type: string|null, subtype: string|null }} The inferred type and subtype, or null if no match found.
 */
function inferMonarchType(accountName) {
  if (!accountName || typeof accountName !== 'string') {
    return { type: null, subtype: null };
  }

  const lowered = accountName.toLowerCase();
  const matches = [];

  // Build keyword map from reference data
  if (monarchAccountTypes && monarchAccountTypes.data) {
    for (const accountTypeGroup of monarchAccountTypes.data) {
      const typeName = accountTypeGroup.typeName;
      const typeDisplay = accountTypeGroup.typeDisplay?.toLowerCase();

      for (const subtype of accountTypeGroup.subtypes) {
        const subtypeName = subtype.name;
        const subtypeDisplay = subtype.display?.toLowerCase();

        // Check for exact or partial matches in the account name
        if (typeDisplay && lowered.includes(typeDisplay)) {
          matches.push({ type: typeName, subtype: subtypeName, score: 10 });
        }
        if (subtypeDisplay && lowered.includes(subtypeDisplay)) {
          matches.push({ type: typeName, subtype: subtypeName, score: 15 });
        }
        if (lowered.includes(subtypeName.replace(/_/g, ' '))) {
          matches.push({ type: typeName, subtype: subtypeName, score: 12 });
        }
      }
    }

    // Return highest scoring match
    if (matches.length > 0) {
      const best = matches.sort((a, b) => b.score - a.score)[0];
      parserLogger.debug('inferMonarchType', `Matched '${accountName}' to type:'${best.type}', subtype:'${best.subtype}'`);
      return { type: best.type, subtype: best.subtype };
    }
  }

  // No match found
  parserLogger.debug('inferMonarchType', `No strong match for '${accountName}', returning null`);
  return { type: null, subtype: null };
}

/**
 * Parses a YNAB CSV file embedded inside a ZIP archive and transforms it into a structure
 * compatible with Monarch Money account import. Automatically detects and extracts the CSV.
 * 
 * @param {File|Blob} zipFile - A ZIP file uploaded by the user (exported from YNAB).
 * @returns {Promise<Object>} Parsed and structured account data with transaction lists.
 */
export default async function parseYNABCSV(zipFile) {
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
  return parseCSV(csvContent)
}

/**
 * Parses a raw CSV string and transforms it into structured account and transaction data.
 * 
 * @param {string} csvContent - The content of the YNAB register CSV.
 * @returns {Promise<Accounts>} A mapping of account names to account metadata and transactions.
 */
function parseCSV(csvContent) {
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
        // TODO: Remove tempCount limit after testing
        let tempCount = 0;
        for (const txnData of data) {
          if (tempCount >= 20) break;
          parserLogger.group('ProcessingRow', txnData);
          try {
            // Create or get existing Account instance
            let account = accounts.getByName(txnData['Account']);
            if (account === null) {
              const { type: monarchType, subtype: monarchSubtype } = inferMonarchType(txnData['Account']);
              parserLogger.debug('ProcessingRow', `Inferred Monarch type for account '${txnData['Account']}': Type '${monarchType}', Subtype '${monarchSubtype}'`);

              account = new Account(generateId());
              account.initFromCsv(txnData, monarchType, monarchSubtype);
              accounts.add(account);
            }

            // TODO: Handle transfer between accounts. Be mindful, recipient account may not have been created yet.

            // TODO: Handle reconcilation transactions that don't have a payee, category, or category group; they're just for balance adjustments.

            // Create transaction instance
            const transaction = new Transaction();
            transaction.init(txnData);
            account.addToBalance(transaction.amount);

            // Append transaction
            account.addTransaction(transaction);
            accounts.addTransaction(transaction.id);

            parserLogger.groupEnd('ProcessingRow');
          } catch (err) {
            parserLogger.error('ProcessingRow', "❌ Error processing row:", txnData, err);
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

  parserLogger.log('parseYnabAccountApi', 'YNAB API accounts count:', data.length);
  const accounts = new Accounts();

  for (const row of data) {
    const account = new Account(row["id"]);
    account.initFromApiData(row);
    accounts.add(account);
  }

  parserLogger.log('parseYnabAccountApi', 'Parsed accounts count:', accounts.length());
  parserLogger.groupEnd('parseYnabAccountApi');
  return accounts;
}