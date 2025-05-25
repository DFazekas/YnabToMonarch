import { Logger } from '../utils/logger.js';
import updateImportButtonText from '../ui/updateImportButtonText.js';

export function displayAccountMappings(ynabAccounts, monarchAccounts) {
  const logger = new Logger(document.getElementById('logsContainer'));
  
  // Clear previous mappings
  const mappingsContainer = document.getElementById('mappingsContainer')
  mappingsContainer.innerHTML = '';

  Object.keys(ynabAccounts).forEach(ynabAccount => {
    const accountDiv = document.createElement('div');
    accountDiv.classList.add('account-mapping');

    const accountLabel = document.createElement('label');
    accountLabel.setAttribute('for', `mapping-${ynabAccount}`);
    accountLabel.classList.add('account-label')

    const accountNameSpan = document.createElement('span')
    accountNameSpan.textContent = ynabAccount

    const accountTransactionsSpan = document.createElement('span')
    const numberOfTransactions = ynabAccounts[ynabAccount].length
    accountTransactionsSpan.textContent = `(${numberOfTransactions} ${numberOfTransactions === 1 ? "transaction" : "transactions"})`
    accountTransactionsSpan.classList.add('transaction-count')

    accountLabel.appendChild(accountNameSpan)
    accountLabel.appendChild(accountTransactionsSpan)

    const accountSelect = document.createElement('select');
    accountSelect.id = `mapping-${ynabAccount}`;
    accountSelect.name = `mapping-${ynabAccount}`;
    accountSelect.required = true;

    // Default Option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = "Don't import";
    accountSelect.appendChild(defaultOption);

    // Option to Create New Account
    const createNewOption = document.createElement('option');
    createNewOption.value = 'new';
    createNewOption.textContent = "Create new account";
    accountSelect.appendChild(createNewOption);

    // Monarch Accounts Options
    monarchAccounts.forEach(monarchAccount => {
      const option = document.createElement('option');
      option.value = monarchAccount.id;
      option.textContent = monarchAccount.displayName;
      accountSelect.appendChild(option);
    });

    accountSelect.addEventListener('change', updateImportButtonText)

    accountDiv.appendChild(accountLabel);
    accountDiv.appendChild(accountSelect);
    mappingsContainer.appendChild(accountDiv);
  })

  logger.log("Generating account mapping successful.")
}