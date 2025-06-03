import { navigate } from '../../router.js';
import state from '../../state.js';

export default function initMethodSelectView() {
  console.log("State:", state)
  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');

  manualBtn.addEventListener('click', () => {
    console.log("User selected Manual Import");
    navigate('manualImport');
  });

  autoBtn.addEventListener('click', () => {
    console.log("User selected Auto Import");
    navigate('autoImport');
  });

  // Handle back navigation
  backBtn.addEventListener('click', () => {
    navigate('review');
  });

}
