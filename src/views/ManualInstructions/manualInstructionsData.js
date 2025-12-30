import JSZip from 'jszip';
import generateCSV from '../../../shared/generateCsv.js';
import state from '../../state.js';

export async function generateAccountsZip({ maxRowsPerFile = 1000 } = {}) {
  const includedAccounts = state.accounts._accounts.filter(acc => acc.included);
  const zip = new JSZip();

  includedAccounts.forEach(account => {
    const safeName = (account.current.name || '').replace(/[\\/:*?"<>|]/g, '_');
    const transactions = account.transactions || [];
    const total = transactions.length;

    if (total <= maxRowsPerFile) {
      const csv = generateCSV(account.current.name, transactions);
      zip.file(`${safeName}.csv`, csv);
    } else {
      const chunks = Math.ceil(total / maxRowsPerFile);
      for (let i = 0; i < chunks; i++) {
        const start = i * maxRowsPerFile;
        const end = start + maxRowsPerFile;
        const chunk = transactions.slice(start, end);
        const chunkCsv = generateCSV(account.current.name, chunk);
        zip.file(`${safeName}_part${i + 1}.csv`, chunkCsv);
      }
    }
  });

  const content = await zip.generateAsync({ type: 'blob' });
  return content;
}
