const toastEl = document.getElementById('toast') || createToast();
export function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.className = `toast ${isError ? 'error' : 'success'} show`;
  setTimeout(() => toastEl.classList.remove('show'), 4000);
}

function createToast() {
  const div = document.createElement('div');
  div.id = 'toast';
  document.body.append(div);
  return div;
}
