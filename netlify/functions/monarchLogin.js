import fetch from 'node-fetch';

export async function handler(event, context) {
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
        trusted_device: true, // only trusted after OTP
        supports_mfa: true,
        supports_email_otp: true,
        supports_recaptcha: true,
        ...(otp && { email_otp: otp }) // include OTP if present
      })
    })

    console.log("Response:", response)
    const data = await response.json().catch(() => ({}));
    console.log("Login response (after json)", data)
    console.log("Response status", response.status)
    console.log("Response 'error_code' contains 'EMAIL_OTP_REQUIRED'?", data.error_code == 'EMAIL_OTP_REQUIRED')

    // Failed: OTP Required
    if (response.status === 403) {
      console.log("data:", data)

      // Invalid API request
      if (data.detail && data.detail.toLowerCase().includes("version")) {
        console.error("MonarchLogin ❌ Invalid API request", response, data);
        return {
          statusCode: 500,
          body: JSON.stringify({ error: "Seems there's a bug in our code. Please let us know by reporting it here: <a href=\"https://github.com/DFazekas/YnabToMonarch/issues\">https://github.com/DFazekas/YnabToMonarch/issues</a>" })
        }
      }
      
      // TODO: OTP required
      return { statusCode: 200, body: JSON.stringify({ otpRequired: true, detail: data.detail }) };
    }

    // Failed: CAPTCHA is required
    if (response.status == 429) {
      console.error("MonarchLogin ❌ CAPTCHA required", { status: response.status, error: data });
      return {
        statusCode: 429,
        body: JSON.stringify({ error: 'CAPTCHA required. Please try again later.' })
      }
    }

    if (!response.ok) {
      console.error("MonarchLogin ❌ login failed", { status: response.status, response: response, data: data })
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: data.detail || 'Login failed.' })
      }
    }

    if (!data.token) {
      console.error("MonarchLogin ❌ token missing in response", {status: response.status, response: response, data: data})
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
