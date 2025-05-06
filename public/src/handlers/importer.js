import { monarchApi } from '../api/monarchApi.js';
import { showLoader, hideLoader } from '../ui/loader.js';
import { showToast } from '../ui/toast.js';
import { state } from '../state.js';
import { toggleSection } from '../main.js';

export async function autoImport(email, password, otp) {
  showLoader();
  try {
    // Hide action buttons when Auto-Import is pressed.
    toggleSection('conversion', false);

    const res = await monarchApi.login(email, password, state.deviceUuid, otp);
    if (res.otpRequired) {
      state.awaitingOtp = true;
      toggleOtp(true);
      return showToast('OTP sent.');
    }
    state.apiToken = res.token;
    const { accounts } = await monarchApi.fetchAccounts(res.token);
    state.accounts = accounts;
    toggleSection('mappings');
    showToast('Authenticated & fetched accounts.');
  } catch (e) {
    console.error("Error during auto import:", e);
    showToast(e.message, true);
  } finally {
    hideLoader();
  }
}
