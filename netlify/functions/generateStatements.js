const Papa = require('papaparse');

module.exports.handler = async (event) => {
  try {
    const { accounts } = JSON.parse(event.body);
    const files = Object.keys(accounts).map(acc => ({
      fileName: `${acc}_transactions.csv`,
      csv: Papa.unparse(accounts[acc])
    }));
    return { statusCode: 200, body: JSON.stringify({ files }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
