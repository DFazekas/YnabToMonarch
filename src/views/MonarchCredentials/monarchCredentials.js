import state from '../../state.js';
import { navigate } from '../../router.js';

export default function initMonarchCredentialsView() {
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const connectBtn = document.getElementById('connectBtn');
  const backBtn = document.getElementById('backBtn');

  connectBtn.addEventListener('click', () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      alert("Please enter your email and password");
      return;
    }

    // Store credentials temporarily in state for backend flow
    state.credentials.email = email;
    state.credentials.password = password;

    // Simulate backend API call here before moving forward
    alert('🔐 Authenticating (not yet implemented)');
    
    // Navigate to the next auto-import step (e.g. Account Matching View)
    // navigate('autoImportMatch');
  });

  backBtn.addEventListener('click', () => {
    navigate('method');
  });
}
