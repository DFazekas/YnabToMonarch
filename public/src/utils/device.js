export function initDeviceUuid() {
  let uuid = localStorage.getItem('device-uuid');
  if (!uuid) {
    uuid = crypto.randomUUID?.() || generateFallbackUuid();
    localStorage.setItem('device-uuid', uuid);
  }
  console.debug('Device UUID:', uuid);
  return uuid;
}

function generateFallbackUuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}
