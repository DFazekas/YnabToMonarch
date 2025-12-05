const fetch = require('node-fetch');

exports.handler = async function(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // These secrets will be stored in your Netlify environment variables for production
  const { YNAB_CLIENT_ID, YNAB_CLIENT_SECRET, YNAB_REDIRECT_URI } = process.env;
  const { code, grant_type, refresh_token } = JSON.parse(event.body);

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
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to exchange token with YNAB.', details: data }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error('Serverless function error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An internal server error occurred.' }),
    };
  }
};
