import { navigate } from '../../router.js';
import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { enhanceButtons } from '../../components/button.js';

export default function initMonarchOtpView() {
  const otpInput = document.getElementById('otpInput');
  const submitOtpBtn = document.getElementById('submitOtpBtn');
  const otpError = document.getElementById('otpError');
  const backBtn = document.getElementById('backBtn');

  enhanceButtons();

  // Allow only 6 digits
  otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
    submitOtpBtn.disabled = otpInput.value.length !== 6;
    enhanceButtons();
  });

  submitOtpBtn.addEventListener('click', async () => {
    otpError.classList.add('hidden');

    state.credentials.otp = otpInput.value;

    try {
      const response = await monarchApi.login(state.credentials.email, state.credentials.password, state.deviceUuid, state.credentials.otp);
      console.log("Login response:", response);

      // ✅ Successful login — store token
      if (response.token) {
        state.apiToken = response.token;
        state.awaitingOtp = false;
        navigate('monarchCompleteView');
        return;
      }

      // ❌ Something went wrong
      console.error("Login failed:", response);
      throw new Error('Unknown login response.');

    } catch (err) {
      otpError.classList.remove('hidden');
      otpError.textContent = 'Invalid OTP. Please try again.';
      console.error("OTP verification error", err);
    }
  });

  backBtn.addEventListener('click', () => {
    navigate('monarchCredentialsView');
  });
}

// Mock verification (replace with your real call)
async function fakeOtpVerification(otp) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (otp === '123456') resolve();
      else reject();
    }, 500);
  });
}
