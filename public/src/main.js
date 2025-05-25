import { initDeviceUuid } from './utils/device.js';
import { state } from './state.js';
import { handleFile } from './handlers/uploadFile.js';
import { downloadZip } from './handlers/downloadZip.js';
import { startAutoImport, login, submitOtp } from './handlers/importer.js';
import { Logger } from './utils/logger.js';
import { bind } from './utils/dom.js';
import { initModalControls } from './ui/modal.js';
import { displayMappingSection } from './handlers/displayMappingSection.js';

// TODO - Fix restart button; uploading files doesn't work.

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
  const mockYnabData = await fetch('/src/tests/mockYnabAccounts.json');
  // state.ynabAccounts = null;
  state.ynabAccounts = await mockYnabData.json();
  const mockMonarchData = await fetch('/src/tests/mockMonarchAccounts.json');
  // state.monarchAccounts = null;
  state.monarchAccounts = await mockMonarchData.json();

  console.log("Ynab accounts:", state.ynabAccounts);
  console.log("Monarch accounts:", state.monarchAccounts);

  displayMappingSection(state.ynabAccounts, state.monarchAccounts);

  // Clear logs
  logger.clear();

  // Show only the uploader, hide everything else
  [
    'uploader-section',
    'conversion',
    'importDetails',
    'credentials',
    // 'mappings',
    'startOver',
    'logsContainer'
  ].forEach(id => toggleSection(id, id === 'uploader-section'));
}
