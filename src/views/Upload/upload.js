import state from '../../state.js';
import { navigate, persistState } from '../../router.js';
import parseYNABZip from '../../services/ynabParser.js';
import { openModal, closeModal } from '../../components/modal.js';
import { renderButtons } from '../../components/button.js';

export default function initUploadView() {
  const browseButton = document.getElementById('browseButton');
  const fileInput = document.getElementById('fileInput');
  const uploadBox = document.getElementById('uploadBox');
  const errorMessage = document.getElementById('errorMessage');
  const howItWorksBtn = document.getElementById('howItWorksBtn');
  const closeModalBtn = document.getElementById('closeHowItWorksModal');

  renderButtons();

  howItWorksBtn.addEventListener('click', () => {
    openModal('howItWorksModal');
  });

  closeModalBtn.addEventListener('click', () => {
    closeModal('howItWorksModal');
  });

  // Drag & Drop functionality
  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('border-blue-400', 'bg-blue-50');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('border-blue-400', 'bg-blue-50');
  });

  uploadBox.addEventListener('drop', async (e) => {
    e.preventDefault();
    uploadBox.classList.remove('border-blue-400', 'bg-blue-50');
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  });

  // File picker click
  browseButton.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) await handleFile(file);
  });

  async function handleFile(csvFile) {
    // Check if file is a ZIP file by extension, MIME type, or common patterns
    const fileName = csvFile.name.toLowerCase();
    const fileType = csvFile.type.toLowerCase();
    
    const isZipByExtension = fileName.endsWith('.zip') || fileName.endsWith('.bin');
    const isZipByMimeType = [
      'application/zip',
      'application/x-zip-compressed', 
      'application/octet-stream',
      'application/x-zip',
      'multipart/x-zip'
    ].includes(fileType);
    
    // Additional check: if it's a .bin file, it might be a ZIP on Android
    const isPotentialZip = isZipByExtension || isZipByMimeType || 
                          (fileName.endsWith('.bin') && csvFile.size > 1000); // Basic size check for .bin files

    if (!isPotentialZip) {
      errorMessage.textContent = 'Please upload a ZIP export from YNAB.';
      errorMessage.classList.remove('hidden');
      return;
    }

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
