import { navigate } from '../../router.js';
import state from '../../state.js';

export default function initMonarchOtpView() {
  const otpInput = document.getElementById('otpInput');
  const submitOtpBtn = document.getElementById('submitOtpBtn');
  const resendOtpBtn = document.getElementById('resendOtpBtn');
  const otpError = document.getElementById('otpError');
  const backBtn = document.getElementById('backBtn');

  // Allow only 6 digits
  otpInput.addEventListener('input', () => {
    otpInput.value = otpInput.value.replace(/\D/g, '').slice(0, 6);
    submitOtpBtn.disabled = otpInput.value.length !== 6;
  });

  submitOtpBtn.addEventListener('click', async () => {
    otpError.classList.add('hidden');

    // Store OTP in global state (you'll later use it for the real API call)
    state.credentials.otp = otpInput.value;

    try {
      // Simulate verification request
      await fakeOtpVerification(state.credentials.otp);

      // Navigate to the next step after successful verification
      navigate('autoMapAccounts');

    } catch (err) {
      otpError.classList.remove('hidden');
    }
  });

  resendOtpBtn.addEventListener('click', () => {
    // You’ll replace this with your resend logic
    alert("OTP resent!");
  });

  backBtn.addEventListener('click', () => {
    navigate('monarchCredentials');
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
