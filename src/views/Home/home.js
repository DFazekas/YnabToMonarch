import { navigate } from '../../router.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import '../../components/AutoStyledButton.js';
import '../../components/ReusableModal.js';

export default function initHomeView() {
  // Render layout - components auto-style themselves
  renderPageLayout({
    header: {
      title: 'YNAB to Monarch Migration',
      description: 'Moving your financial data from YNAB to Monarch made simple and secure. Choose the method that works best for you, and we\'ll guide you through each step.',
      containerId: 'pageHeader'
    }
  });

  // Query elements and attach event listeners
  document.getElementById('getStartedButton')?.addEventListener('click', (e) => {
    e.preventDefault();
    navigate('/upload');
  });
}
