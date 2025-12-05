import { navigate } from '../../router.js';
import state from '../../state.js';
import { renderButtons } from '../../components/button.js';
import { renderNavigationBar } from '../../components/navigationBar.js';
import { renderPageHeader } from '../../components/pageHeader.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initMethodSelectView() {
  // Redirect to upload if no accounts are available
  if (!state.accounts || Object.keys(state.accounts).length === 0) {
    navigate('/upload', true);
    return;
  }

  // Set up the page layout (wraps existing content)
  renderPageLayout();

  // Render the navigation component with back and data buttons
  renderNavigationBar({
    showBackButton: true,
    showDataButton: true
  });

  // Render page header
  renderPageHeader({
    title: 'Choose Your Migration Method',
    description: 'You can either manually import your accounts into Monarch or let us automatically import your data.',
    containerId: 'pageHeader'
  });

  renderButtons();
  
  const totalCount = Object.keys(state.accounts).length;
  const selectedCount = Object.values(state.accounts).filter(acc => acc.included).length;

  // Set text content (elements are already in DOM)
  document.getElementById('totalCountDisplay').textContent = totalCount;
  document.getElementById('filesCountDisplay').textContent = selectedCount;
  document.getElementById('manualFileCount').textContent = selectedCount;

  const manualBtn = document.getElementById('manualImportBtn');
  const autoBtn = document.getElementById('autoImportBtn');

  manualBtn.addEventListener('click', () => {
    navigate('/manual');
  });

  autoBtn.addEventListener('click', () => {
    navigate('/login');
  });
}
