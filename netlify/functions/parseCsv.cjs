const { csvParse } = require('d3-dsv');

module.exports.handler = async (event) => {
  console.group("parseCsv");

  if (event.httpMethod !== 'POST') {
    console.warn("parseCsv ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("parseCsv");
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    // Handle missing or empty body
    if (!event.body) {
      console.error("parseCsv ❌ missing request body");
      console.groupEnd("parseCsv");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required.' })
      };
    }

    // Parse body - handle both string and object cases
    const bodyData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;

    const { csvText } = bodyData;
    
    if (!csvText) {
      console.error("parseCsv ❌ missing csvText in body");
      console.groupEnd("parseCsv");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'CSV text is required.' })
      };
    }

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

    console.groupEnd("parseCsv");

    return {
      statusCode: 200,
      body: JSON.stringify(accounts),
    };
  } catch (err) {
    console.error("parseCsv ❌ unexpected error", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      body: event.body,
      bodyType: typeof event.body
    });
    console.groupEnd("parseCsv");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || 'Internal Server Error' }),
    };
  }
}
