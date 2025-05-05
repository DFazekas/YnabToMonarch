export function showLoader() {
  document.getElementById('spinnerSection').hidden = false;
  document.body.classList.add('processing');
}

export function hideLoader() {
  document.getElementById('spinnerSection').hidden = true;
  document.body.classList.remove('processing');
}

export function showToast(message, isError = false) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.backgroundColor = isError ? '#d9534f' : '#333';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 4000);
}
