import parseYNABZip from '../../../services/ynabParser.js';
import ynabApi from '../../../api/ynabApi.js';
import getLogger, { setLoggerConfig } from '../../../utils/logger.js';
import db from '../../../utils/indexedDB.js';


const logger = getLogger('UploadController');
setLoggerConfig({
  namespaces: { UploadController: true },
  // methods: { 'Accounts.getByName': true },
  levels: { debug: true, group: true, groupEnd: true },
});

export default class UploadController {
  constructor() {
    this._ZIP_EXTENSIONS = ['.zip', '.bin'];
    this._ZIP_FILENAME_PATTERNS = ['ynab', 'register', 'export'];
    this._ZIP_MIME_TYPES = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-zip',
      'multipart/x-zip',
      'application/x-compressed',
      'application/binary'
    ];
    this._MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    this._MIN_FILE_SIZE = 100; // bytes
  }

  /** Fetch accounts and their transactions from YNAB API
   * @returns {Promise<AccountList>} AccountList with accounts and their transactions
   * @throws {Error} If fetching accounts or transactions fails
   */
  async fetchYnabAccountsAndTransactions() {
    const methodName = "fetchYnabAccountsAndTransactions";
    logger.group(methodName);
    const accountList = await ynabApi.getAccounts();
    logger.debug(methodName, 'Fetched accounts count:', accountList.accounts.length);

    await Promise.all(accountList.accounts.map(async (account) => {
      const accountTransactions = await ynabApi.getTransactions(account.id);
      logger.debug(methodName, `Fetched transactions for account ${account.id} (${account.name}):`, accountTransactions.size);
      accountTransactions.forEach(txn => {
        account.addTransaction(txn);
        accountList.addTransaction(txn.id);
        logger.debug(methodName, `Added transaction ${txn.id} to account ${account.id}`);
      });
    }));

    logger.groupEnd(methodName);
    return accountList;
  }

  /** Validate and parse the uploaded YNAB ZIP file
   * @param {File} file - The uploaded ZIP file
   * @returns {Promise<void>}
   * @throws {Error} If validation or parsing fails
   */
  async parseUploadedFile(file) {
    this._validateZipFile(file);
    await parseYNABZip(file);
  }

  /** Load accounts from IndexedDB via Accounts singleton
   * @returns {Promise<Accounts>} Accounts data or null if not found
   */
  async loadAccountsFromDB() {
    try {
      await db.init();
      return await db.getAccounts();
    } catch (error) {
      console.error('Error loading accounts from singleton:', error);
      return new Accounts();
    }
  }

  // Private methods

  /** Validate if file is a ZIP file
   * @param {File} file
   * @throws {Error} If file is invalid
   */
  _validateZipFile(file) {
    if (!file) throw new Error('No file provided');
    if (file.size > this._MAX_FILE_SIZE) throw new Error('File too large');
    if (file.size < this._MIN_FILE_SIZE) throw new Error('File too small');

    const fileName = file.name.toLowerCase();
    const fileType = file.type.toLowerCase();

    const isZipByExtension = this._ZIP_EXTENSIONS.some(ext => fileName.endsWith(ext)) ||
      this._ZIP_FILENAME_PATTERNS.some(pattern => fileName.includes(pattern));

    const isZipByMimeType = this._ZIP_MIME_TYPES.includes(fileType);
    const isPotentialZip = isZipByExtension || isZipByMimeType || file.size > 1000;

    if (!isPotentialZip) {
      throw new Error('Invalid file type - must be a ZIP file');
    }
  }
}
