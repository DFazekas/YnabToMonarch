import JSZip from 'jszip';
import generateCSV from '../../../shared/generateCsv.js';
import state from '../../state.js';
import { navigate } from '../../router.js';
import { renderPageLayout } from '../../components/pageLayout.js';

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

  const includedAccounts = Object.values(state.accounts).filter(acc => acc.included);

  downloadBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    const zip = new JSZip();
    const MAX_ROWS_PER_FILE = 1000;

    includedAccounts.forEach(account => {
      const safeName = account.name.replace(/[\\/:*?"<>|]/g, '_');
      const transactions = account.transactions;
      const total = transactions.length;

      if (total <= MAX_ROWS_PER_FILE) {
        const csv = generateCSV(account.name, transactions);
        zip.file(`${safeName}.csv`, csv);
      } else {
        const chunks = Math.ceil(total / MAX_ROWS_PER_FILE);
        for (let i = 0; i < chunks; i++) {
          const start = i * MAX_ROWS_PER_FILE;
          const end = start + MAX_ROWS_PER_FILE;
          const chunk = transactions.slice(start, end);
          const chunkCsv = generateCSV(account.name, chunk);
          zip.file(`${safeName}_part${i + 1}.csv`, chunkCsv);
        }
      }
    });

    try {
      const content = await zip.generateAsync({ type: 'blob' });
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(content);
      downloadLink.download = 'accounts_export.zip';
      downloadLink.click();
    } catch (e) {
      console.error('❌ ZIP generation failed', e);
      alert('Failed to generate ZIP file.');
    }
  });

  switchBtn.addEventListener('click', () => {
    navigate('/login');
  });
}
