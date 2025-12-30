/**
 * YNAB OAuth Token Exchange
 * 
 * Purpose: Handles the initial OAuth authorization code exchange with YNAB.
 * This is called once during the OAuth callback flow when the user authorizes the app.
 * 
 * Request: POST with JSON body containing { code: authorization_code }
 * Response: Sets HttpOnly cookies with access and refresh tokens, returns { success: true }
 * 
 * Flow:
 * 1. User clicks "Connect to YNAB"
 * 2. Redirected to YNAB login
 * 3. User authorizes the app
 * 4. YNAB redirects back with authorization code
 * 5. Frontend calls this function with the code
 * 6. This function exchanges code for tokens and sets HttpOnly cookies
 * 
 * Security: Tokens are stored as HttpOnly cookies (not accessible to JavaScript)
 * See ynabTokenRefresh.cjs for token refresh when access token expires.
 */

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

  // This endpoint handles initial OAuth authorization code exchange only
  // Token refresh is handled separately in ynabTokenRefresh.cjs
  const { YNAB_CLIENT_ID, YNAB_CLIENT_SECRET, YNAB_REDIRECT_URI } = process.env;
  const { code } = bodyData;

  if (!code) {
    console.error("ynabTokenExchange ❌ missing authorization code");
    console.groupEnd("ynabTokenExchange");
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing authorization code' }) };
  }

  const url = new URL('https://app.ynab.com/oauth/token');
  const params = new URLSearchParams();
  params.append('client_id', YNAB_CLIENT_ID);
  params.append('client_secret', YNAB_CLIENT_SECRET);
  params.append('redirect_uri', YNAB_REDIRECT_URI);
  params.append('grant_type', 'authorization_code');
  params.append('code', code);

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
    console.groupEnd("ynabTokenExchange");
    return {
      statusCode: 200,
      headers: {
        'Set-Cookie': [
          `ynab_access_token=${data.access_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`,
          `ynab_refresh_token=${data.refresh_token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=31536000`
        ]
      },
      body: JSON.stringify({ success: true }),
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
