const { csvParse } = require('d3-dsv');

module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { csvText } = JSON.parse(event.body);
    const data = csvParse(csvText);

    const accounts = {};
    data.forEach(row => {
      const acc = row.Account && row.Account.trim();
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

    return {
      statusCode: 200,
      body: JSON.stringify(accounts),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
