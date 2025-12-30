import { navigate } from '../../router.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import { generateAccountsZip } from './manualInstructionsData.js';

export default function initManualInstructionsView() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 4: Manual Migration',
      description: 'A step-by-step guide to manually importing your YNAB data into Monarch Money.',
      containerId: 'pageHeader'
    }
  });

  const downloadBtn = document.getElementById('downloadBtn');
  const switchBtn = document.getElementById('switchToAuto');

  downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      const content = await generateAccountsZip();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = 'accounts_export.zip';
      downloadLink.click();
    } catch (err) {
      console.error('❌ ZIP generation failed', err);
      alert('Failed to generate ZIP file.');
    }
  });

  switchBtn.addEventListener('click', () => navigate('/login'));
}
