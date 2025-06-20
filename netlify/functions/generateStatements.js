const Papa = require('papaparse');
const { createResponse } = require('./response');
const { requireMethod } = require('./lib/api.js');

module.exports.handler = async (event) => {
  const methodError = requireMethod(event, 'POST');
  if (methodError) return methodError;
  try {
    const { accounts } = JSON.parse(event.body);
    const files = Object.keys(accounts).map(acc => ({
      fileName: `${acc}_transactions.csv`,
      csv: Papa.unparse(accounts[acc])
    }));
    return createResponse(200, { files });
  } catch (err) {
    return createResponse(500, { error: err.message });
  }
};
