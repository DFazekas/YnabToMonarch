const Papa = require('papaparse');

module.exports.handler = async (event) => {
  console.group("generateStatements");
  
  if (event.httpMethod !== 'POST') {
    console.warn("generateStatements ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("generateStatements");
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    // Handle missing or empty body
    if (!event.body) {
      console.error("generateStatements ❌ missing request body");
      console.groupEnd("generateStatements");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required.' })
      };
    }

    // Parse body - handle both string and object cases
    const bodyData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;

    const { accounts } = bodyData;
    
    if (!accounts) {
      console.error("generateStatements ❌ missing accounts in body");
      console.groupEnd("generateStatements");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Accounts are required.' })
      };
    }

    const files = Object.keys(accounts).map(acc => ({
      fileName: `${acc}_transactions.csv`,
      csv: Papa.unparse(accounts[acc])
    }));
    
    console.log("generateStatements ✅ generated", { fileCount: files.length });
    console.groupEnd("generateStatements");
    
    return { 
      statusCode: 200, 
      body: JSON.stringify({ files }) 
    };
  } catch (err) {
    console.error("generateStatements ❌ unexpected error", err);
    console.error("Error details:", {
      message: err.message,
      stack: err.stack,
      body: event.body,
      bodyType: typeof event.body
    });
    console.groupEnd("generateStatements");
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message || 'Internal Server Error' }) 
    };
  }
};
