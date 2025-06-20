const { csvParse } = require('d3-dsv');
const { createResponse } = require('./response');

module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return createResponse(405, { error: 'Method Not Allowed' });
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

    // TODO: Code smell - should this be wrapped in curly braces?
    return createResponse(200, accounts);
  } catch (err) {
    return createResponse(500, { error: err.message });
  }
}
