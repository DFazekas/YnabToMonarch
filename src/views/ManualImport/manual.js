import { navigate } from '../../router.js';
import { openModal, closeModal } from '../../components/modal.js';

export default function initManualImportView() {
  const downloadBtn = document.getElementById('downloadZipBtn');
  const backBtn = document.getElementById('backBtn');
  const importGuideBtn = document.getElementById('importGuideBtn');
  const closeImportGuideBtn = document.getElementById('closeImportGuideModal');

  // Handle ZIP download
  downloadBtn.addEventListener('click', () => {
    console.log("Starting ZIP download...");
    alert("Download not yet implemented");
  });

  // Open modal on click
  importGuideBtn.addEventListener('click', () => {
    openModal('importGuideModal');
  });

  // Close modal
  closeImportGuideBtn.addEventListener('click', () => {
    closeModal('importGuideModal');
  });

  // Handle back navigation
  backBtn.addEventListener('click', () => {
    navigate('method');
  });
}
