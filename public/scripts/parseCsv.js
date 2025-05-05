import Papa from 'https://unpkg.com/papaparse@5.5.2/papaparse.mjs';

export async function parseCsv(csvFile) {
  try {
    const csvText = await csvFile.text()
    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    if (parsed.errors.length) {
      throw new Error("Failed to parse CSV file.");
    }

    const accounts = {};
    parsed.data.forEach(row => {
      const acc = row.Account?.trim();
      if (!acc) return;
      if (!accounts[acc]) accounts[acc] = [];

      accounts[acc].push({
        Date: row.Date,
        Merchant: row.Payee || '',
        Category: row.Category,
        Account: row.Account,
        'Original Statement': '',
        Notes: row.Memo || '',
        Amount: parseFloat((row.Inflow || '0').replace(/[$,]/g, '')) - parseFloat((row.Outflow || '0').replace(/[$,]/g, '')),
        Tags: row.Flag || ''
      });
    });

    return accounts
  } catch (err) {
    throw new Error(err.message);
  }
}
