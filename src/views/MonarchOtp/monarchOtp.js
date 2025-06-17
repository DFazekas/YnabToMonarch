import { navigate } from '../../router.js';
import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { renderButtons } from '../../components/button.js';
import {
  saveCredentialsToStorage,
  saveTokenToStorage, loadCredentialsFromStorage
} from '../../utils/storage.js';
import { toggleDisabled, toggleElementVisibility } from '../../utils/dom.js';

export default function initMonarchOtpView() {
  const otpInput = document.getElementById('otpInput');
  const submitOtpBtn = document.getElementById('submitOtpBtn');
  const otpError = document.getElementById('otpError');
  const backBtn = document.getElementById('backBtn');

  renderButtons();

  // Allow only 6 digits
  otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
    toggleDisabled(submitOtpBtn, otpInput.value.length !== 6)
    renderButtons();
  });

  submitOtpBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    toggleElementVisibility(otpError, false)
    state.credentials.otp = otpInput.value;

    try {
      const { email, password, otp, deviceUuid, remember } = state.credentials;
      const response = await monarchApi.login(email, password, deviceUuid, otp);

      // ✅ Successful login — store token
      if (response?.token) {
        state.credentials.apiToken = response.token;
        state.credentials.awaitingOtp = false;

        // Store credentials if "Remember me" is checked
        if (remember) {
          saveCredentialsToStorage(email, password);
          saveTokenToStorage(response.token);
        }

        navigate('monarchCompleteView');
        return;
      }

      // ❌ Something went wrong
      console.error("Login failed:", response);
      throw new Error('Unknown login response.');

    } catch (err) {
      toggleElementVisibility(otpError, true)
      otpError.textContent = 'Invalid OTP. Please try again.';
      console.error("OTP verification error", err);
    }
  });

  backBtn.addEventListener('click', () => navigate('monarchCredentialsView'));
}
