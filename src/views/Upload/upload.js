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
