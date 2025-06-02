import state from '../../state.js';
import { navigate } from '../../router.js';
import parseYNABCSV from '../../services/ynabParser.js';
import { openModal, closeModal } from '../../components/modal.js';

export default function initUploadView() {
  const browseButton = document.getElementById('browseButton');
  const fileInput = document.getElementById('fileInput');
  const uploadBox = document.getElementById('uploadBox');
  const errorMessage = document.getElementById('errorMessage');
  const howItWorksBtn = document.getElementById('howItWorksBtn');
  const closeModalBtn = document.getElementById('closeHowItWorksModal');

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
    if (!file.name.endsWith('.csv')) {
      errorMessage.textContent = 'Please upload a valid CSV file.';
      errorMessage.classList.remove('hidden');
      return;
    }

    try {
      const parsedData = await parseYNABCSV(file);
      state.registerData = parsedData;
      console.log("State:", state)

      navigate('review');
    } catch (err) {
      errorMessage.textContent = 'Failed to parse file. Please ensure it is a valid YNAB register export.';
      errorMessage.classList.remove('hidden');
      console.error(err);
    }
  }
}
