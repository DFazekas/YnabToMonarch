export function loadCredentialsFromStorage() {
  return {
    token: localStorage.getItem('monarchToken') || '',
    email: localStorage.getItem('monarchEmail') || '',
    password: localStorage.getItem('monarchPassword') || '',
    uuid: localStorage.getItem('deviceUuid') || '',
  };
}

export function saveCredentialsToStorage(email, password) {
  localStorage.setItem('monarchEmail', email);
  localStorage.setItem('monarchPassword', password);
}

export function saveTokenToStorage(token) {
  localStorage.setItem('monarchToken', token);
}

export function saveDeviceUuid(uuid) {
  localStorage.setItem('deviceUuid', uuid);
}

export function clearStorage() {
  localStorage.removeItem('deviceUuid');
  localStorage.removeItem('monarchEmail');
  localStorage.removeItem('monarchPassword');
  localStorage.removeItem('monarchToken');
}
