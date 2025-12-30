import state from '../../state.js';
import { navigate } from '../../router.js';
import { toggleElementVisibility, toggleDisabled } from '../../utils/dom.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import { initCredentials, attemptLogin, clearCredentialsAndReset } from './monarchCredentialsData.js';


export default async function initMonarchCredentialsView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 4: Auto Migration',
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

  const { creds } = initCredentials(state);

  // Pre-populate fields if credentials already exist
  if (creds.email && creds.encryptedPassword) {
    UI.emailInput.value = creds.email;
    UI.passwordInput.value = '';
    UI.rememberedEmail.textContent = `Signed in as ${creds.email}`;
    UI.rememberCheckbox.checked = creds.remember;

    toggleDisabled(UI.emailInput, true);
    toggleDisabled(UI.passwordInput, true);
    toggleElementVisibility(UI.rememberMeContainer, false);
    toggleElementVisibility(UI.notYouContainer, true);
    toggleElementVisibility(UI.toggleBtn, false);
    updateSecurityNote('signed-in');
  } else {
    toggleElementVisibility(UI.notYouContainer, false);
    updateSecurityNote();
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
        UI.securityNoteMsg.innerHTML = 'Your credentials will be encrypted and saved to this device. <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">Manage stored data</a>.';
        UI.securityNoteIcon.setAttribute('fill', COLOR.ORANGE);
        break;
      case 'signed-in':
        UI.securityNoteMsg.innerHTML = 'Currently signed in. To use different credentials, click "Not you?" or <a href="#" data-nav="/data-management" class="text-blue-600 hover:text-blue-800 underline">manage your data</a>.';
        UI.securityNoteIcon.setAttribute('fill', COLOR.BLUE);
        break;
      default:
        UI.securityNoteMsg.textContent = 'Your credentials will only be used for this session and will not be saved.';
        UI.securityNoteIcon.setAttribute('fill', COLOR.GREEN);
    }
    
    // Attach navigation handlers to links
    const links = UI.securityNoteMsg.querySelectorAll('[data-nav]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const path = e.target.getAttribute('data-nav');
        navigate(path);
      });
    });
  }

  function onSubmitForm(e) {
    e.preventDefault();
    UI.connectBtn.click();
  }

  async function handleLoginAttempt() {
    toggleDisabled(UI.connectBtn, true);
    UI.connectBtn.textContent = 'Connecting…';
    toggleElementVisibility(UI.errorContainer, false);

    const result = await attemptLogin({
      emailInput: UI.emailInput.value,
      passwordInput: UI.passwordInput.value,
      creds,
      UI
    });

    if (result.error) {
      showError(result.error);
      toggleDisabled(UI.connectBtn, false);
      UI.connectBtn.textContent = 'Connect to Monarch';
      return;
    }

    if (result.otpRequired) return navigate('/otp');
    if (result.token) return navigate('/complete');
  }

  async function onClickConnect(e) {
    e.preventDefault();
    await handleLoginAttempt();
  }

  function onClickClearCredentials(e) {
    e.preventDefault();
    clearCredentialsAndReset(creds);

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
