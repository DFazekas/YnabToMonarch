import { monarchApi } from '../api/monarchApi.js';
import { showLoader, hideLoader } from '../ui/loader.js';
import { showToast } from '../ui/toast.js';
import { state } from '../state.js';
import { toggleSection } from '../main.js';
import { initializeMappingSection } from './displayMappingSection.js';

export function startAutoImport() {
  toggleSection('conversion', false)
  toggleSection('credentials')
}

export async function login() {
  const email = document.getElementById('monarchUsername').value;
  const password = document.getElementById('monarchPassword').value;
  if (!email || !password) {
    showToast('Email and password are required.', true);
    return
  }

  state.credentials = { email, password };
  showToast('Logging into Monarch...');
  try {
    const res = await authenticate(email, password);
    if (!res) {
      return
    }
    
    console.log("Login response:", res);
    await fetchMonarchAccounts(res.token);
  } catch (e) {
    console.error("Error during login into Monarch:", e);
    showToast("Error logging into Monarch", true);
  } finally {
    hideLoader();
  }
}

export async function submitOtp() {
  const otp = document.getElementById('monarchOtp').value;
  if (!otp) {
    showToast('OTP is required.', true);
    return
  }

  state.credentials.otp = otp;
  showToast('Logging into Monarch...');
  try {
    const res = await authenticate(state.credentials.email, state.credentials.password, otp);
    console.log("Login with OTP response:", res);
    await fetchMonarchAccounts(res.token);
  } catch (e) {
    console.error("Error during OTP submission:", e);
    showToast("Error submitting OTP", true);
  } finally {
    hideLoader();
  }
}

async function authenticate(email, password, otp = null) {
  showLoader();
  const res = await monarchApi.login(email, password, state.deviceUuid, otp);
  console.log("Login response:", res);
  if (res.otpRequired) {
    state.awaitingOtp = true;
    toggleSection('loginForm', false)
    toggleSection('otpForm', true)
    return
  }
  state.apiToken = res.token;
  return res
}

async function fetchMonarchAccounts(apiToken) {
  try {
    showToast("Fetching accounts...");
    const { accounts } = await monarchApi.fetchMonarchAccounts(apiToken);
    console.log("Fetched Monarch accounts:", accounts);
    state.monarchAccounts = accounts;
    toggleSection('credentials', false);
    toggleSection('otpForm', false);
    initializeMappingSection()
  } catch (e) {
    console.error("Error fetching accounts from Monarch:", e);
    showToast("Error fetching accounts", true);
  } finally {
    hideLoader();
  }
}
