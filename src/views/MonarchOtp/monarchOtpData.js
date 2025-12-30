import { monarchApi } from '../../api/monarchApi.js';
import state from '../../state.js';

export function initCredentialsFromStorage(state) {
  const { credentials } = state;
  
  // Load from sessionStorage (new storage strategy)
  const email = sessionStorage.getItem('monarch_email');
  const encryptedPassword = sessionStorage.getItem('monarch_pwd_enc');
  const uuid = sessionStorage.getItem('monarch_uuid');

  state.setCredentials({
    email: credentials.email || email,
    encryptedPassword: credentials.encryptedPassword || encryptedPassword,
    deviceUuid: credentials.deviceUuid || uuid,
    remember: false, // No longer persisting across sessions
  });

  return { email, encryptedPassword, uuid };
}

export async function submitOtp(credentials) {
  const response = await monarchApi.login(
    credentials.email,
    credentials.encryptedPassword,
    credentials.deviceUuid,
    credentials.otp
  );

  if (response?.token) {
    state.setCredentials({
      apiToken: response.token,
      awaitingOtp: false
    });

    // Store in sessionStorage (new strategy - cleared on tab close)
    sessionStorage.setItem('monarch_email', credentials.email);
    sessionStorage.setItem('monarch_pwd_enc', credentials.encryptedPassword);
    sessionStorage.setItem('monarch_uuid', credentials.deviceUuid);
    sessionStorage.setItem('monarch_token', response.token);

    return { success: true };
  }

  return { success: false };
}

export function clearTempCredentialsIfNeeded() {
  // Clear Monarch credentials from sessionStorage
  sessionStorage.removeItem('monarch_email');
  sessionStorage.removeItem('monarch_pwd_enc');
  sessionStorage.removeItem('monarch_uuid');
  sessionStorage.removeItem('monarch_token');
  sessionStorage.removeItem('monarch_otp');
}
