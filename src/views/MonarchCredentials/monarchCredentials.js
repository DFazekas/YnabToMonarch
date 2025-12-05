import { v4 as uuidv4 } from 'uuid';
import state from '../../state.js';
import { navigate } from '../../router.js';
import { monarchApi } from '../../api/monarchApi.js';
import { toggleElementVisibility, toggleDisabled } from '../../utils/dom.js';
import {
  saveToLocalStorage, getLocalStorage, clearStorage
} from '../../utils/storage.js';
import { encryptPassword } from '../../../shared/crypto.js';
import { patchState, clearState } from '../../utils/state.js';
import { renderPageLayout } from '../../components/pageLayout.js';


export default async function initMonarchCredentialsView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Auto Import: Connect Your Monarch Account',
      description: 'Authorize your Monarch account so we can directly import your accounts and transactions.',
      containerId: 'pageHeader'
    }
  });

  const $ = (id) => document.getElementById(id);
  const UI = {
    emailInput: $('email'),
    passwordInput: $('password'),
    connectBtn: $('connectBtn'),
    backBtn: $('backBtn'),
    form: $('credentialsForm'),
    errorBox: $('errorBox'),
    errorContainer: $('credentialsError'),
    rememberCheckbox: $('rememberCredentials'),
    rememberMeContainer: $('rememberMe'),
    notYouContainer: $('notYouContainer'),
    rememberedEmail: $('rememberedEmail'),
    clearCredentialsBtn: $('clearCredentialsBtn'),
    toggleBtn: $('togglePassword'),
    eyeShow: $('eyeShow'),
    eyeHide: $('eyeHide'),
    securityNoteMsg: $('securityNote'),
    securityNoteIcon: $('securityNoteIcon')
  };

  const { credentials: creds } = state;

  // Load from localStorage into state
  const { token, email, encryptedPassword, uuid, remember } = getLocalStorage();
  patchState(creds, {
    email,
    encryptedPassword,
    apiToken: creds.apiToken || token,
    deviceUuid: creds.deviceUuid || uuid,
    remember
  });

  // Generate device UUID once on view load
  if (!creds.deviceUuid || creds.deviceUuid === '') {
    creds.deviceUuid = uuidv4();
    saveToLocalStorage({ uuid: creds.deviceUuid });
  }

  // Pre-populate fields if credentials already exist
  if (email && encryptedPassword) {
    UI.emailInput.value = email;
    UI.passwordInput.value = ''
    UI.rememberedEmail.textContent = `Signed in as ${email}`;
    UI.rememberCheckbox.checked = creds.remember;

    toggleDisabled(UI.emailInput, true);
    toggleDisabled(UI.passwordInput, true);
    toggleElementVisibility(UI.rememberMeContainer, false);
    toggleElementVisibility(UI.notYouContainer, true);
    toggleElementVisibility(UI.toggleBtn, false);
    updateSecurityNote('signed-in')
  } else {
    toggleElementVisibility(UI.notYouContainer, false);
    updateSecurityNote()
  }

  function validateForm() {
    const hasEmail = UI.emailInput.value.trim();
    const hasPassword = UI.passwordInput.value.trim() || creds.encryptedPassword;
    toggleDisabled(UI.connectBtn, !(hasEmail && hasPassword));
    toggleElementVisibility(UI.errorContainer, false);
  }

  function updateSecurityNote(status) {
    const COLOR = {
      GREEN: '#006400',
      BLUE: '#1993e5',
      ORANGE: '#ff8c00',
    }

    switch (status) {
      case 'remembered':
        UI.securityNoteMsg.textContent = 'Your credentials will be stored securely on this device.';
        UI.securityNoteIcon.setAttribute('fill', COLOR.ORANGE);
        break;
      case 'signed-in':
        UI.securityNoteMsg.textContent = 'You are signed in. To use different credentials, click "Not you?".';
        UI.securityNoteIcon.setAttribute('fill', COLOR.BLUE);
        break;
      default:
        UI.securityNoteMsg.textContent = 'Your credentials will not be stored.';
        UI.securityNoteIcon.setAttribute('fill', COLOR.GREEN);
    }
  }

  function onSubmitForm(e) {
    e.preventDefault();
    UI.connectBtn.click();
  }

  async function handleLoginAttempt() {
    const storage = getLocalStorage();
    const email = UI.emailInput.value.trim() || storage.email;
    const plaintextPassword = UI.passwordInput.value.trim();
    let encryptedPassword = creds.encryptedPassword || storage.encryptedPassword;
    const uuid = creds.deviceUuid || storage.uuid;

    if (!encryptedPassword && plaintextPassword) {
      try {
        encryptedPassword = await encryptPassword(email, plaintextPassword);
      } catch (err) {
        showError('Failed to encrypt password.');
        return;
      }
    }

    toggleDisabled(UI.connectBtn, true);
    UI.connectBtn.textContent = 'Connecting…';
    toggleElementVisibility(UI.errorContainer, false);

    try {
      const response = await monarchApi.login(email, encryptedPassword, uuid);

      if (response?.otpRequired) {
        // Always store credentials temporarily for OTP flow, regardless of "remember me" setting
        // We'll handle the permanent storage decision in the OTP page based on the remember flag
        saveToLocalStorage({
          email,
          encryptedPassword,
          uuid: uuid,
          remember: creds.remember,
          tempForOtp: !creds.remember // Flag to indicate this is temporary storage
        });

        creds.awaitingOtp = true;
        return navigate("/otp");
      }

      if (response?.token) {
        patchState(creds, {
          email,
          encryptedPassword,
          otp: '',
          remember: UI.rememberCheckbox.checked,
          apiToken: response.token,
          awaitingOtp: false
        });

        if (creds.remember) {
          saveToLocalStorage({ email, encryptedPassword, token: response.token, remember: true });
        }

        return navigate('/complete');
      }

      const apiError = response?.detail || response?.error || "Unexpected login response."
      throw new Error(apiError);
    } catch (err) {
      showError(err.message);
    } finally {
      toggleDisabled(UI.connectBtn, false);
      UI.connectBtn.textContent = 'Connect to Monarch';
    }
  }

  async function onClickConnect(e) {
    e.preventDefault();
    await handleLoginAttempt();
  }

  function onClickClearCredentials(e) {
    e.preventDefault();
    clearStorage();
    clearState(creds);

    // Generate a new device UUID after clearing credentials
    creds.deviceUuid = uuidv4();
    saveToLocalStorage({ uuid: creds.deviceUuid });

    UI.emailInput.value = '';
    UI.passwordInput.value = '';
    UI.rememberCheckbox.checked = false;

    toggleDisabled(UI.emailInput, false);
    toggleDisabled(UI.passwordInput, false);
    toggleDisabled(UI.connectBtn, true);
    toggleElementVisibility(UI.toggleBtn, true);
    toggleElementVisibility(UI.notYouContainer, false);
    toggleElementVisibility(UI.rememberMeContainer, true);
    updateSecurityNote();
    UI.emailInput.focus();
  }

  function onChangeRemember() {
    creds.remember = UI.rememberCheckbox.checked;
    updateSecurityNote(creds.remember ? 'remembered' : 'not-remembered');

    const target = UI.emailInput.value.trim() === ''
      ? UI.emailInput
      : UI.passwordInput.value.trim() === ''
        ? UI.passwordInput
        : UI.connectBtn;
    target.focus();
  }

  function onTogglePassword() {
    const isHidden = UI.passwordInput.type === 'password';
    UI.passwordInput.type = isHidden ? 'text' : 'password';
    UI.toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    toggleElementVisibility(UI.eyeShow, !isHidden);
    toggleElementVisibility(UI.eyeHide, isHidden);
  }

  function showError(message) {
    UI.errorBox.textContent = message;
    toggleElementVisibility(UI.errorContainer, true);
  }

  UI.form.addEventListener('submit', onSubmitForm);
  UI.connectBtn.addEventListener('click', onClickConnect);
  UI.clearCredentialsBtn.addEventListener('click', onClickClearCredentials);
  UI.rememberCheckbox.addEventListener('change', onChangeRemember);
  UI.toggleBtn.addEventListener('click', onTogglePassword);

  [UI.emailInput, UI.passwordInput].forEach(input => {
    input.addEventListener('input', validateForm);
    input.addEventListener('focus', () => input.classList.add('ring-2', 'ring-blue-500', 'outline-none'));
    input.addEventListener('blur', () => input.classList.remove('ring-2', 'ring-blue-500', 'outline-none'));
  });

  validateForm();
}
