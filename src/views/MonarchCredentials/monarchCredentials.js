import { v4 as uuidv4 } from 'uuid';
import state from '../../state.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { monarchApi } from '../../api/monarchApi.js';
import { toggleElementVisibility, toggleDisabled } from '../../utils/dom.js';
import {
  loadCredentialsFromStorage,
  saveCredentialsToStorage,
  saveTokenToStorage,
  saveDeviceUuid,
  clearStorage
} from '../../utils/storage.js';


export default function initMonarchCredentialsView() {
  const emailInput = document.getElementById('email');
  const connectBtn = document.getElementById('connectBtn');
  const backBtn = document.getElementById('backBtn');
  const form = document.getElementById('credentialsForm');
  const errorBox = document.getElementById('errorBox');
  const rememberCheckbox = document.getElementById('rememberCredentials');
  const rememberMeContainer = document.getElementById('rememberMe')
  const notYouContainer = document.getElementById('notYouContainer');
  const rememberedEmail = document.getElementById('rememberedEmail');
  const clearCredentialsBtn = document.getElementById('clearCredentialsBtn');
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeShow = document.getElementById('eyeShow');
  const eyeHide = document.getElementById('eyeHide');
  const securityNoteMsg = document.getElementById('securityNote');
  const securityNoteIcon = document.getElementById('securityNoteIcon');


  renderButtons();

  const { credentials: creds } = state;

  // Load from localStorage into state
  const { token, email, password, uuid } = loadCredentialsFromStorage();
  Object.assign(creds, {
    email,
    password,
    apiToken: creds.apiToken || token,
    deviceUuid: creds.deviceUuid || uuid || uuidv4()
  });

  // Generate device UUID once on view load
  if (!uuid) {
    state.deviceUuid = uuidv4();
    saveDeviceUuid(state.deviceUuid);
  }

  // Pre-populate fields if credentials already exist in state
  if (email && password) {
    emailInput.value = email;
    passwordInput.value = password;
    rememberedEmail.textContent = `Signed in as ${email}`;
    rememberCheckbox.checked = creds.remember;

    toggleDisabled(emailInput, true);
    toggleDisabled(passwordInput, true);
    toggleElementVisibility(rememberMeContainer, false);
    toggleElementVisibility(notYouContainer, true);
    toggleElementVisibility(toggleBtn, false);
    updateSecurityNote('signed-in')
  } else {
    toggleElementVisibility(notYouContainer, false);
    updateSecurityNote()
  }

  function validateForm() {
    const isValid = emailInput.value.trim() && passwordInput.value.trim();
    toggleDisabled(connectBtn, !isValid)
    toggleElementVisibility(errorBox, false);
    renderButtons();
  }

  function updateSecurityNote(status) {
    const COLOR = {
      GREEN: '#006400',
      BLUE: '#1993e5',
      ORANGE: '#ff8c00',
    }

    switch (status) {
      case 'remembered':
        securityNoteMsg.textContent = 'Your credentials will be stored securely on this device.';
        securityNoteIcon.setAttribute('fill', COLOR.ORANGE);
        break;
      case 'signed-in':
        securityNoteMsg.textContent = 'You are signed in. To use different credentials, click "Not you?".';
        securityNoteIcon.setAttribute('fill', COLOR.BLUE);
        break;
      default:
        securityNoteMsg.textContent = 'Your credentials will not be stored.';
        securityNoteIcon.setAttribute('fill', COLOR.GREEN);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    connectBtn.click();
  })

  connectBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const localStorage = loadCredentialsFromStorage();
    const email = localStorage.monarchEmail || emailInput.value.trim();
    const password = localStorage.monarchPassword || passwordInput.value.trim();
    const uuid = localStorage.deviceUuid || state.credentials.deviceUuid;

    toggleDisabled(connectBtn, true);
    connectBtn.textContent = 'Connecting…';
    toggleElementVisibility(errorBox, false);

    try {
      const response = await monarchApi.login(email, password, uuid);

      Object.assign(creds, {
        email,
        password,
        otp: '',
        remember: rememberCheckbox.checked
      });

      if (creds.remember) {
        saveCredentialsToStorage(email, password);
      }

      // OTP required
      if (response.otpRequired) {
        creds.awaitingOtp = true;
        navigate("monarchOtpView")
        return
      }

      // ✅ Successful login — store token
      if (response.token) {
        creds.apiToken = response.token;
        creds.awaitingOtp = false;

        // Store Monarch API token if "Remember me" is checked
        if (creds.remember) saveTokenToStorage(response.token);

        navigate('monarchCompleteView');
        return;
      }

      throw new Error('Unexpected login response.');
    } catch (err) {
      console.error("Login error", err);
      errorBox.textContent = err?.message || 'An unexpected error occurred.';
      toggleElementVisibility(errorBox, true)
    } finally {
      toggleDisabled(connectBtn, false);
      connectBtn.textContent = 'Connect to Monarch';
    }
  });

  clearCredentialsBtn.addEventListener('click', e => {
    e.preventDefault();

    clearStorage();
    Object.assign(creds, {
      email: '',
      password: '',
      otp: '',
      remember: false,
      apiToken: '',
      awaitingOtp: false,
      deviceUuid: ''
    });

    emailInput.value = '';
    passwordInput.value = '';
    rememberCheckbox.checked = false;

    toggleDisabled(emailInput, false);
    toggleDisabled(passwordInput, false);
    toggleDisabled(connectBtn, true)
    toggleElementVisibility(toggleBtn, true);
    toggleElementVisibility(notYouContainer, false);
    toggleElementVisibility(rememberMeContainer, true);
    updateSecurityNote()
    renderButtons();
    emailInput.focus();
  });

  rememberCheckbox.addEventListener('change', () => {
    creds.remember = rememberCheckbox.checked;
    updateSecurityNote(creds.remember ? 'remembered' : 'not-remembered');

    const target = emailInput.value.trim() === '' ? emailInput : passwordInput.value.trim() === '' ? passwordInput : connectBtn;
    target.focus();
  });

  toggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    toggleElementVisibility(eyeShow, !isHidden);
    toggleElementVisibility(eyeHide, isHidden);
  });

  [emailInput, passwordInput].forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('focus', () => input.classList.add('ring-2', 'ring-blue-500', 'outline-none'));
    input.addEventListener('blur', () => input.classList.remove('ring-2', 'ring-blue-500', 'outline-none'));
  });

  backBtn.addEventListener('click', () => navigate('methodView'));

  validateForm();
}
