import { showLoader, hideLoader, showToast } from './ui.js';
import { parseCsv } from "./parseCsv.js"
import { Logger } from './logger.js';

export async function handleFile(file, { logsContainer }) {
  const logger = new Logger(logsContainer);
  logger.clear()

  // Validate File Size (Max 2MB)
  if (file.size > 2 * 1024 * 1024) {
    showToast('Uploaded file is too large (greater than 2MB).', true);
    logger.addError('Uploaded file exceeds the 2MB size limit.');
    return;
  }

  // Validate File Type
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    showToast('Only CSV files are allowed.', true);
    logger.addError('Invalid file type. Please upload a CSV file.');
    return;
  }

  // Start processing
  showLoader()
  const startTime = Date.now();
  try {
    // Parse CSV
    logger.add('Parsing file contents...')
    const accounts = await parseCsv(csvText)
    logger.add('File parsed successfully.')

    // Group transactions by account
    window.accountsFromFile = accounts
    document.getElementById('conversionSection').hidden = false;
    document.getElementById('uploaderSection').hidden = true;

    logger.add('Transactions grouped by account successfully.')

  } catch (error) {
    console.error('Error processing CSV contents:', error);
    showToast('Failed to process CSV contents.', true);
    logger.addError("Error processing CSV contents.");
  } finally {
    showToast('Error parsing CSV file.', true)
    hideLoader(startTime);
  }
}
