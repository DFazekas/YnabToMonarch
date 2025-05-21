import { initDeviceUuid } from './utils/device.js';
import { state } from './state.js';
import { handleFile } from './handlers/fileHandler.js';
import { generateAccounts } from './handlers/accountGenerator.js';
import { autoImport } from './handlers/importer.js';
import { Logger } from './utils/logger.js';
import { bind } from './utils/dom.js';
import { initModalControls } from './ui/modal.js';


// Initialize
state.deviceUuid = initDeviceUuid();
const logger = new Logger(document.getElementById('logsContainer'));


// Event Bindings
bind('#uploader', 'click', () => document.getElementById('fileInput').click());
bind('#fileInput', 'change', e => handleFile(e.target.files[0]));
bind('[data-action="import"]', 'click', () => {
  const email = '#email'.val();
  const pwd = '#password'.val();
  const otp = state.awaitingOtp ? document.getElementById('otp').value : null;
  autoImport(email, pwd, otp);
});
bind('[data-action="generate"]', 'click', generateAccounts);
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

export function initializeApp() {
  // Reset in-memory state
  state.awaitingOtp = false;
  state.apiToken = null;
  state.accounts = null;

  // Clear logs
  logger.clear();

  // Show only the uploader, hide everything else
  [
    'uploader-section',
    'conversion',
    'importDetails',
    'credentials',
    'mappings',
    'startOver',
    'logsContainer'
  ].forEach(id => toggleSection(id, id === 'uploader-section'));
}
