import { handleFile } from './fileHandler.js';
import * as API from './monarchApi.js';
import { showLoader, hideLoader, showToast } from './ui.js';
import { Logger } from './logger.js';

console.log("Can you see me?")

const subheader = document.getElementById('subheader');
const uploaderSection = document.getElementById('uploaderSection');
const uploader = document.getElementById('uploader');
const fileInput = document.getElementById('fileInput');

const conversionSection = document.getElementById('conversionSection');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const otpGroup = document.getElementById('otpGroup');
const otpInput = document.getElementById('otp');

const generateStatementFilesButton = document.getElementById('generateStatementFilesButton');
const autoImporterButton = document.getElementById('autoImporterButton');
const importMappingsButton = document.getElementById('importMappingsButton');

const mappingsSection = document.getElementById('mappingsSection');
const mappingsContainer = document.getElementById('mappingsContainer');

const downloadableFilesSection = document.getElementById('downloadableFilesSection');
const downloadableFilesContainer = document.getElementById('downloadableFilesContainer');

const startOverSection = document.getElementById('startOverSection');
const startOverButton = document.getElementById('startOverButton');

const logsSection = document.getElementById('logsSection');
const logsContainer = document.getElementById('logsContainer');

const spinnerSection = document.getElementById('spinnerSection');
const toast = document.getElementById('toast');

// Initialize logger
const logger = new Logger(logsContainer);

// Generate or load device UUID
let deviceUuid = localStorage.getItem('monarch-device-uuid');
if (!deviceUuid) {
  deviceUuid = crypto.randomUUID ? crypto.randomUUID() :
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.random() * 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  localStorage.setItem('monarch-device-uuid', deviceUuid);
}

// File upload handling
uploader.addEventListener('click', () => fileInput.click());
uploader.addEventListener('dragover', e => { e.preventDefault(); uploader.classList.add('dragover'); });
uploader.addEventListener('dragleave', () => uploader.classList.remove('dragover'));
uploader.addEventListener('drop', e => {
  e.preventDefault();
  uploader.classList.remove('dragover');
  if (e.dataTransfer.files.length) {
    handleFile(e.dataTransfer.files[0], { logsContainer });
  }
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) {
    handleFile(fileInput.files[0], { logsContainer });
  }
});

// Button listeners
generateStatementFilesButton.addEventListener('click', async () => {
  const accounts = window.accountsFromFile || {};
  if (!Object.keys(accounts).length) {
    logger.addError('No accounts found to generate statement files.');
    return showToast('No accounts to generate.', true);
  }

  showLoader();
  try {
    const response = await API.generateStatements(accounts);
    const result = await response.json
    if (!response.ok) {
      throw new Error(result.error || 'Error generating statement files.')
    }

    // Clear any existing download links
    downloadableFilesContainer.innerHTML = '';

    result.files.forEach(file => {
      const blob = new Blob([file.csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a');
      link.href = url;
      link.download = file.fileName;
      link.textContent = `Download ${file.fileName}`
      link.style.display = 'block'
      downloadableFilesContainer.appendChild(link);
    })

    downloadableFilesSection.hidden = false;
    showToast(`Statement files generated successfully`)
  } catch (err) {
    logger.addError(err.message)
    showToast(err.message, true)
  } finally {
    hideLoader();
  }
});

let awaitingOtp = false
let storedEmail, storedPassword;
autoImporterButton.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) return showToast('Enter email & password.', true);

  if (!awaitingOtp) { storedEmail = email; storedPassword = password; }
  showLoader();
  const result = await API.login(storedEmail, storedPassword, deviceUuid,
    awaitingOtp ? otpInput.value.trim() : null
  );
  hideLoader();

  if (result.otpRequired) {
    awaitingOtp = true;
    otpGroup.hidden = false;
    return showToast('OTP sent—please enter it.', false);
  }

  if (!result.token) return showToast(result.error || 'Login failed.', true);

  window.apiToken = result.token;
  showToast('Authenticated successfully.');

  const { accounts } = await API.fetchAccounts(window.apiToken);
  // display mappings in mappingsContainer
  conversionSection.hidden = true;
  mappingsSection.hidden = false;
});

importMappingsButton.addEventListener('click', async () => {
  // process mapping selections and call API.mapAccounts
});

startOverButton.addEventListener('click', () => {
  // reset application state and UI visibility
});

logsSection.addEventListener('click', () => {
  logsContainer.hidden = !logsContainer.hidden;
  document.getElementById('arrow-icon').style.transform =
    logsContainer.hidden ? 'rotate(0deg)' : 'rotate(180deg)';
});
