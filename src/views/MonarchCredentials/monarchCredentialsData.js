import { v4 as uuidv4 } from 'uuid';
import { monarchApi } from '../../api/monarchApi.js';
import { encryptPassword } from '../../../shared/crypto.js';
import state from '../../state.js';

export function initCredentials() {
  const creds = state.credentials;
  
  // Load from sessionStorage (new storage strategy)
  const email = sessionStorage.getItem('monarch_email');
  const encryptedPassword = sessionStorage.getItem('monarch_pwd_enc');
  const token = sessionStorage.getItem('monarch_token');
  const uuid = sessionStorage.getItem('monarch_uuid');
  
  state.setCredentials({
    email: creds.email || email,
    encryptedPassword: creds.encryptedPassword || encryptedPassword,
    apiToken: creds.apiToken || token,
    deviceUuid: creds.deviceUuid || uuid,
    remember: false // No longer persisting across sessions
  });

  if (!creds.deviceUuid || creds.deviceUuid === '') {
    creds.deviceUuid = uuidv4();
    sessionStorage.setItem('monarch_uuid', creds.deviceUuid);
  }

  return { creds };
}

export async function attemptLogin({ emailInput, passwordInput, creds, UI }) {
  const email = emailInput.trim() || sessionStorage.getItem('monarch_email');
  const plaintextPassword = passwordInput.trim();
  let encryptedPassword = creds.encryptedPassword || sessionStorage.getItem('monarch_pwd_enc');
  const uuid = creds.deviceUuid || sessionStorage.getItem('monarch_uuid');

  if (!encryptedPassword && plaintextPassword) {
    try {
      encryptedPassword = await encryptPassword(email, plaintextPassword);
    } catch (err) {
      return { error: 'Failed to encrypt password.' };
    }
  }

  try {
    const response = await monarchApi.login(email, encryptedPassword, uuid);

    if (response?.otpRequired) {
      state.saveToLocalStorage({
        email,
        encryptedPassword,
        uuid,
        remember: creds.remember,
        tempForOtp: !creds.remember
      });

      state.setCredentials({ awaitingOtp: true });
      return { otpRequired: true };
    }

    if (response?.token) {
      state.setCredentials({
        email,
        encryptedPassword,
        otp: '',
        remember: UI.rememberCheckbox.checked,
        apiToken: response.token,
        awaitingOtp: false
      });

      if (creds.remember) {
        state.saveToLocalStorage({ email, encryptedPassword, token: response.token, remember: true });
      }

      return { token: response.token };
    }

    const apiError = response?.detail || response?.error || 'Unexpected login response.';
    return { error: apiError };
  } catch (err) {
    return { error: err.message || String(err) };
  }
}

export function clearCredentialsAndReset() {
  state.clearLocalStorage();
  state.credentials.clear();

  state.credentials.deviceUuid = uuidv4();
  state.saveToLocalStorage({ uuid: state.credentials.deviceUuid });
}
