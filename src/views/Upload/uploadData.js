import state from '../../state.js';
import parseYNABZip, { parseYnabAccountApi } from '../../services/ynabParser.js';
import { getAccounts, getTransactions } from '../../api/ynabApi.js';
import { isYnabAuthenticated } from '../../api/ynabTokens.js';

const ZIP_EXTENSIONS = ['.zip', '.bin'];
const ZIP_FILENAME_PATTERNS = ['ynab', 'register', 'export'];
const ZIP_MIME_TYPES = [
  'application/zip',
  'application/x-zip-compressed',
  'application/octet-stream',
  'application/x-zip',
  'multipart/x-zip',
  'application/x-compressed',
  'application/binary'
];
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const MIN_FILE_SIZE = 100; // bytes

/**
 * Validate if file is a ZIP file
 * @param {File} file
 * @throws {Error} If file is invalid
 */
function validateZipFile(file) {
  if (!file) throw new Error('No file provided');
  if (file.size > MAX_FILE_SIZE) throw new Error('File too large');
  if (file.size < MIN_FILE_SIZE) throw new Error('File too small');

  const fileName = file.name.toLowerCase();
  const fileType = file.type.toLowerCase();

  const isZipByExtension = ZIP_EXTENSIONS.some(ext => fileName.endsWith(ext)) ||
    ZIP_FILENAME_PATTERNS.some(pattern => fileName.includes(pattern));

  const isZipByMimeType = ZIP_MIME_TYPES.includes(fileType);
  const isPotentialZip = isZipByExtension || isZipByMimeType || file.size > 1000;

  if (!isPotentialZip) {
    throw new Error('Invalid file type - must be a ZIP file');
  }
}

export async function ensureYnabAccess() {
  // Check if YNAB tokens are valid (stored in HttpOnly cookies)
  const isYnabTokenValid = await isYnabAuthenticated();
  return { isYnabTokenValid };
}

export async function fetchYnabAccountsAndTransactions() {
  const rawAccounts = await getAccounts();
  if (!rawAccounts) return null;

  const accounts = parseYnabAccountApi(rawAccounts);

  const activeAccounts = rawAccounts.filter(acc => !acc.deleted);
  for (const account of activeAccounts) {
    const transactions = await getTransactions(account.id);
    if (transactions && transactions.length > 0) {
      const transformedTransactions = transactions.map(txn => {
        const date = txn.date;
        const amountDollars = (txn.amount / 1000).toFixed(2);
        return {
          Date: date,
          Merchant: txn.payee_name || '',
          Category: txn.category_name || '',
          CategoryGroup: txn.category_group_name || '',
          Notes: txn.memo || '',
          Amount: amountDollars,
          Tags: txn.flag_name || ''
        };
      });

      if (accounts[account.id]) {
        accounts[account.id].transactions = transformedTransactions;
        accounts[account.id].transactionCount = transformedTransactions.length;
      }
    }
  }

  // Initialize Accounts singleton
  Object.keys(accounts).forEach((id) => {
    accounts[id].id = id; // Ensure ID is in the data object
    accounts[id].included = true;
    accounts[id].modified = false;
    accounts[id].originalName = accounts[id].name;
    accounts[id].originalType = accounts[id].type;
    accounts[id].originalSubtype = accounts[id].subtype;
    accounts[id].originalIncluded = accounts[id].included;
  });

  // TODO: Refactor to avoid using `state`.
  await state.accounts.init(accounts);
  await state.accounts.save();
  
  return accounts;
}

export async function parseUploadedFile(file) {
  validateZipFile(file);
  await parseYNABZip(file);
}

/**
 * Load accounts from IndexedDB via Accounts singleton
 * @returns {Promise<Object|null>} Accounts data or null if not found
 */
export async function loadAccountsFromDB() {
  try {
    if (state.accounts.length() > 0) {
      const accounts = {};
      for (const account of state.accounts._accounts) {
        accounts[account.id] = {
          name: account.name,
          type: account.type,
          subtype: account.subtype,
          transactions: account.transactions,
          transactionCount: account.transactionCount,
          balance: account.balance,
          included: account.included,
          modified: account.isModified(),
          originalName: account.original.name,
          originalType: account.original.type,
          originalSubtype: account.original.subtype,
          originalIncluded: account.originalIncluded
        };
      }
      return Object.keys(accounts).length > 0 ? accounts : null;
    }
    return null;
  } catch (error) {
    console.error('Error loading accounts from singleton:', error);
    return null;
  }
}

/**
 * Check if accounts exist in the Accounts singleton
 * @returns {Promise<boolean>}
 */
export async function hasStoredAccounts() {
  try {
    return state.accounts.length() > 0;
  } catch (error) {
    console.error('Error checking for stored accounts:', error);
    return false;
  }
}
