const fetch = require('node-fetch')

module.exports.handler = async (event, context) => {
  console.log("MonarchLogin start", {
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    method: event.httpMethod
  });

  if (event.httpMethod !== 'POST') {
    console.warn("MonarchLogin ❌ wrong method", { method: event.httpMethod });
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
    }
  }
  try {
    console.log("MonarchLogin parsing request body");
    const { email, password } = JSON.parse(event.body)
    if (!email || !password) {
      console.error("MonarchLogin ❌ missing credentials");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required.' })
      }
    }

    // Forward credentials to Monarch Money API
    console.log("MonarchLogin forwarding credentials to API");
    const response = await fetch('https://api.monarchmoney.com/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password })
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("MonarchLogin ❌ login failed", { status: response.status, error: error })
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: error.message || 'Login failed.' })
      }
    }

    const data = await response.json()
    if (!data.token) {
      console.error("MonarchLogin ❌ token missing in response")
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Token not found in response.' })
      }
    }

    // Return the access token to the frontend
    console.log("MonarchLogin ✅ login successful", { tokenPreview: data.token.slice(0, 8) + '…' })
    return {
      statusCode: 200,
      body: JSON.stringify({ token: data.token })
    }
  } catch (error) {
    console.error("MonarchLogin ❌ unexpected error", error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    }
  }
}
