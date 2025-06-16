import { navigate } from '../../router.js';
import state from '../../state.js';
import { renderButtons } from '../../components/button.js';

export default function initMethodSelectView() {
  console.log("State:", state)
  renderButtons();
  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');

  const totalCount = Object.keys(state.accounts).length;
  const selectedCount = Object.values(state.accounts).filter(acc => acc.included).length;

  // Set text content
  document.getElementById('totalCountDisplay').textContent = totalCount;
  document.getElementById('filesCountDisplay').textContent = selectedCount;
  document.getElementById('manualFileCount').textContent = selectedCount;

  manualBtn.addEventListener('click', () => {
    console.log("User selected Manual Import");
    navigate('manualInstructionsView');
  });

  autoBtn.addEventListener('click', () => {
    console.log("User selected Auto Import");
    navigate('monarchCredentialsView');
  });

  // Handle back navigation
  backBtn.addEventListener('click', () => {
    navigate('reviewView');
  });

}
