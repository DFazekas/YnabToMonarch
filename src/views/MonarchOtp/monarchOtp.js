import { navigate, goBack } from '../../router.js';
import state from '../../state.js';
import { monarchApi } from '../../api/monarchApi.js';
import { renderButtons } from '../../components/button.js';
import { createSimpleNavigationBar } from '../../utils/navigationBar.js';
import {
  saveToLocalStorage, getLocalStorage
} from '../../utils/storage.js';
import { toggleDisabled, toggleElementVisibility } from '../../utils/dom.js';
import { patchState } from '../../utils/state.js';

export default function initMonarchOtpView() {
  // Add navigation bar at the bottom of the content
  const mainContainer = document.querySelector('.container-responsive');
  mainContainer.insertAdjacentHTML('beforeend', createSimpleNavigationBar({
    backText: "Back"
  }));

  const $ = (id) => document.getElementById(id);
  const UI = {
    otpInput: $('otpInput'),
    submitOtpBtn: $('submitOtpBtn'),
    otpError: $('otpError'),
    backBtn: $('backBtn')
  };

  renderButtons();

  const { credentials } = state;
  const { email, encryptedPassword, uuid, remember } = getLocalStorage();
  patchState(credentials, {
    email: credentials.email || email,
    encryptedPassword: credentials.encryptedPassword || encryptedPassword,
    deviceUuid: credentials.deviceUuid || uuid,
    remember: remember,
  });

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
          saveToLocalStorage({ token: response.token });
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
    goBack();
  }

  function onOtpInput() {
    UI.otpInput.value = UI.otpInput.value.replace(/\D/g, '').slice(0, 6);
    toggleDisabled(UI.submitOtpBtn, UI.otpInput.value.length !== 6);
    renderButtons();
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
