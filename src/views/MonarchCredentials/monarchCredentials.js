import { v4 as uuidv4 } from 'uuid';
import state from '../../state.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { monarchApi } from '../../api/monarchApi.js';
import { toggleElementVisibility, toggleDisabled } from '../../utils/dom.js';

const COLOR = {
  GREEN: '#006400',
  BLUE: '#1993e5',
  ORANGE: '#ff8c00',
}

export default function initMonarchCredentialsView() {
  // ✅ Immediately redirect if already authenticated
  if (state.apiToken) {
    navigate('monarchCompleteView');
    return;
  }

  const emailInput = document.getElementById('email');
  const connectBtn = document.getElementById('connectBtn');
  const backBtn = document.getElementById('backBtn');
  const form = document.getElementById('credentialsForm');
  const errorBox = document.getElementById('errorBox');
  const rememberCheckbox = document.getElementById('rememberCredentials');
  const rememberedUserBox = document.getElementById('rememberedUserBox');
  const rememberedEmail = document.getElementById('rememberedEmail');
  const clearCredentialsBtn = document.getElementById('clearCredentialsBtn');
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const eyeShow = document.getElementById('eyeShow');
  const eyeHide = document.getElementById('eyeHide');


  renderButtons();

  // Generate device UUID once on view load
  if (!state.deviceUuid) {
    state.deviceUuid = uuidv4();
  }

  // Pre-populate fields if credentials already exist in state
  if (state.credentials.email !== "" && state.credentials.password !== "") {
    emailInput.value = state.credentials.email;
    passwordInput.value = state.credentials.password;
    rememberedEmail.textContent = `Signed in as ${state.credentials.email}`;
    rememberCheckbox.checked = state.credentials.remember || false;

    toggleDisabled(emailInput, true);
    toggleDisabled(passwordInput, true);

    toggleElementVisibility(document.getElementById('rememberMe'), false);
    toggleElementVisibility(rememberedUserBox, true);

    document.getElementById('securityNote').textContent = 'You are signed in. To use different credentials, click "Not you?".';
    document.getElementById('securityNoteIcon').setAttribute('fill', COLOR.BLUE);
  } else {
    toggleElementVisibility(rememberedUserBox, false);
    document.getElementById('securityNote').textContent = 'Your credentials will not be stored.';
    document.getElementById('securityNoteIcon').setAttribute('fill', COLOR.GREEN);
  }

  validateForm();

  function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const valid = email.length > 0 && password.length > 0;
    toggleDisabled(connectBtn, !valid)
    toggleElementVisibility(errorBox, false);
    renderButtons();
  }

  emailInput.addEventListener('input', validateForm);
  passwordInput.addEventListener('input', validateForm);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    connectBtn.click();
  })

  connectBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    errorBox.classList.add('hidden');
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting…';

    try {
      const response = await monarchApi.login(email, password, state.deviceUuid);

      state.credentials.email = email;
      state.credentials.password = password;
      state.credentials.remember = rememberCheckbox.checked;

      // OTP required
      if (response.otpRequired) {
        state.awaitingOtp = true;
        navigate("monarchOtpView")
        return
      }

      // ✅ Successful login — store token
      if (response.token) {
        state.apiToken = response.token;
        state.awaitingOtp = false;

        // Store Monarch API token if "Remember me" is checked
        if (state.credentials.remember) {
          localStorage.setItem('monarchToken', response.token);
        }

        navigate('monarchCompleteView');
        return;
      }

      throw new Error('Unexpected login response.');
    } catch (err) {
      console.error("Login error", err);
      errorBox.textContent = err?.message || 'An unexpected error occurred.';
      toggleElementVisibility(errorBox, true)
    } finally {
      connectBtn.disabled = false;
      connectBtn.textContent = 'Connect to Monarch';
    }
  });

  [emailInput, passwordInput].forEach(input => {
    input.addEventListener('focus', () => {
      input.classList.add('ring-2', 'ring-blue-500', 'outline-none');
    });

    input.addEventListener('blur', () => {
      input.classList.remove('ring-2', 'ring-blue-500', 'outline-none');
    });
  });


  backBtn.addEventListener('click', () => {
    navigate('methodView');
  });

  clearCredentialsBtn.addEventListener('click', (e) => {
    e.preventDefault();

    state.credentials = {};
    state.apiToken = null;
    localStorage.removeItem('monarchToken');

    emailInput.value = '';
    passwordInput.value = '';
    rememberCheckbox.checked = false;
    toggleElementVisibility(rememberedUserBox, false);
    toggleElementVisibility(document.getElementById('rememberMe'), true);

    toggleDisabled(emailInput, false);
    toggleDisabled(passwordInput, false);
    emailInput.focus();

    toggleDisabled(connectBtn, true)

    document.getElementById('securityNote').textContent = 'Your credentials will not be stored.';
    document.getElementById('securityNoteIcon').setAttribute('fill', COLOR.GREEN);

    renderButtons();
  });

  rememberCheckbox.addEventListener('change', () => {
    if (rememberCheckbox.checked) {
      state.credentials.remember = true;
      document.getElementById('securityNote').textContent = 'Your credentials will be stored securely on this device.';
      document.getElementById('securityNoteIcon').setAttribute('fill', COLOR.ORANGE);
    } else {
      state.credentials.remember = false;
      document.getElementById('securityNote').textContent = 'Your credentials will not be stored.';
      document.getElementById('securityNoteIcon').setAttribute('fill', COLOR.GREEN);
    }

    if (emailInput.value.trim() === '') {
      emailInput.focus();
    } else if (passwordInput.value.trim() === '') {
      passwordInput.focus();
    } else {
      connectBtn.focus();
    }
  });

  toggleBtn.addEventListener('click', () => {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    toggleBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    toggleElementVisibility(eyeShow, !isHidden);
    toggleElementVisibility(eyeHide, isHidden);
  });

}
