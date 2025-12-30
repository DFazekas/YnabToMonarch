/**
 * YNAB Token Refresh
 * 
 * Purpose: Handles token refresh when the access token expires.
 * Called whenever an API request returns 401 (Unauthorized) due to expired access token.
 * 
 * Request: POST (no body required - refresh token comes from HttpOnly cookie)
 * Response: Sets new HttpOnly cookies with refreshed tokens, returns { success: true }
 * 
 * Flow:
 * 1. Frontend makes API call to YNAB
 * 2. YNAB returns 401 (access token expired)
 * 3. Frontend calls this function to refresh
 * 4. This function extracts refresh token from HttpOnly cookie
 * 5. Exchanges refresh token for new access and refresh tokens
 * 6. Sets new HttpOnly cookies
 * 7. Frontend retries original API call
 * 
 * Security: Refresh token is extracted from HttpOnly cookie (secure, not accessible to JS)
 * See ynabTokenExchange.cjs for initial OAuth token exchange.
 */

const fetch = require('node-fetch');

function parseCookies(cookieHeader) {
  return (cookieHeader || '').split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
}

exports.handler = async function(event) {
  console.group("ynabTokenRefresh");

  if (event.httpMethod !== 'POST') {
    console.warn("ynabTokenRefresh ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("ynabTokenRefresh");
    return { 
      statusCode: 405, 
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  const cookies = parseCookies(event.headers.cookie);
  const refreshToken = cookies.ynab_refresh_token;

  if (!refreshToken) {
    console.warn("ynabTokenRefresh ❌ no refresh token in cookies");
    console.groupEnd("ynabTokenRefresh");
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No refresh token found. Please log in again.' })
    };
  }

  const { YNAB_CLIENT_ID, YNAB_CLIENT_SECRET, YNAB_REDIRECT_URI } = process.env;

  const url = new URL('https://app.ynab.com/oauth/token');
  const params = new URLSearchParams();
  params.append('client_id', YNAB_CLIENT_ID);
  params.append('client_secret', YNAB_CLIENT_SECRET);
  params.append('redirect_uri', YNAB_REDIRECT_URI);
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', refreshToken);

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
      console.error('YNAB token refresh failed:', data);
      console.groupEnd("ynabTokenRefresh");
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to refresh token with YNAB.', details: data }),
      };
    }

    console.log("ynabTokenRefresh ✅ token refreshed successfully");
    console.groupEnd("ynabTokenRefresh");
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
    console.error('ynabTokenRefresh ❌ unexpected error:', error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack
    });
    console.groupEnd("ynabTokenRefresh");
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'An internal server error occurred.' }),
    };
  }
};
