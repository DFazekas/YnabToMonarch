// netlify/functions/config.js
exports.handler = async function(event, context) {
  // Only allow GET requests
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Expose only the public-safe environment variables
  const publicConfig = {
    ynabClientId: process.env.YNAB_CLIENT_ID,
    ynabRedirectUri: process.env.YNAB_REDIRECT_URI
  };

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(publicConfig),
  };
};
