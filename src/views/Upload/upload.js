import state from '../../state.js';
import { navigate, persistState } from '../../router.js';
import parseYNABZip from '../../services/ynabParser.js';
import { redirectToYnabOauth } from '../../api/ynabApi.js';
import { openModal, closeModal } from '../../components/modal.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initUploadView() {
  // Check if we have existing accounts data
  const hasExistingAccounts = state.accounts && Object.keys(state.accounts).length > 0;

  renderPageLayout({
    navbar: {
      showBackButton: hasExistingAccounts,
      showDataButton: true
    },
    header: {
      title: 'Step 1: Import YNAB Data',
      description: 'Choose how you\'d like to bring your YNAB data into Monarch Money. You can either connect your YNAB account for a seamless transfer or manually upload a file.',
      containerId: 'pageHeader'
    }
  });

  // Show existing data alert if needed
  const existingDataAlert = document.getElementById('existingDataAlert');
  if (hasExistingAccounts && existingDataAlert) {
    existingDataAlert.classList.remove('hidden');
  }

  // Query all elements (they're already in the DOM)
  const continueWithExistingBtn = document.getElementById('continueWithExistingBtn');
  const connectButton = document.getElementById('connectButton');
  const manualUploadButton = document.getElementById('manualUploadButton');
  const manualFileInput = document.getElementById('manualFileInput');
  const oauthInfoModalButton = document.getElementById('oauthInfoModalButton');
  const manualImportInfoModalButton = document.getElementById('manualImportInfoModalButton');
  const closeOauthInfoModal = document.getElementById('closeOauthInfoModal');
  const closeManualImportInfoModal = document.getElementById('closeManualImportInfoModal');

  // Continue with existing data
  continueWithExistingBtn?.addEventListener('click', (event) => {
    event.preventDefault();
    // Skip route guards since we already have accounts
    navigate('/review', false, true);
  });

  connectButton?.addEventListener('click', (event) => {
    event.preventDefault();
    redirectToYnabOauth();
  });

  oauthInfoModalButton?.addEventListener('click', () => openModal('oauthInfoModal'));
  manualImportInfoModalButton?.addEventListener('click', () => openModal('manualImportInfoModal'));
  closeOauthInfoModal?.addEventListener('click', () => closeModal('oauthInfoModal'));
  closeManualImportInfoModal?.addEventListener('click', () => closeModal('manualImportInfoModal'));

  manualUploadButton?.addEventListener('click', (e) => {
    e.preventDefault();
    manualFileInput?.click();
  });
  manualFileInput?.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) await handleFile(file);
  });

  async function handleFile(csvFile) {
    // Check if file is a ZIP file by extension, MIME type, or common patterns
    const fileName = csvFile.name.toLowerCase();
    const fileType = csvFile.type.toLowerCase();

    console.log('File upload debug:', {
      name: csvFile.name,
      type: csvFile.type,
      size: csvFile.size,
      fileName: fileName,
      fileType: fileType
    });

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

    // Very permissive check - if file is larger than 1KB, let's try to parse it
    // The ZIP parser will ultimately determine if it's valid
    const isPotentialZip = isZipByExtension ||
      isZipByMimeType ||
      csvFile.size > 1000; // If it's bigger than 1KB, let the parser decide

    console.log('File validation debug:', {
      isZipByExtension,
      isZipByMimeType,
      isPotentialZip,
      fileSize: csvFile.size
    });

    if (!isPotentialZip) {
      console.log('File rejected - not a potential ZIP');
      errorMessage.textContent = 'Please upload a ZIP export from YNAB.';
      errorMessage.classList.remove('hidden');
      return;
    }

    console.log('File accepted, attempting to parse...');
    try {
      const accounts = await parseYNABZip(csvFile);
      state.accounts = accounts;
      persistState();

      // Ensure we have accounts before navigating
      if (accounts && Object.keys(accounts).length > 0) {
        // Skip route guards since we just set the accounts
        navigate('/review', false, true);
      } else {
        errorMessage.textContent = 'No accounts found in the uploaded file.';
        errorMessage.classList.remove('hidden');
      }
    } catch (err) {
      errorMessage.textContent = 'Failed to parse file. Please ensure it\'s a valid YNAB ZIP export with register.csv and plan.csv.';
      errorMessage.classList.remove('hidden');
      console.error(err);
    }
  }
}
