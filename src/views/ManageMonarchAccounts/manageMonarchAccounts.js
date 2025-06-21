import { monarchApi } from '../../api/monarchApi.js';
import state from '../../state.js';
import { toggleDisabled } from '../../utils/dom.js';
import { getLocalStorage, getCachedAccounts, saveAccountsToCache } from '../../utils/storage.js';
import { navigate } from '../../router.js';

export default function initBulkDeleteView() {
  // Local cache for accounts
  let cachedAccounts = [];

  // Ensure user is authenticated
  const token = state.credentials.apiToken || getLocalStorage().token;
  if (!token) {
    state.redirectAfterLogin = 'bulkDeleteView';
    return navigate('monarchCredentialsView');
  }

  const $ = id => document.getElementById(id);
  const UI = {
    accountListEl: $('accountList'),
    refreshBtn: $('refreshBtn'),
    deleteBtn: $('deleteBtn'),
    statusMsg: $('statusMsg'),
  }

  // Load cached accounts if available, else fetch
  const initialCache = getCachedAccounts();
  if (initialCache.length) {
    cachedAccounts = initialCache;
    renderAccounts(cachedAccounts);
    UI.statusMsg.textContent = `Loaded ${cachedAccounts.length} accounts from cache.`;
  } else {
    refreshAccounts();
  }

  function renderAccounts(accounts) {
    UI.accountListEl.innerHTML = '';
    accounts.forEach(acc => {
      const container = document.createElement('div');
      container.className = 'flex items-center mb-1';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = acc.id;
      checkbox.className = 'mr-2';
      checkbox.addEventListener('change', onSelectionChange);
      const label = document.createElement('label');
      label.textContent = acc.displayName;
      container.appendChild(checkbox);
      container.appendChild(label);
      UI.accountListEl.appendChild(container);
    });
    toggleDisabled(UI.deleteBtn, true);
  }

  function onSelectionChange() {
    const anyChecked = Array.from(UI.accountListEl.querySelectorAll('input[type=checkbox]')).some(cb => cb.checked);
    toggleDisabled(UI.deleteBtn, !anyChecked);
  }

  async function refreshAccounts() {
    UI.statusMsg.textContent = 'Loading accounts...';
    toggleDisabled(UI.refreshBtn, true);
    try {
      const data = await monarchApi.fetchAccounts(token);
      cachedAccounts = data.accounts || [];
      renderAccounts(cachedAccounts);
      saveAccountsToCache(cachedAccounts);
      UI.statusMsg.textContent = `Loaded ${cachedAccounts.length} accounts.`;
    } catch (err) {
      UI.statusMsg.textContent = `Error fetching accounts: ${err.message}`;
    } finally {
      toggleDisabled(UI.refreshBtn, false);
    }
  }

  async function deleteSelected() {
    const checked = Array.from(UI.accountListEl.querySelectorAll('input[type=checkbox]:checked'));
    const ids = checked.map(cb => cb.value);
    if (ids.length === 0) return;

    toggleDisabled(UI.deleteBtn, true);
    toggleDisabled(UI.refreshBtn, true);
    UI.statusMsg.textContent = `Preparing to delete ${ids.length} account(s)...`;

    // Helper to batch array
    function chunkArray(arr, size) {
      const batches = [];
      for (let i = 0; i < arr.length; i += size) {
        batches.push(arr.slice(i, i + size));
      }
      return batches;
    }

    const batches = chunkArray(ids, 3);
    const successes = [];
    const failures = [];

    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      UI.statusMsg.textContent = `Deleting batch ${i + 1} of ${batches.length} (${batch.length} items)...`;
      // Execute concurrent deletions
      await Promise.all(batch.map(async id => {
        try {
          const res = await monarchApi.deleteAccount(token, id);
          if (res.success) {
            successes.push(id);
          } else {
            failures.push({ id, error: res.error || 'Unknown error' });
          }
        } catch (err) {
          failures.push({ id, error: err.message });
        }
      }));

      // Delay before next batch
      if (i < batches.length - 1) {
        UI.statusMsg.textContent += ' Waiting before next batch...';
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    // Update cache by removing successes
    successes.forEach(id => {
      cachedAccounts = cachedAccounts.filter(acc => acc.id !== id);
    });
    saveAccountsToCache(cachedAccounts);
    
    // Summary and re-render
    UI.statusMsg.textContent = `Deletion complete: ${successes.length} succeeded, ${failures.length} failed.`;
    if (failures.length > 0) console.error('Deletion failures:', failures);
    renderAccounts(cachedAccounts);
    toggleDisabled(UI.deleteBtn, false);
    toggleDisabled(UI.refreshBtn, false);
  }

  UI.refreshBtn.addEventListener('click', e => { e.preventDefault(); refreshAccounts(); });
  UI.deleteBtn.addEventListener('click', e => { e.preventDefault(); deleteSelected(); });
}
