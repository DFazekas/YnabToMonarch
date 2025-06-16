export default function generateCSV(accountName, transactions) {
  const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`;
  const rows = transactions.map(tx =>
    `"${tx.Date}","${tx.Merchant}","${tx.Category}","${accountName}","","${tx.Notes}","${tx.Amount}","${tx.Tags}"`
  );
  return [headers, ...rows].join('\n');
}
