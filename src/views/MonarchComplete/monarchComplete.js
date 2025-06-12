import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';

export default function initAutoImportCompleteView() {
  const list = document.getElementById('accountList');
  const restartBtn = document.getElementById('restartBtn');
  const successContainer = document.getElementById('successContainer');
  const errorContainer = document.getElementById('errorContainer');

  successContainer.classList.remove('hidden');
  errorContainer.classList.add('hidden');
  renderButtons();

  const accounts = Object.values(state.accounts).filter(a => a.included);
  const CHUNK_SIZE = 5;

  const chunks = [];
  for (let i = 0; i < accounts.length; i += CHUNK_SIZE) {
    chunks.push(accounts.slice(i, i + CHUNK_SIZE));
  }

  accounts.forEach(account => {
    const row = document.createElement('div');
    row.id = `status-${account.modifiedName}`;
    row.innerHTML = `<span>${account.modifiedName}</span> <span class="text-gray-400">● Queued</span>`;
    list.appendChild(row);
  });

  (async () => {
    for (const chunk of chunks) {
      chunk.forEach(acc => updateStatus(acc.modifiedName, 'processing'));

      const response = await monarchApi.createAccounts(state.apiToken, chunk);

      response.success.forEach(name => updateStatus(name, 'success'));
      response.failed.forEach(entry => updateStatus(entry.name, 'error', entry.error));
    }
  })();

  function updateStatus(name, status, error = null) {
    const row = document.getElementById(`status-${name}`);
    if (!row) return;

    const icons = {
      queued: '●',
      processing: '<span class="animate-spin">⏳</span>',
      success: '✔️',
      error: '❌'
    };

    row.innerHTML = `<span>${name}</span> <span>${icons[status]}</span>`;
    if (error) {
      row.innerHTML += `<br><small class='text-red-500'>${error}</small>`;
    }
  }

  restartBtn.addEventListener('click', () => {
    navigate('uploadView');
  });
}