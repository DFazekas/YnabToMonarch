import { navigate, goBack } from '../../router.js';
import state from '../../state.js';
import {
  initCredentialsFromStorage,
  submitOtp,
  clearTempCredentialsIfNeeded
} from './monarchOtpData.js';
import { toggleDisabled, toggleElementVisibility } from '../../utils/dom.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initMonarchOtpView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 5: Enter Your Verification Code',
      description: 'Monarch has sent a 6-digit verification code to your email address. Enter it below to continue with the secure import process.',
      containerId: 'pageHeader'
    }
  });

  const $ = (id) => document.getElementById(id);
  const UI = {
    otpInput: $('otpInput'),
    submitOtpBtn: $('submitOtpBtn'),
    otpError: $('otpError'),
    backBtn: $('backBtn')
  };

  const { credentials } = state;
  const { storage, tempForOtp } = initCredentialsFromStorage(state);

  // Ensure we have the required credentials for OTP
  if (!credentials.email || !credentials.encryptedPassword) {
    console.warn('Missing credentials for OTP flow, redirecting to login');
    return navigate('/credentials', true);
  }

  async function onClickSubmitOtp(e) {
    console.group("MonarchOtpView");
    e.preventDefault();

    toggleElementVisibility(UI.otpError, false);
    credentials.otp = UI.otpInput.value;

    try {
      const result = await submitOtp(credentials);
      if (result.success) {
        console.groupEnd("MonarchOtpView");
        return navigate('/complete', true);
      }

      throw new Error('Unknown login response.');
    } catch (err) {
      toggleElementVisibility(UI.otpError, true);
      UI.otpError.textContent = 'Invalid OTP. Please try again.';
      console.error("❌ OTP verification error", err);
      console.groupEnd("MonarchOtpView");
    }
  }

  function onClickBack() {
    // Clean up temporary credentials if user navigates back
    clearTempCredentialsIfNeeded();
    goBack();
  }

  function onOtpInput() {
    UI.otpInput.value = UI.otpInput.value.replace(/\D/g, '').slice(0, 6);
    toggleDisabled(UI.submitOtpBtn, UI.otpInput.value.length !== 6);
  }

  function onOtpKeyDown(e) {
    if (e.key === 'Enter' && UI.otpInput.value.length === 6) {
      UI.submitOtpBtn.click();
    }
  }

  UI.otpInput.addEventListener('input', onOtpInput);
  UI.otpInput.addEventListener('keydown', onOtpKeyDown);
  UI.submitOtpBtn.addEventListener('click', onClickSubmitOtp);
  UI.backBtn.addEventListener('click', onClickBack);

  // Initialize state
  toggleDisabled(UI.submitOtpBtn, true);
}
