import { initDeviceUuid } from './utils/device.js';
import { state } from './state.js';
import { handleFile } from './handlers/fileHandler.js';
import { generateAccounts } from './handlers/accountGenerator.js';
import { autoImport } from './handlers/importer.js';
import { Logger } from './utils/logger.js';

// Initialize
state.deviceUuid = initDeviceUuid();
const logger = new Logger(document.getElementById('logsContainer'));

// Event Bindings
bind('#uploader', 'click', () => document.getElementById('fileInput').click());
bind('#fileInput', 'change', e => handleFile(e.target.files[0]));
bind('[data-action="generate"]', 'click', generateAccounts);
bind('[data-action="import"]', 'click', () => {
  const email = '#email'.val();
  const pwd = '#password'.val();
  const otp = state.awaitingOtp ? document.getElementById('otp').value : null;
  autoImport(email, pwd, otp);
});
bind('[data-action="downloadAll"]', 'click', generateAccounts);
bind('[data-action="reset"]', () => window.location.reload());
bind('[data-action="toggleLogs"]', 'click', toggleLogs);

// Bind opening of modals for specific triggers
bind('#howItWorksLink', 'click', (e) => {
  e.preventDefault();
  openModal('infoModal');
});
bind('#howToFindRegisterFile', 'click', (e) => {
  e.preventDefault();
  openModal('registerFileModal');
});
bind('#preDownloadHowToImportLink', 'click', (e) => {
  e.preventDefault();
  openModal('manualImportModal');
});
bind('#postDownloadHowToImportLink', 'click', (e) => {
  e.preventDefault();
  openModal('manualImportModal');
});
// Reusable binding to close any modal via its close button
document.querySelectorAll('.modal .close').forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.modal');
    if (modal && modal.id) {
      closeModal(modal.id);
    }
  });
});
window.addEventListener('click', (event) => {
  document.querySelectorAll('.modal').forEach(modal => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('hidden');
    modal.style.display = 'flex';
    document.body.classList.add('modal-open');
  } else {
    console.warn(`openModal: No modal found with id "${modalId}"`);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('hidden');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  } else {
    console.warn(`closeModal: No modal found with id "${modalId}"`);
  }
}

export function toggleSection(id, show = true) {
  document.getElementById(id).classList.toggle('hidden', !show);
}

export function toggleLogs() {
  toggleSection('logsContainer');
}

function bind(selector, event, handler) {
  const el = document.querySelector(selector);
  if (!el) {
    console.warn(`bind: No element found for selector: ${selector}`);
    return;
  }
  el.addEventListener(event, handler);
}
