import JSZip from 'jszip';
import state from '../../state.js';
import { navigate } from '../../router.js';
import parseYNABCSV from '../../services/ynabParser.js';
import { openModal, closeModal } from '../../components/modal.js';
import { enhanceButtons } from '../../components/button.js';

export default function initUploadView() {
  const browseButton = document.getElementById('browseButton');
  const fileInput = document.getElementById('fileInput');
  const uploadBox = document.getElementById('uploadBox');
  const errorMessage = document.getElementById('errorMessage');
  const howItWorksBtn = document.getElementById('howItWorksBtn');
  const closeModalBtn = document.getElementById('closeHowItWorksModal');

  enhanceButtons();

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

  async function handleFile(file) {
    const isCSV = file.name.endsWith('.csv');
    const isZIP = file.name.endsWith('.zip');

    if (!isCSV && !isZIP) {
      errorMessage.textContent = 'Please upload a CSV or ZIP file.';
      errorMessage.classList.remove('hidden');
      return;
    }

    try {
      let csvFile;

      if (isZIP) {
        const zip = await JSZip.loadAsync(file);
        const registerEntry = Object.values(zip.files).find(f => f.name.toLowerCase().includes('register') && f.name.endsWith('.csv'));

        if (!registerEntry) {
          errorMessage.textContent = 'ZIP file does not contain a register CSV file.';
          errorMessage.classList.remove('hidden');
          return;
        }

        const csvContent = await registerEntry.async('blob');
        csvFile = new File([csvContent], registerEntry.name, { type: 'text/csv' });
      } else {
        csvFile = file;
      }

      const parsedData = await parseYNABCSV(csvFile);
      state.registerData = parsedData;

      console.log("Parsed register data:", state.registerData);
      navigate('reviewView');
    } catch (err) {
      errorMessage.textContent = 'Failed to parse file. Please ensure it is a valid YNAB register CSV or ZIP export.';
      errorMessage.classList.remove('hidden');
      console.error(err);
    }
  }
}
