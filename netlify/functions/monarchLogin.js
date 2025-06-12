import fetch from 'node-fetch';

export async function handler(event, context) {
  console.log("MonarchLogin start", {
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    method: event.httpMethod
  });

  if (event.httpMethod !== 'POST') {
    console.warn("MonarchLogin ❌ wrong method", { method: event.httpMethod });
    return createResponse(405, { error: 'Method not allowed. Use POST.' })
  }

  try {
    console.log("MonarchLogin parsing request body");
    const { email, password, deviceUuid, otp } = JSON.parse(event.body)

    console.log("API arguments:", { email, password, deviceUuid, otp });

    if (!email || !password) {
      console.error("MonarchLogin ❌ missing credentials");
      return createResponse(400, { error: 'Email and password are required.' })
    }

    const body = {
      username: email,
      password,
      trusted_device: true,
      supports_mfa: true,
      supports_email_otp: true,
      supports_recaptcha: true,
      ...(otp && { email_otp: otp }) // include OTP if present
    };

    console.log("MonarchLogin request body:", body);

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'client-platform': 'web',
      'device-uuid': deviceUuid,
    }

    console.log("MonarchLogin request headers:", headers);

    // Forward credentials to Monarch Money API
    console.log("MonarchLogin forwarding credentials to API");
    const response = await fetch('https://api.monarchmoney.com/auth/login/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })

    console.log("Response:", response)
    const data = await response.json().catch(() => ({}));
    console.log("Response status", response.status)
    console.log("Response data:", data)
    console.log("Response 'error_code' contains 'EMAIL_OTP_REQUIRED'?", data.error_code == 'EMAIL_OTP_REQUIRED')

    // Forbidden: OTP required or invalid credentials
    if (response.status === 403) {

      // Invalid API request
      if (data.detail && data.detail.toLowerCase().includes("version")) {
        console.error("MonarchLogin ❌ Invalid API request", response, data);
        return createResponse(500, { error: `Seems there's a bug in our code. Please let us know by reporting it here: <a href=\"https://github.com/DFazekas/YnabToMonarch/issues\">https://github.com/DFazekas/YnabToMonarch/issues</a>` })
      }

      if (data.error_code == 'EMAIL_OTP_REQUIRED') {
        // Response:
        // {
        //   "detail": "Retrieve the code from your email to continue login.",
        //   "error_code": "EMAIL_OTP_REQUIRED"
        // }
        return createResponse(200, { otpRequired: true, detail: data.detail });
      }
    }

    // Failed: CAPTCHA is required
    if (response.status == 429) {
      console.error("MonarchLogin ❌ CAPTCHA required", { status: response.status, error: data });
      return createResponse(429, { error: "CAPTCHA required. Please try again later." });
    }

    // Unexpected failure response
    if (!response.ok) {
      console.error("MonarchLogin ❌ login failed", { status: response.status, response: response, data: data })
      return createResponse(response.status, { error: data.detail || 'Login failed.' });
    }

    // Response success but strangely missing token in response
    if (!data.token) {
      console.error("MonarchLogin ❌ token missing in response", { status: response.status, response: response, data: data })
      return createResponse(500, { error: "Token not found in response." });
    }

    // Successful login
    console.log("MonarchLogin ✅ login successful", { tokenPreview: data.token.slice(0, 8) + '…' })
    return createResponse(200, { token: data.token });
  } catch (error) {
    console.error("MonarchLogin ❌ unexpected error", error)
    return createResponse(500, { error: 'Internal Server Error' });
  }
}

function createResponse(statusCode, payload = null) {
  const isObject = typeof payload === 'object' && payload !== null;
  const responseBody = isObject ? payload : {message: payload};
  
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody)
  }
}
