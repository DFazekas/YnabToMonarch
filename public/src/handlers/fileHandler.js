import { showLoader, hideLoader } from '../ui/loader.js';
import { showToast } from '../ui/toast.js';
import { Logger } from '../utils/logger.js';
import { MAX_FILE_SIZE } from '../config.js';
import { state } from '../state.js';
import { toggleSection } from '../main.js';

export async function handleFile(file) {
  const logger = new Logger(document.getElementById('logsContainer'));
  logger.clear()

  console.log("File upload event:", file);

  if (file.size > MAX_FILE_SIZE) return onError('File too large.');
  if (!file.name.endsWith('.csv')) return onError('Only CSV allowed.');

  showLoader()

  try {
    logger.log('Parsing file contents...')
    const csvText = await file.text();
    const result = await fetch('http://localhost:3000/dev/parseCsv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csvText })
    }).then(res => res.json());

    state.accounts = result;
    // Hide file uploader and show action buttons plus reset
    toggleSection('uploader', false);
    toggleSection('conversion', true);
    toggleSection('startOver', true);
    logger.log('Parsed and grouped successfully.');
  } catch (error) {
    console.error("Error during file handling:", error);
    onError(error.message);
  } finally {
    hideLoader();
  }

  function onError(msg) {
    showToast(msg, true);
    logger.error(msg);
    hideLoader();
  }
}
