import { v4 as uuidv4 } from 'uuid';
import state from '../../state.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { monarchApi } from '../../api/monarchApi.js';

export default function initMonarchCredentialsView() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const connectBtn = document.getElementById('connectBtn');
  const backBtn = document.getElementById('backBtn');
  const form = document.getElementById('credentialsForm');
  const errorBox = document.getElementById('errorBox');

  renderButtons();

  // Generate device UUID once on view load
  if (!state.deviceUuid) {
    state.deviceUuid = uuidv4();
  }

  // Pre-populate fields if credentials already exist in state
  if (state.credentials.email) {
    emailInput.value = state.credentials.email;
  }
  if (state.credentials.password) {
    passwordInput.value = state.credentials.password;
  }

  validateForm();

  function validateForm() {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const valid = email.length > 0 && password.length > 0;
    connectBtn.disabled = !valid;

    renderButtons();

    console.log("State:", state, "email:", email, "password:", password)
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
      console.log("Login response:", response);

      // OTP required
      if (response.otpRequired) {
        state.credentials.email = email;
        state.credentials.password = password;
        state.awaitingOtp = true;
        navigate("monarchOtpView")
        return
      }

      // ✅ Successful login — store token
      if (response.token) {
        state.apiToken = response.token;
        state.credentials.email = email;
        state.credentials.password = password;
        state.awaitingOtp = false;
        navigate('monarchCompleteView');
        return;
      }

      throw new Error('Unexpected login response.');
    } catch (err) {
      console.error("Login error", err);
      errorBox.textContent = err?.message || 'An unexpected error occurred.';
      errorBox.classList.remove('hidden');
    } finally {
      connectBtn.disabled = false;
      connectBtn.textContent = 'Connect to Monarch';
    }
  });

  backBtn.addEventListener('click', () => {
    navigate('methodView');
  });
}
