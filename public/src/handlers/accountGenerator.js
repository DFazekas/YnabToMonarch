import { monarchApi } from '../api/monarchApi.js';
import { showLoader, hideLoader } from '../ui/loader.js';
import { showToast } from '../ui/toast.js';
import { state } from '../state.js';
import { toggleSection } from '../main.js';

export async function generateAccounts() {
  if (!state.accounts) return showToast('No accounts to process.', true);
  
  showToast(`Downloading...`);
  showLoader();
  try {
    // Hide action buttons when Auto-Import is pressed.
    toggleSection('conversion', false);

    const response = await monarchApi.generateAccounts(state.accounts);
    const data = await response.json();

    const zip = new window.JSZip();
    data.files.forEach(f => zip.file(f.fileName, f.csv));

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    downloadBlob(url, 'ynab_accounts.zip');

    showToast(`Generated ${data.files.length} files.`);
    toggleSection('importDetails');
  } catch (e) {
    console.error("Error during account generation:", e);
    showToast(e.message, true);
  } finally {
    hideLoader();
  }
}

function downloadBlob(url, name) {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
}
