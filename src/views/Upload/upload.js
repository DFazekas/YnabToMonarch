import state from '../../state.js';
import { navigate, persistState } from '../../router.js';
import parseYNABZip, {parseYnabAccountApi} from '../../services/ynabParser.js';
import { redirectToYnabOauth, refreshAccessToken, getAccounts } from '../../api/ynabApi.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import '../../components/Card.js';
import '../../components/Divider.js';
import '../../components/ErrorMessage.js';

export default async function initUploadView() {
  // Check if we have existing accounts data
  const hasExistingAccounts = state.accounts && Object.keys(state.accounts).length > 0;

  // Check if YNAB tokens are valid or can be refreshed
  let ynabAccessToken = sessionStorage.getItem('ynab_access_token');
  const ynabRefreshToken = sessionStorage.getItem('ynab_refresh_token');
  const ynabTokenExpiresAt = sessionStorage.getItem('ynab_token_expires_at');

  let isYnabTokenValid = ynabAccessToken &&
    ynabTokenExpiresAt &&
    Date.now() < parseInt(ynabTokenExpiresAt, 10);

  // If token is expired but refresh token exists, try to refresh
  if (!isYnabTokenValid && ynabRefreshToken) {
    console.log('YNAB access token expired, attempting to refresh...');
    const refreshed = await refreshAccessToken(ynabRefreshToken);
    if (refreshed && refreshed.access_token) {
      ynabAccessToken = refreshed.access_token;
      isYnabTokenValid = true;
      console.log('YNAB access token successfully refreshed');
    } else {
      console.log('Failed to refresh YNAB access token');
    }
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
  const connectYnabBtn = document.getElementById('connectYnabBtn');
  continueWithYnabBtn.hidden = !isYnabTokenValid;
  document.getElementById('automaticUploadDivider').hidden = !isYnabTokenValid
  connectYnabBtn.textContent = isYnabTokenValid ? 'Connect new YNAB Profile' : 'Connect to YNAB';
  connectYnabBtn.setAttribute('data-color', isYnabTokenValid ? 'white' : 'purple');
  connectYnabBtn.applyStyles();

  // Continue with existing YNAB session
  continueWithYnabBtn?.addEventListener('click', async (event) => {
    event.preventDefault();
    
    // Hide any previous errors
    oauthError.hide();
    
    // Disable button and show loading state
    continueWithYnabBtn.disabled = true;
    const originalText = continueWithYnabBtn.textContent;
    continueWithYnabBtn.textContent = 'Fetching accounts...';
    
    try {
      const rawAccounts = await getAccounts(ynabAccessToken);
      
      if (!rawAccounts) {
        throw new Error('No response from YNAB API');
      }
      
      const accounts = parseYnabAccountApi(rawAccounts);
      
      if (!accounts || Object.keys(accounts).length === 0) {
        oauthError.show(
          'No accounts found in your YNAB profile.',
          'Make sure you have at least one account in your YNAB budget, then try again.'
        );
        continueWithYnabBtn.disabled = false;
        continueWithYnabBtn.textContent = originalText;
        return;
      }
      
      state.accounts = accounts;
      persistState();
      navigate('/review', false, true);
    } catch (error) {
      console.error('Error fetching YNAB accounts:', error);
      oauthError.show(
        'Could not fetch accounts from YNAB.',
        'Your session may have expired. Try connecting to YNAB again below.'
      );
      continueWithYnabBtn.disabled = false;
      continueWithYnabBtn.textContent = originalText;
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
      // Hide any previous errors
      fileUploadError.hide();
      await handleFile(file);
    }
  });

  async function handleFile(csvFile) {
    // Validate file exists
    if (!csvFile) {
      fileUploadError.show(
        'No file selected.',
        'Please select a ZIP file exported from YNAB.'
      );
      return;
    }

    // Validate file size (max 50MB)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (csvFile.size > maxSize) {
      fileUploadError.show(
        'File is too large.',
        'Please ensure your YNAB export is under 50MB. If needed, export a smaller date range.'
      );
      return;
    }

    // Validate minimum file size
    if (csvFile.size < 100) {
      fileUploadError.show(
        'File appears to be empty or corrupted.',
        'Please re-export your data from YNAB and try again.'
      );
      return;
    }

    // Check if file is a ZIP file by extension, MIME type, or common patterns
    const fileName = csvFile.name.toLowerCase();
    const fileType = csvFile.type.toLowerCase();

    // More permissive extension check - look for common ZIP-related extensions
    const isZipByExtension = fileName.endsWith('.zip') ||
      fileName.endsWith('.bin') ||
      fileName.includes('ynab') ||
      fileName.includes('register') ||
      fileName.includes('export');

    const isZipByMimeType = [
      'application/zip',
      'application/x-zip-compressed',
      'application/octet-stream',
      'application/x-zip',
      'multipart/x-zip',
      'application/x-compressed',
      'application/binary'
    ].includes(fileType);

    const isPotentialZip = isZipByExtension || isZipByMimeType || csvFile.size > 1000;

    if (!isPotentialZip) {
      fileUploadError.show(
        'Invalid file type.',
        'Please upload a ZIP file exported from YNAB. Visit YNAB.com → Account Menu → "Export Plan" to download it.'
      );
      // Reset file input
      manualFileInput.value = '';
      return;
    }

    // Show loading state
    manualUploadButton.disabled = true;
    const originalText = manualUploadButton.textContent;
    manualUploadButton.textContent = 'Processing file...';

    try {
      const accounts = await parseYNABZip(csvFile);

      // Validate parsed accounts
      if (!accounts || typeof accounts !== 'object') {
        throw new Error('Invalid account data structure');
      }

      const accountCount = Object.keys(accounts).length;

      if (accountCount === 0) {
        fileUploadError.show(
          'No accounts found in the uploaded file.',
          'Make sure you exported the complete YNAB data including all accounts. Try exporting again from YNAB.com.'
        );
        manualUploadButton.disabled = false;
        manualUploadButton.textContent = originalText;
        manualFileInput.value = '';
        return;
      }

      // Success - save and navigate
      state.accounts = accounts;
      persistState();
      navigate('/review', false, true);

    } catch (err) {
      console.error('File parsing error:', err);

      // Provide specific error messages based on error type
      let errorMessage = 'Could not parse the uploaded file.';
      let solution = 'Please ensure it\'s a valid YNAB ZIP export. Try re-exporting from YNAB.com → Account Menu → "Export Plan".';

      // Normalize error message for case-insensitive matching
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
      }

      fileUploadError.show(errorMessage, solution);
      
      // Reset state
      manualUploadButton.disabled = false;
      manualUploadButton.textContent = originalText;
      manualFileInput.value = '';
    }
  }
}
