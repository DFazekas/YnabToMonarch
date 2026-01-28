const fetch = require('node-fetch')

module.exports.handler = async (event, context) => {
  console.group("fetchMonarchAccounts")

  if (event.httpMethod !== 'POST') {
    console.warn("MonarchAccount ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("fetchMonarchAccounts")
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    }
  }
  try {
    // Handle missing or empty body
    if (!event.body) {
      console.error("MonarchAccount ❌ missing request body");
      console.groupEnd("fetchMonarchAccounts")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required.' })
      }
    }

    // Parse body - handle both string and object cases
    const bodyData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;
    
    const { token } = bodyData
    if (!token) {
      console.error("MonarchAccount ❌ missing token");
      console.groupEnd("fetchMonarchAccounts")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required.' })
      }
    }

    const response = await fetch('https://api.monarch.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ query: 'query { accounts { id displayName } }' })
    })

    const result = await response.json();
    if (!response.ok) {
      console.error("MonarchAccount ❌ API responded with error", { status: response.status, error: error })
      console.groupEnd("fetchMonarchAccounts")
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.message || 'Account fetch failed.' })
      }
    }
    console.groupEnd("fetchMonarchAccounts")
    return {
      statusCode: 200,
      body: JSON.stringify({ accounts: result.data.accounts })
    }
  } catch (error) {
    console.error("MonarchAccount ❌ unexpected error", error)
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: event.body,
      bodyType: typeof event.body
    })
    console.groupEnd("fetchMonarchAccounts")
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' })
    }
  }
}
