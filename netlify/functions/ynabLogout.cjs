exports.handler = async function handler(event) {
  console.group('ynabLogout');

  if (event.httpMethod !== 'POST') {
    console.warn('ynabLogout ❌ wrong method', { method: event.httpMethod });
    console.groupEnd('ynabLogout');
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    };
  }

  try {
    console.log('ynabLogout ✅ clearing YNAB cookies');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': [
          'ynab_access_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0',
          'ynab_refresh_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0'
        ]
      },
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    console.error('ynabLogout ❌ unexpected error', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to revoke YNAB tokens.' })
    };
  } finally {
    console.groupEnd('ynabLogout');
  }
};
