import { navigate, goBack } from '../../router.js';
import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import {
  saveToLocalStorage, getLocalStorage, clearStorage
} from '../../utils/storage.js';
import { toggleDisabled, toggleElementVisibility } from '../../utils/dom.js';
import { patchState } from '../../utils/state.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initMonarchOtpView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Enter Your Verification Code',
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
  const storage = getLocalStorage();
  const { email, encryptedPassword, uuid, remember, tempForOtp } = storage;

  patchState(credentials, {
    email: credentials.email || email,
    encryptedPassword: credentials.encryptedPassword || encryptedPassword,
    deviceUuid: credentials.deviceUuid || uuid,
    remember: remember,
  });

  // Clear temporary credentials immediately if they were stored just for OTP
  if (tempForOtp && !remember) {
    // Keep credentials in localStorage temporarily until OTP completes
    // They will be cleared after successful login or if user navigates away
  }

  // Ensure we have the required credentials for OTP
  if (!credentials.email || !credentials.encryptedPassword) {
    console.warn('Missing credentials for OTP flow, redirecting to login');
    return navigate('/credentials');
  }

  async function onClickSubmitOtp(e) {
    console.group("MonarchOtpView");
    e.preventDefault();

    toggleElementVisibility(UI.otpError, false);
    credentials.otp = UI.otpInput.value;

    try {
      const response = await monarchApi.login(
        credentials.email,
        credentials.encryptedPassword,
        credentials.deviceUuid,
        credentials.otp
      );

      if (response?.token) {
        patchState(credentials, {
          apiToken: response.token,
          awaitingOtp: false
        });

        if (credentials.remember) {
          // User wants to remember credentials - save permanently
          saveToLocalStorage({
            email: credentials.email,
            encryptedPassword: credentials.encryptedPassword,
            uuid: credentials.deviceUuid,
            token: response.token,
            remember: true
          });
        } else {
          // User doesn't want to remember - clear temporary credentials
          clearStorage();
        }

        console.groupEnd("MonarchOtpView");
        return navigate('/complete');
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
    const storage = getLocalStorage();
    if (storage.tempForOtp && !storage.remember) {
      clearStorage();
    }
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
