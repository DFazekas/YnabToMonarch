import Accounts from '../../schemas/accounts.js';
import { navigate } from '../../router.js';
import { redirectToYnabOauth } from '../../api/ynabApi.js';
import loadingOverlay from '../../components/LoadingOverlay.js';
import { ensureYnabAccess, fetchYnabAccountsAndTransactions, parseUploadedFile, loadAccountsFromDB, hasStoredAccounts } from './uploadData.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import financialDB from '../../utils/indexedDB.js';

export default async function initUploadView() {
  // Initialize IndexedDB
  try {
    await financialDB.init();
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    // Continue anyway - data will just be stored in memory
  }

  // Check if we have existing accounts in IndexedDB
  const hasExistingAccounts = await hasStoredAccounts();

  // Load accounts from IndexedDB if they exist
  if (hasExistingAccounts) {
    await loadAccountsFromDB();
  }

  // Check if YNAB tokens are valid
  let isYnabTokenValid = false;
  try {
    const result = await ensureYnabAccess();
    isYnabTokenValid = result.isYnabTokenValid;
  } catch (error) {
    console.warn('Error checking YNAB authentication:', error);
    // isYnabTokenValid remains false
  }

  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 1: Import YNAB Data',
      description: 'Start by bringing over your YNAB data. Next, you\'ll review the data, filter and edit as needed.',
      containerId: 'pageHeader'
    }
  });

  // Get error message elements
  const oauthError = document.getElementById('oauthError');
  const fileUploadError = document.getElementById('fileUploadError');

  // Update YNAB card based on session state
  const continueWithYnabBtn = document.getElementById('continueWithYnabBtn');
  continueWithYnabBtn.hidden = !isYnabTokenValid;

  const connectYnabBtn = document.getElementById('connectYnabBtn');
  connectYnabBtn.textContent = isYnabTokenValid ? 'Connect new YNAB Profile' : 'Connect to YNAB';
  connectYnabBtn.setAttribute('data-color', isYnabTokenValid ? 'white' : 'purple');
  connectYnabBtn.applyStyles();

  document.getElementById('automaticUploadDivider').hidden = !isYnabTokenValid

  // Continue with existing YNAB session
  continueWithYnabBtn?.addEventListener('click', async (event) => {
    event.preventDefault();

    // Hide any previous errors
    oauthError.hide();

    // Show loading overlay and fetch accounts + transactions
    loadingOverlay.show('Fetching accounts...');
    try {
      const accounts = await fetchYnabAccountsAndTransactions();
      if (!accounts || Object.keys(accounts).length === 0) {
        loadingOverlay.hide();
        oauthError.show(
          'No accounts found in your YNAB profile.',
          'Make sure you have at least one account in your YNAB budget, then try again.'
        );
        return;
      }

      Accounts.init(accounts);
      navigate('/review', false, true);
    } catch (error) {
      console.error('Error fetching YNAB accounts:', error);
      loadingOverlay.hide();
      oauthError.show(
        'Could not fetch accounts from YNAB.',
        'Your session may have expired. Try connecting to YNAB again below.'
      );
    }
  });

  connectYnabBtn?.addEventListener('click', async (event) => {
    event.preventDefault();

    // Hide any previous errors when user takes action
    oauthError.hide();

    try {
      await redirectToYnabOauth();
    } catch (error) {
      console.error('Error initiating YNAB OAuth:', error);
      oauthError.show(
        'Could not connect to YNAB.',
        'Please check your internet connection and try again.'
      );
    }
  });

  // Update manual upload card based on existing data
  const continueWithExistingBtn = document.getElementById('continueWithExistingBtn');
  const manualUploadButton = document.getElementById('manualUploadButton');
  document.getElementById('manualUploadDivider').hidden = !hasExistingAccounts
  continueWithExistingBtn.hidden = !hasExistingAccounts;
  const originalButtonText = manualUploadButton.textContent; // Save original text
  manualUploadButton.textContent = hasExistingAccounts ? 'Upload new Data' : 'Upload YNAB Data';
  manualUploadButton.setAttribute('data-color', hasExistingAccounts ? 'white' : 'blue');
  manualUploadButton.applyStyles();

  // Continue with existing data
  continueWithExistingBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    // Skip route guards since we already have accounts
    navigate('/review', false, true);
  });

  const manualFileInput = document.getElementById('manualFileInput');
  manualUploadButton?.addEventListener('click', (e) => {
    e.preventDefault();

    // Hide any previous errors when user takes action
    fileUploadError.hide();
    manualFileInput?.click();
  });
  manualFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
      fileUploadError.hide();
      await handleFile(file);
    }
  });

  async function handleFile(csvFile) {
    // Validate file and show loading state
    try {
      await parseUploadedFile(csvFile);
      navigate('/review', false, true);
    } catch (err) {
      console.error('File parsing error:', err);
      loadingOverlay.hide();

      let errorMessage = 'Could not parse the uploaded file.';
      let solution = 'Please ensure it\'s a valid YNAB ZIP export. Try re-exporting from YNAB.com → Account Menu → "Export Plan".';

      const errorMsg = err.message?.toLowerCase() || '';

      if (errorMsg.includes('register') || errorMsg.includes('csv')) {
        errorMessage = 'Missing required data in the ZIP file.';
        solution = 'The file must contain "register.csv". Make sure you exported the complete YNAB plan from YNAB.com (not just individual account exports).';
      } else if (errorMsg.includes('zip') || errorMsg.includes('corrupt')) {
        errorMessage = 'The ZIP file appears to be corrupted.';
        solution = 'Try downloading a fresh export from YNAB.com and upload it again.';
      } else if (errorMsg.includes('parse') || errorMsg.includes('format')) {
        errorMessage = 'The file format is not recognized.';
        solution = 'Make sure you\'re uploading the ZIP file downloaded directly from YNAB.com, not a modified version.';
      } else if (errorMsg.includes('empty') || errorMsg.includes('invalid')) {
        errorMessage = 'The file appears to be empty or invalid.';
        solution = 'Please re-export your complete YNAB budget from YNAB.com → Account Menu → "Export Plan".';
      } else if (errorMsg.includes('too large')) {
        errorMessage = 'File is too large.';
        solution = 'Please ensure your YNAB export is under 50MB. If needed, export a smaller date range.';
      } else if (errorMsg.includes('too small')) {
        errorMessage = 'File appears to be empty or corrupted.';
        solution = 'Please re-export your data from YNAB and try again.';
      } else if (errorMsg.includes('file type')) {
        errorMessage = 'Invalid file type.';
        solution = 'Please upload a ZIP file exported from YNAB. Visit YNAB.com → Account Menu → "Export Plan" to download it.';
      }

      fileUploadError.show(errorMessage, solution);
      manualUploadButton.disabled = false;
      manualUploadButton.textContent = originalButtonText;
      manualFileInput.value = '';
    }
  }
}
