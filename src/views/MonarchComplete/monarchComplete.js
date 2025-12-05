import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { navigate } from '../../router.js';
import { getAccountTypeByName, getSubtypeByName } from '../../utils/accountTypeUtils.js';
import { renderPageLayout } from '../../components/pageLayout.js';

function initMonarchCompleteView() {
  // Redirect to upload if no accounts are available
  if (!state.accounts || Object.keys(state.accounts).length === 0) {
    navigate('/upload', true);
    return;
  }

  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Migration Status',
      containerId: 'pageHeader'
    }
  });

  // Get template elements
  const resultsContainer = document.getElementById('resultsContainer');
  const accountList = document.getElementById('accountList');
  const actionButtonsContainer = document.getElementById('actionButtonsContainer');
  const header = document.getElementById('header');
  const subheader = document.getElementById('subheader');
  const overallStatus = document.getElementById('overallStatus');

  // Hide loading container and show results immediately
  const loadingContainer = document.getElementById('loadingContainer');
  if (loadingContainer) {
    loadingContainer.style.display = 'none';
  }
  if (resultsContainer) {
    resultsContainer.style.display = 'block';
    resultsContainer.style.opacity = '1';
  }

  // Initialize the processing
  initializeProcessing();

  function initializeProcessing() {
    // Set initial status for all accounts
    Object.keys(state.accounts).forEach(accountName => {
      if (!state.accounts[accountName].status) {
        state.accounts[accountName].status = 'pending';
      }
    });

    // Show initial state
    updateStatusOverview();
    updateAccountList();
    updateActionButtons();

    // Start processing accounts in batches
    processAccountsInBatches();
  }

  async function processAccountsInBatches() {
    const BATCH_SIZE = 5; // Process 5 accounts at a time
    const token = state.credentials.apiToken;

    if (!token) {
      console.error('No API token available');
      // Mark all accounts as failed
      Object.keys(state.accounts).forEach(accountName => {
        if (state.accounts[accountName].included) {
          state.accounts[accountName].status = 'failed';
          state.accounts[accountName].errorMessage = 'Authentication required. Please login again.';
        }
      });
      updateStatusOverview();
      updateAccountList();
      updateActionButtons();
      return;
    }

    // Get all accounts that need processing
    const allAccountsToProcess = Object.entries(state.accounts)
      .filter(([_, account]) => account.included && account.status !== 'completed')
      .map(([accountName, account]) => ({ accountName, ...account }));

    if (allAccountsToProcess.length === 0) {
      console.log('No accounts to process');
      updateStatusOverview();
      updateActionButtons();
      return;
    }

    // Split accounts into batches
    const batches = [];
    for (let i = 0; i < allAccountsToProcess.length; i += BATCH_SIZE) {
      batches.push(allAccountsToProcess.slice(i, i + BATCH_SIZE));
    }

    // Process each batch sequentially
    for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
      const batch = batches[batchIndex];

      // Set batch accounts to processing
      batch.forEach(account => {
        if (state.accounts[account.accountName]) {
          state.accounts[account.accountName].status = 'processing';
        }
      });

      // Update UI to show processing status
      updateStatusOverview();
      updateAccountList();

      // Process this batch
      await processBatch(token, batch, batchIndex + 1, batches.length);

      // Small delay between batches to be API-friendly
      if (batchIndex < batches.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Final UI update
    updateStatusOverview();
    updateAccountList();
    updateActionButtons();
  }

  async function processBatch(token, batch, batchNumber, totalBatches) {
    try {

      // Step 1: Create accounts and upload transactions
      const response = await monarchApi.createAccounts(token, batch);

      // Handle the response format: { success: [...], failed: [...] }
      if (response.success || response.failed) {
        // Handle failed accounts first
        if (response.failed && response.failed.length > 0) {
          response.failed.forEach((result) => {
            const matchingAccount = batch.find(acc => acc.name === result.name || acc.modifiedName === result.name);
            if (matchingAccount && state.accounts[matchingAccount.accountName]) {
              state.accounts[matchingAccount.accountName].status = 'failed';
              state.accounts[matchingAccount.accountName].errorMessage = result.error || 'Account creation failed';
            }
          });
        }

        // Step 2: Monitor upload status for successful accounts
        if (response.success && response.success.length > 0) {
          // Set accounts to upload monitoring status
          response.success.forEach((result) => {
            const matchingAccount = batch.find(acc => acc.name === result.name || acc.modifiedName === result.name);
            if (matchingAccount && state.accounts[matchingAccount.accountName]) {
              state.accounts[matchingAccount.accountName].status = 'uploading';
              state.accounts[matchingAccount.accountName].sessionKeys = result.sessionKeys || [];
            }
          });

          // Update UI to show uploading status
          updateStatusOverview();
          updateAccountList();

          // Monitor upload status for each successful account
          await Promise.all(response.success.map(async (result) => {
            const matchingAccount = batch.find(acc => acc.name === result.name || acc.modifiedName === result.name);
            if (matchingAccount && state.accounts[matchingAccount.accountName] && result.sessionKeys) {
              try {
                await monitorUploadStatus(token, matchingAccount.accountName, result.sessionKeys);
                state.accounts[matchingAccount.accountName].status = 'completed';
              } catch (error) {
                state.accounts[matchingAccount.accountName].status = 'failed';
                state.accounts[matchingAccount.accountName].errorMessage = error.message || 'Transaction upload failed';
              }
            }
          }));
        }

        // Mark any remaining accounts that weren't in success or failed arrays as failed
        batch.forEach(account => {
          if (state.accounts[account.accountName] &&
            state.accounts[account.accountName].status === 'processing') {
            tate.accounts[account.accountName].status = 'failed';
            state.accounts[account.accountName].errorMessage = 'Account not processed by server';
          }
        });

      } else {
        // API call failed, mark all batch accounts as failed
        const errorMessage = response.error || 'Failed to create accounts in Monarch Money';
        batch.forEach(account => {
          if (state.accounts[account.accountName]) {
            state.accounts[account.accountName].status = 'failed';
            state.accounts[account.accountName].errorMessage = errorMessage;
          }
        });
      }
    } catch (error) {
      // Network error or other exception
      batch.forEach(account => {
        if (state.accounts[account.accountName]) {
          state.accounts[account.accountName].status = 'failed';
          state.accounts[account.accountName].errorMessage = 'Network error. Please check your connection and try again.';
        }
      });
    }
  }

  async function monitorUploadStatus(token, accountName, sessionKeys) {
    // Monitor each session key until all are complete
    await Promise.all(sessionKeys.map(async (sessionKey) => {
      let attempts = 0;
      const maxAttempts = 60; // Maximum 5 minutes (60 * 5 seconds)

      while (attempts < maxAttempts) {
        try {
          const statusResponse = await monarchApi.queryUploadStatus(token, sessionKey);

          if (statusResponse.data?.uploadStatementSession) {
            const session = statusResponse.data.uploadStatementSession;
            const status = session.status;

            if (status === 'completed') {
              return; // This session is complete
            } else if (status === 'failed' || status === 'error') {
              const errorMessage = session.errorMessage || 'Transaction upload failed';
              throw new Error(errorMessage);
            }
            // Status is still 'processing' or 'pending', continue polling
          }

          // Wait 5 seconds before next check
          await new Promise(resolve => setTimeout(resolve, 5000));
          attempts++;

        } catch (error) {
          attempts++;
          if (attempts >= maxAttempts) {
            throw error;
          }
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }

      // If we reach here, we've exceeded max attempts
      throw new Error(`Upload status check timed out for account ${accountName}`);
    }));
  }

  function updateStatusOverview() {
    const accounts = state.accounts || {};
    // Only count included accounts
    const includedAccounts = Object.values(accounts).filter(acc => acc.included);
    const totalAccounts = includedAccounts.length;
    const completedAccounts = includedAccounts.filter(acc => acc.status === 'completed').length;
    const failedAccounts = includedAccounts.filter(acc => acc.status === 'failed').length;
    const processingAccounts = includedAccounts.filter(acc => acc.status === 'processing').length;
    const uploadingAccounts = includedAccounts.filter(acc => acc.status === 'uploading').length;
    const pendingAccounts = totalAccounts - completedAccounts - failedAccounts - processingAccounts - uploadingAccounts;

    let statusText = 'Processing...';
    let statusSubtext = 'Please wait while we process your accounts.';
    let statusIcon = '⏳';

    if (processingAccounts > 0) {
      statusText = 'Creating accounts...';
      statusSubtext = `Creating ${processingAccounts} account${processingAccounts !== 1 ? 's' : ''}. Please wait.`;
      statusIcon = '⏳';
    } else if (uploadingAccounts > 0) {
      statusText = 'Uploading transactions...';
      statusSubtext = `Uploading transactions for ${uploadingAccounts} account${uploadingAccounts !== 1 ? 's' : ''}. Please wait.`;
      statusIcon = '📤';
    } else if (pendingAccounts === 0) {
      if (failedAccounts === 0) {
        statusText = 'All accounts migrated successfully!';
        statusSubtext = `Successfully created ${completedAccounts} account${completedAccounts !== 1 ? 's' : ''} in Monarch Money.`;
        statusIcon = '✅';
      } else if (completedAccounts === 0) {
        statusText = 'Migration failed for all accounts';
        statusSubtext = 'None of your accounts could be migrated. Please try again.';
        statusIcon = '❌';
      } else {
        statusText = 'Migration completed with some failures';
        statusSubtext = `${completedAccounts} successful, ${failedAccounts} failed. You can retry the failed accounts.`;
        statusIcon = '⚠️';
      }
    }

    if (header) {
      header.textContent = statusText;
    }
    if (subheader) {
      subheader.textContent = statusSubtext;
    }
    if (overallStatus) {
      overallStatus.innerHTML = `<div class="text-6xl">${statusIcon}</div>`;
    }
  }

  function updateAccountList() {
    if (!accountList) return;

    const accounts = state.accounts || {};
    accountList.innerHTML = '';

    Object.entries(accounts).forEach(([accountId, account]) => {
      // Skip accounts that are not included
      if (!account.included) return;

      const accountItem = document.createElement('div');
      accountItem.className = 'bg-white border border-gray-200 rounded-lg p-4';

      let statusIcon = '';
      let statusClass = '';
      let statusText = '';

      switch (account.status) {
        case 'completed':
          statusIcon = '✅';
          statusClass = 'text-green-600';
          statusText = 'Successfully migrated';
          break;
        case 'failed':
          statusIcon = '❌';
          statusClass = 'text-red-600';
          statusText = account.errorMessage || 'Migration failed';
          break;
        case 'processing':
          statusIcon = '⏳';
          statusClass = 'text-blue-600';
          statusText = 'Creating account...';
          break;
        case 'uploading':
          statusIcon = '📤';
          statusClass = 'text-purple-600';
          statusText = 'Uploading transactions...';
          break;
        default:
          statusIcon = '⏳';
          statusClass = 'text-gray-600';
          statusText = 'Pending';
      }

      // Get account type display name
      let accountTypeDisplay = 'Unknown Type';

      if (account.type) {
        const typeInfo = getAccountTypeByName(account.type);
        if (typeInfo) {
          accountTypeDisplay = typeInfo.typeDisplay || typeInfo.displayName || typeInfo.display;
          if (account.subtype) {
            const subtypeInfo = getSubtypeByName(account.type, account.subtype);
            if (subtypeInfo) {
              accountTypeDisplay = subtypeInfo.display || subtypeInfo.displayName;
            }
          }
        }
      } else {
        console.log(`Account ${accountId} has no type property`);
      }

      accountItem.innerHTML = `
        <div class="flex items-start justify-between mb-3">
          <div class="flex-1 min-w-0 pr-4">
            <div class="font-medium text-gray-900 mb-1">${account.modifiedName || account.account_name || account.name || 'Unknown Account'}</div>
            <div class="text-sm text-gray-500">${accountTypeDisplay}</div>
            ${account.monarchAccountId ? `<div class="text-xs text-gray-400 mt-1">Monarch ID: ${account.monarchAccountId}</div>` : ''}
          </div>
          <div class="flex-shrink-0">
            <span class="text-2xl">${statusIcon}</span>
          </div>
        </div>
        <div class="pt-2 border-t border-gray-100">
          <div class="${statusClass} text-sm font-medium leading-relaxed">${statusText}</div>
        </div>
      `;

      accountList.appendChild(accountItem);
    });
  }

  function updateActionButtons() {
    if (!actionButtonsContainer) return;

    const accounts = state.accounts || {};
    const failedAccounts = Object.values(accounts).filter(acc => acc.included && acc.status === 'failed');
    const completedAccounts = Object.values(accounts).filter(acc => acc.included && acc.status === 'completed');

    // Clear existing buttons
    actionButtonsContainer.innerHTML = '';

    // Create retry button if there are failed accounts
    if (failedAccounts.length > 0) {
      const retryBtn = document.createElement('button');
      retryBtn.className = 'ui-button';
      retryBtn.dataset.type = 'primary';
      retryBtn.dataset.size = 'medium';
      retryBtn.textContent = 'Retry Failed Accounts';
      retryBtn.addEventListener('click', () => retryFailedAccounts());
      actionButtonsContainer.appendChild(retryBtn);
    }

    // Create view in Monarch button if there are completed accounts
    if (completedAccounts.length > 0) {
      const viewBtn = document.createElement('button');
      viewBtn.className = 'ui-button';
      viewBtn.dataset.type = 'secondary';
      viewBtn.dataset.size = 'medium';
      viewBtn.textContent = 'View in Monarch Money';
      viewBtn.addEventListener('click', () => window.open('https://app.monarchmoney.com', '_blank'));
      actionButtonsContainer.appendChild(viewBtn);
    }

    // Always create start over button
    const startOverBtn = document.createElement('button');
    startOverBtn.className = 'ui-button';
    startOverBtn.dataset.type = 'secondary';
    startOverBtn.dataset.size = 'medium';
    startOverBtn.textContent = 'Start Over';
    startOverBtn.addEventListener('click', () => navigate('/upload', true));
    actionButtonsContainer.appendChild(startOverBtn);
  }

  function retryFailedAccounts() {
    const failedAccounts = Object.entries(state.accounts).filter(([accountName, acc]) => acc.included && acc.status === 'failed');

    if (failedAccounts.length === 0) return;

    // Reset failed accounts to pending
    failedAccounts.forEach(([accountName, account]) => {
      state.accounts[accountName].status = 'pending';
      delete state.accounts[accountName].errorMessage;
    });

    // Update UI and restart batch processing
    updateStatusOverview();
    updateAccountList();
    updateActionButtons();

    processAccountsInBatches();
  }
}

export default initMonarchCompleteView;
