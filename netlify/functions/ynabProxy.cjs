/**
 * YNAB API Proxy
 * 
 * Purpose: Proxies requests to YNAB API, adding Authorization header from HttpOnly cookie.
 * Since HttpOnly cookies can't be read by JavaScript, this function extracts the access token
 * from the cookie and adds it to the YNAB API request.
 * 
 * Request: Any HTTP method, with ?endpoint= query parameter
 * Response: YNAB API response (proxied through)
 * 
 * Example:
 *   GET /.netlify/functions/ynabProxy?endpoint=/budgets
 *   -> GET https://api.ynab.com/v1/budgets (with Authorization: Bearer <token>)
 */

const fetch = require('node-fetch');

// ============================================================================
// Utilities
// ============================================================================

function parseCookies(cookieHeader) {
  console.group('parseCookies');
  const parsed = (cookieHeader || '').split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    acc[key] = value;
    return acc;
  }, {});
  console.debug('Parsed cookies:', Object.keys(parsed));
  console.groupEnd('parseCookies');
  return parsed;
}

// ============================================================================
// Main Handler
// ============================================================================

exports.handler = async function(event) {
  console.group('ynabProxy');

  // Validate authentication
  const cookies = parseCookies(event.headers.cookie);
  const accessToken = cookies.ynab_access_token;

  if (!accessToken) {
    console.warn('❌ No access token found');
    console.groupEnd('ynabProxy');
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'No access token found. Please authenticate.' })
    };
  }
  console.log('✅ Access token present');

  // Validate endpoint
  const endpoint = event.queryStringParameters?.endpoint;
  if (!endpoint) {
    console.warn('❌ Missing endpoint parameter');
    console.groupEnd('ynabProxy');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing endpoint parameter' })
    };
  }
  console.log('✅ Endpoint:', endpoint);

  const ynabUrl = `https://api.ynab.com/v1${endpoint}`;

  // Proxy request
  console.log('Method:', event.httpMethod);
  console.log('URL:', ynabUrl);

  try {
    const response = await fetch(ynabUrl, {
      method: event.httpMethod,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: event.body || undefined
    });

    const data = await response.json();
    console.log('✅ Response status:', response.status);
    console.groupEnd('ynabProxy');

    return {
      statusCode: response.status,
      body: JSON.stringify(data)
    };
  } catch (error) {
    console.error('❌ API request error:', error.message);
    console.groupEnd('ynabProxy');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
