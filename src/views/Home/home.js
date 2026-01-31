import { navigate } from '../../router.js';

export default function initHomeView() {
  // Query elements and attach event listeners
  document.getElementById('getStartedButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/upload');
  });
}
