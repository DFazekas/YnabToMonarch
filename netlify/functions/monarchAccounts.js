const fetch = require('node-fetch')

module.exports.handler = async (event, context) => {
  console.log("MonarchAccount start", {
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    method: event.httpMethod
  })

  if (event.httpMethod !== 'POST') {
    console.warn("MonarchAccount ❌ wrong method", { method: event.httpMethod });
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    }
  }
  try {
    console.log("MonarchAccount parsing request body");
    const { token } = JSON.parse(event.body)
    if (!token) {
      console.error("MonarchAccount ❌ missing token");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token is required.' })
      }
    }

    // Fetch accounts from Monarch Money API
    console.log("MonarchAccount calling GraphQL API");
    const response = await fetch('https://api.monarchmoney.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ query: 'query { accounts { id displayName } }' })
    })

    const result = await res.json();
    if (!response.ok) {
      console.error("MonarchAccount ❌ API responded with error", { status: response.status, error: error })
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.message || 'Account fetch failed.' })
      }
    }

    // Return accounts to the frontend
    console.log("MonarchAccount ✅ fetched accounts", { count: result.data.accounts.length })
    return {
      statusCode: 200,
      body: JSON.stringify({ accounts: result.data.accounts })
    }
  } catch (error) {
    console.error("MonarchAccount ❌ unexpected error", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}
