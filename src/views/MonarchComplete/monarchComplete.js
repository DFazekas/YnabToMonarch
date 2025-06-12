import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';

export default function initAutoImportCompleteView() {
  const restartBtn = document.getElementById('restartBtn');
  const successContainer = document.getElementById('successContainer');
  const errorContainer = document.getElementById('errorContainer');
  const errorMessageBox = document.getElementById('errorMessage');

  // Hide both containers initially while loading
  successContainer.classList.add('hidden');
  errorContainer.classList.add('hidden');

  renderButtons();

  // Call the mapAccounts API
  createAccounts();

  async function createAccounts() {
    try {
      console.log("State:", state)

      const accounts = Object.values(state.accounts).filter(account => account.included);
      console.log("Importing filtered accounts:", accounts);

      const response = await monarchApi.createAccounts(state.apiToken, accounts);
      console.log("CreateAccounts response:", response);

      if (response.error) {
        errorMessageBox.textContent = response.error || 'An unexpected error occurred while migrating your accounts.';
        errorContainer.classList.remove('hidden');
        return;
      }

      // Assume if no error is thrown, it succeeded
      successContainer.classList.remove('hidden');
    } catch (err) {
      console.error("Mapping error", err);
      errorMessageBox.textContent = err?.message || 'An unexpected error occurred while migrating your accounts.';
      errorContainer.classList.remove('hidden');
    }
  }

  backBtn.addEventListener('click', () => {
    navigate('monarchCredentialsView');
  });

  restartBtn.addEventListener('click', () => {
    navigate('uploadView');
  });
}
