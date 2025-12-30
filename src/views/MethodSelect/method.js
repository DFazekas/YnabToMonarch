import { navigate } from '../../router.js';
import state from '../../state.js';
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initMethodSelectView() {

  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 3: Choose Your Migration Method',
      description: 'Either manually import your accounts into Monarch Money yourself or let us automate the process.',
      containerId: 'pageHeader'
    }
  });

  const totalCount = state.accounts.length();
  const selectedCount = state.accounts._accounts.filter(acc => acc.included).length;

  // Set text content (elements are already in DOM)
  document.getElementById('totalCountDisplay').textContent = totalCount;
  document.getElementById('filesCountDisplay').textContent = selectedCount;
  document.getElementById('manualFileCount').textContent = selectedCount;
  document.getElementById('manualFileLabel').textContent = selectedCount === 1 ? 'file' : 'files';

  document.getElementById('manualImportCard').addEventListener('card-click', () => {
    navigate('/manual');
  });

  document.getElementById('autoImportCard').addEventListener('card-click', () => {
    navigate('/login');
  });
}
