import { showLoader, hideLoader } from '../ui/loader.js';
import { showToast } from '../ui/toast.js';
import { Logger } from '../utils/logger.js';
import { MAX_FILE_SIZE } from '../config.js';
import { state } from '../state.js';
import { toggleSection } from '../main.js';
import { parseCsv } from '../api/parseCsv.js';

export async function handleFile(file) {
  console.group("File Upload Handler");
  if (!file) return;
  
  const logger = new Logger(document.getElementById('logsContainer'));
  logger.clear()

  console.log("File upload event:", file);

  if (file.size > MAX_FILE_SIZE) return onError('File too large.');
  if (!file.name.endsWith('.csv')) return onError('Only CSV allowed.');

  showToast(`Uploading file...`);
  showLoader()

  try {
    logger.log('Parsing file contents...')
    const csvText = await file.text();
    const result = await parseCsv(csvText);
    state.ynabAccounts = result;
    console.log("YNAB accounts:")
    console.dir(state.ynabAccounts)
    
    // Update the UI
    document.getElementById('accountCount').textContent = Object.keys(result).length;
    toggleSection('uploader-section', false);
    toggleSection('conversion', true);
    toggleSection('startOver', true);
    
    logger.log('Parsed and grouped successfully.');
  } catch (error) {
    console.error("Error during file handling:", error);
    onError(error.message);
  } finally {
    hideLoader();
    console.groupEnd("File Upload Handler")
  }

  function onError(msg) {
    showToast(msg, true);
    logger.error(msg);
  }
}
