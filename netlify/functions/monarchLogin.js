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
    const { email, password, deviceUuid, otp } = JSON.parse(event.body)
    if (!email || !password) {
      console.error("MonarchLogin ❌ missing credentials");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Email and password are required.' })
      }
    }

    console.log("MonarchLogin login request body", {
      username: email,
      password,
      trusted_device: !!otp, // only trusted after OTP
      supports_mfa: true,
      supports_email_otp: true,
      supports_recaptcha: true,
      ...(otp && { email_otp: otp }) // include OTP if present
    });

    // Forward credentials to Monarch Money API
    console.log("MonarchLogin forwarding credentials to API");
    const response = await fetch('https://api.monarchmoney.com/auth/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'client-platform': 'web',
        'device-uuid': deviceUuid,
      },
      body: JSON.stringify({
        username: email,
        password,
        trusted_device: !!otp, // only trusted after OTP
        supports_mfa: true,
        supports_email_otp: true,
        supports_recaptcha: true,
        ...(otp && { email_otp: otp }) // include OTP if present
      })
    })

    const data = await response.json().catch(() => ({}));
    console.log("Login response (after json)", data)
    console.log("Response status", response.status)
    console.log("Response 'error_code' contains 'EMAIL_OTP_REQUIRED'?", data.error_code == 'EMAIL_OTP_REQUIRED')

    if (response.status === 403 && data.error_code == 'EMAIL_OTP_REQUIRED') {
      return { statusCode: 200, body: JSON.stringify({ otpRequired: true, detail: data.detail }) };
    }
    if (!response.ok) {
      console.error("MonarchLogin ❌ login failed", { status: data.status, error: response })
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.message || 'Login failed.' })
      }
    }

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
