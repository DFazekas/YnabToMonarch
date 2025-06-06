import state from '../../state.js';
import { navigate } from '../../router.js';
import { enhanceButtons } from '../../components/button.js';

export default function initManualInstructionsView() {
  const countSpan = document.getElementById('accountCount');
  const downloadBtn = document.getElementById('downloadBtn');
  const switchBtn = document.getElementById('switchToAuto');
  const backBtn = document.getElementById('backBtn');
  enhanceButtons();

  const includedAccounts = state.registerData.filter(acc => !acc.excluded);
  countSpan.textContent = `${includedAccounts.length} account${includedAccounts.length !== 1 ? 's' : ''}`;

  downloadBtn.addEventListener('click', () => {
    alert('Generating ZIP file (not yet implemented)');
  });

  switchBtn.addEventListener('click', () => {
    navigate('monarchCredentialsView');
  });

  backBtn.addEventListener('click', () => {
    navigate('methodView');
  });
}
