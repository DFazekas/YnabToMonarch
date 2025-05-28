import { initDeviceUuid } from './utils/device.js';
import { state } from './state.js';
import { handleFile } from './handlers/uploadFile.js';
import { downloadZip } from './handlers/downloadZip.js';
import { startAutoImport, login, submitOtp } from './handlers/importer.js';
import { Logger } from './utils/logger.js';
import { bind } from './utils/dom.js';
import { initModalControls } from './ui/modal.js';

// Initialize
state.deviceUuid = initDeviceUuid();
const logger = new Logger(document.getElementById('logsContainer'));


// Event Bindings
bind('#uploader', 'click', () => document.getElementById('fileInput').click());
bind('#fileInput', 'change', e => handleFile(e.target.files[0]));
bind('[data-action="start-auto-import"]', 'click', startAutoImport)
bind('[data-action="login"]', 'click', login)
bind('#verifyOtp', 'click', submitOtp)
bind('#resendOtp', 'click', login)
bind('[data-action="download-zip"]', 'click', downloadZip);
bind('[data-action="reset"]', 'click', initializeApp);
bind('[data-action="toggleLogs"]', 'click', toggleLogs);

// Initialize modal handlers
initModalControls();

initializeApp();

export function toggleSection(id, show = true) {
  document.getElementById(id).classList.toggle('hidden', !show);
}

export function toggleLogs() {
  toggleSection('logsContainer');
}

export async function initializeApp() {
  // Reset in-memory state
  state.awaitingOtp = false;
  state.apiToken = null;

  // const mockYnabData = await fetch('/src/tests/mockYnabAccounts.json');
  // state.ynabAccounts = await mockYnabData.json();
  state.ynabAccounts = null;

  // const mockMonarchData = await fetch('/src/tests/mockMonarchAccounts.json');
  // state.monarchAccounts = await mockMonarchData.json();
  state.monarchAccounts = null;

  console.log("Ynab accounts:", state.ynabAccounts);
  console.log("Monarch accounts:", state.monarchAccounts);

  document.getElementById('fileInput').value = '';

  // initializeMappingSection()

  // Clear logs
  logger.clear();

  // Show only the uploader, hide everything else
  [
    'uploader-section',
    'conversion',
    'importDetails',
    'credentials',
    'step1',
    'step2',
    'startOver',
    'logsContainer'
  ].forEach(id => toggleSection(id, id === 'uploader-section'));
}
