import { navigate, goBack } from '../../router.js';
import state from '../../state.js';
import { renderButtons } from '../../components/button.js';
import { updateNavigationTexts } from '../../utils/navigation.js';
import { createSimpleNavigationBar } from '../../utils/navigationBar.js';

export default function initMethodSelectView() {
  // Redirect to upload if no accounts are available
  if (!state.accounts || Object.keys(state.accounts).length === 0) {
    navigate('/upload', true);
    return;
  }

  // Add navigation bar at the bottom of the content
  const mainContainer = document.querySelector('.container-responsive');
  mainContainer.insertAdjacentHTML('beforeend', createSimpleNavigationBar({
    backText: "Back"
  }));

  renderButtons();
  updateNavigationTexts();
  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');
  const backBtn = document.getElementById('backBtn');

  const totalCount = Object.keys(state.accounts).length;
  const selectedCount = Object.values(state.accounts).filter(acc => acc.included).length;

  // Set text content
  document.getElementById('totalCountDisplay').textContent = totalCount;
  document.getElementById('filesCountDisplay').textContent = selectedCount;
  document.getElementById('manualFileCount').textContent = selectedCount;

  manualBtn.addEventListener('click', () => {
    navigate('/manual');
  });

  autoBtn.addEventListener('click', () => {
    navigate('/login');
  });

  // Handle back navigation
  backBtn.addEventListener('click', () => {
    goBack();
  });
}
