const fetch = require('node-fetch');

exports.handler = async function(event) {
  console.group("ynabTokenExchange");

  if (event.httpMethod !== 'POST') {
    console.warn("ynabTokenExchange ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("ynabTokenExchange");
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  // Handle missing or empty body
  if (!event.body) {
    console.error("ynabTokenExchange ❌ missing request body");
    console.groupEnd("ynabTokenExchange");
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Request body is required.' })
    };
  }

  // Parse body - handle both string and object cases
  const bodyData = typeof event.body === 'string' 
    ? JSON.parse(event.body) 
    : event.body;

  // These secrets will be stored in your Netlify environment variables for production
  const { YNAB_CLIENT_ID, YNAB_CLIENT_SECRET, YNAB_REDIRECT_URI } = process.env;
  const { code, grant_type, refresh_token } = bodyData;

  console.log("process.env:")
  console.dir(process.env, { depth: null });

  console.log("bodyData:")
  console.dir(bodyData, { depth: null });

  if (!grant_type) {
    return { statusCode: 400, body: 'Missing grant_type' };
  }

  const url = new URL('https://app.ynab.com/oauth/token');
  const params = new URLSearchParams();
  // Use the environment variables for credentials
  params.append('client_id', YNAB_CLIENT_ID);
  params.append('client_secret', YNAB_CLIENT_SECRET);
  params.append('redirect_uri', YNAB_REDIRECT_URI);
  params.append('grant_type', grant_type);

  if (grant_type === 'authorization_code') {
    if (!code) {
      return { statusCode: 400, body: 'Missing authorization code' };
    }
    params.append('code', code);
  } else if (grant_type === 'refresh_token') {
    if (!refresh_token) {
      return { statusCode: 400, body: 'Missing refresh token' };
    }
    params.append('refresh_token', refresh_token);
  } else {
    return { statusCode: 400, body: 'Invalid grant_type' };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('YNAB token exchange failed:', data);
      console.groupEnd("ynabTokenExchange");
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to exchange token with YNAB.', details: data }),
      };
    }

    console.log("ynabTokenExchange ✅ token exchanged successfully");
    console.log("Response data:");
    console.dir(data, { depth: null });
    console.groupEnd("ynabTokenExchange");
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('ynabTokenExchange ❌ unexpected error:', error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: event.body,
      bodyType: typeof event.body
    });
    console.groupEnd("ynabTokenExchange");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};
