function parseCookies(cookieHeader = '') {
  return cookieHeader.split(';').reduce((acc, pair) => {
    if (!pair.trim()) return acc;
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) return acc;
    const key = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    acc[key] = value;
    return acc;
  }, {});
}

exports.handler = async function handler(event) {
  console.group('ynabAuthStatus');

  if (event.httpMethod !== 'GET') {
    console.warn('ynabAuthStatus ❌ wrong method', { method: event.httpMethod });
    console.groupEnd('ynabAuthStatus');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Use GET.' })
    };
  }

  try {
    const cookies = parseCookies(event.headers.cookie);
    const hasAccessToken = Boolean(cookies.ynab_access_token);
    const hasRefreshToken = Boolean(cookies.ynab_refresh_token);

    const payload = {
      authenticated: hasAccessToken,
      hasAccessToken,
      hasRefreshToken
    };

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      },
      body: JSON.stringify(payload)
    };
  } catch (error) {
    console.error('ynabAuthStatus ❌ unexpected error', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unable to determine auth status.' })
    };
  } finally {
    console.groupEnd('ynabAuthStatus');
  }
};
