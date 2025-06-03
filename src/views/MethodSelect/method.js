import { navigate } from '../../router.js';
import state from '../../state.js';

export default function initMethodSelectView() {
  console.log("State:", state)
  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');

  const totalCount = state.registerData.length;
  const selectedCount = state.registerData.filter(acc => !acc.excluded).length;

  // Set text content
  document.getElementById('totalCountDisplay').textContent = totalCount;
  document.getElementById('filesCountDisplay').textContent = selectedCount;
  document.getElementById('manualFileCount').textContent = selectedCount;

  manualBtn.addEventListener('click', () => {
    console.log("User selected Manual Import");
    navigate('manualInstructions');
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
