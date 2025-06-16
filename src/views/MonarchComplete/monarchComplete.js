import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';

export default function initAutoImportCompleteView() {
  const list = document.getElementById('accountList');
  const restartBtn = document.getElementById('restartBtn');
  const retryAllBtn = document.getElementById('retryAllBtn');
  const openMonarchBtn = document.getElementById('openMonarchBtn');
  const backBtn = document.getElementById('backBtn');
  const header = document.getElementById('header');
  const subheader = document.getElementById('subheader');
  const overallStatus = document.getElementById('overallStatus');

  renderButtons();

  const accounts = Object.values(state.accounts).filter(a => a.included);
  const CHUNK_SIZE = 4;

  const STATUS_MAP = {
    unprocessed: 'queued',
    processed: 'success',
    failed: 'error',
  };

  const ICONS = {
    success: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-green-500"><path d="M20 6L9 17l-5-5"></path></svg>`,
    warning: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-full h-full text-orange-500"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    loading: `<svg class="w-full h-full animate-spin text-blue-500" viewBox="0 0 24 24" fill="none"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>`,
  };

  accounts.forEach(account => {
    const container = document.createElement('div');
    container.id = `status-${account.modifiedName}`;
    container.innerHTML = `
      <div class="flex justify-between items-center">
        <span class="font-medium truncate">${account.modifiedName}</span>
        <span class="text-sm status-indicator text-gray-400">● Queued</span>
      </div>
      <div class="text-xs text-red-500 error-message hidden mb-1"></div>
    `;
    list.appendChild(container);
    updateStatus(account, STATUS_MAP[account.status] || 'queued');
  });

  let hasInitiatedProcessing = false;
  const allUnprocessed = accounts.every(acc => acc.status === 'unprocessed');

  // Always render the initial status immediately
  updateOverallStatus();

  // Only auto-start processing if all accounts are unprocessed AND we haven’t done so yet in this session
  if (allUnprocessed && !hasInitiatedProcessing) {
    hasInitiatedProcessing = true;

    header.textContent = 'Migration In Progress...';
    subheader.innerHTML = '<strong>Please do not refresh the page...</strong>';
    overallStatus.innerHTML = ICONS.loading;
    retryAllBtn.setAttribute('hidden', '');
    backBtn.setAttribute('hidden', '');
    restartBtn.setAttribute('hidden', '');
    openMonarchBtn.setAttribute('hidden', '');

    (async () => {
      await processChunks(batchAccounts(accounts));
      updateOverallStatus();
    })();
  }

  function batchAccounts(accts) {
    return accts.reduce((chunks, account, i) => {
      const idx = Math.floor(i / CHUNK_SIZE);
      (chunks[idx] ||= []).push(account);
      return chunks;
    }, []);
  }

  async function processChunks(chunks) {
    console.log("State:", state)
    console.log("Chunks:", chunks);
    for (const chunk of chunks) {
      chunk.forEach(acc => updateStatus(acc, 'processing'));

      const response = await monarchApi.createAccounts(state.apiToken, chunk);

      const pollingPromises = [];

      for (const account of response.success) {
        const original = accounts.find(a => a.modifiedName === account.name);
        updateStatus(original, 'pending');
        for (const key of account.sessionKeys) {
          pollingPromises.push(pollUntilComplete(original, key));
        }
      }

      response.failed.forEach(entry => {
        const failedAccount = state.accounts[entry.name];
        failedAccount.status = 'failed';
        updateStatus(failedAccount, 'error', entry.error);
      });

      await Promise.all(pollingPromises);
      await sleep(2000);
    }
  }

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function updateStatus(account, status, error = null) {
    const row = document.getElementById(`status-${account.modifiedName}`);
    if (!row) return;

    const indicator = row.querySelector('.status-indicator');
    const errorBox = row.querySelector('.error-message');

    const states = {
      queued: { text: '● Queued', color: 'text-gray-400' },
      processing: { text: '<span class="animate-pulse">● Processing</span>', color: 'text-blue-500' },
      pending: { text: '<span class="animate-spin">⏳ Pending</span>', color: 'text-yellow-500' },
      success: { text: '✔️ Complete', color: 'text-green-500' },
      error: { text: '❌ Error', color: 'text-red-500' }
    };

    const state = states[status];
    if (state) {
      indicator.innerHTML = state.text;
      indicator.className = `text-sm status-indicator ${state.color}`;
    }

    if (error) {
      errorBox.classList.remove('hidden');
      errorBox.textContent = error;
      account.status = 'failed';
    } else {
      errorBox.classList.add('hidden');
      if (status === 'success') {
        account.status = 'processed';
        account.selected = false
      }
    }
  }

  function updateOverallStatus() {
    const allProcessed = accounts.every(a => a.status === 'processed');
    const someProcessing = accounts.some(a => a.status === 'processing');
    const someFailed = accounts.some(a => a.status === 'failed');

    if (someProcessing) {
      header.textContent = 'Migration In Progress...';
      subheader.innerHTML = '<strong>Please do not refresh the page...</strong>';
      overallStatus.innerHTML = ICONS.loading;
      retryAllBtn.setAttribute('hidden', '');
      backBtn.setAttribute('hidden', '');
      restartBtn.setAttribute('hidden', '');
      openMonarchBtn.setAttribute('hidden', '');
      return;
    } else if (allProcessed) {
      header.textContent = 'Migration Complete!';
      subheader.textContent = 'All accounts were successfully imported.';
      overallStatus.innerHTML = ICONS.success
      retryAllBtn.setAttribute('hidden', '');
      backBtn.setAttribute('hidden', '');
      restartBtn.removeAttribute('hidden');
      openMonarchBtn.removeAttribute('hidden');
    } else if (someFailed) {
      header.textContent = 'Migration Incomplete';
      subheader.textContent = 'Some accounts failed to import. Please retry them.';
      overallStatus.innerHTML = ICONS.warning
      retryAllBtn.removeAttribute('hidden');
      backBtn.removeAttribute('hidden');
      restartBtn.setAttribute('hidden', '');
      openMonarchBtn.setAttribute('hidden', '');

      // Scroll to first failed account
      const firstFailed = accounts.find(a => a.status === 'failed');
      if (firstFailed) {
        document.getElementById(`status-${firstFailed.modifiedName}`)?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  async function pollUntilComplete(account, sessionKey, maxRetries = 30, interval = 3500) {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const res = await monarchApi.queryUploadStatus(state.apiToken, sessionKey);
        const session = res.data.uploadStatementSession;

        console.log(`Polling status for ${account.modifiedName} (attempt ${attempt + 1}):`, session);

        if (session.status === 'completed') {
          updateStatus(account, 'success');
          return;
        } else if (session.status === 'failed' || session.status === 'errored' || session.errorMessage) {
          updateStatus(account, 'error', session.errorMessage || 'Upload failed');
          return;
        }
      } catch (e) {
        updateStatus(account, 'error', e.message);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, interval));
    }

    updateStatus(account, 'error', 'Timeout waiting for Monarch to finish import.');
  }

  retryAllBtn.addEventListener('click', async () => {
    retryAllBtn.disabled = true;
    retryAllBtn.textContent = 'Retrying...';
    const retryAccounts = accounts.filter(a => a.status === 'failed');
    await processChunks(batchAccounts(retryAccounts));
    retryAllBtn.disabled = false;
    retryAllBtn.textContent = 'Retry All Failed Accounts';
    updateOverallStatus();
  });

  restartBtn.addEventListener('click', () => {
    navigate('uploadView');
  });

  backBtn.addEventListener('click', () => {
    navigate('reviewView');
  });
}
