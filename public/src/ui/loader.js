const spinner = document.getElementById('spinner');
export function showLoader() { spinner.classList.remove('hidden'); document.body.classList.add('loading'); }
export function hideLoader() { spinner.classList.add('hidden'); document.body.classList.remove('loading'); }
