import fetch from 'node-fetch';
import { decryptPassword } from '../../shared/crypto-node.js';

export async function handler(event, context) {
  console.group("monarchLogin");

  if (event.httpMethod !== 'POST') {
    console.warn("MonarchLogin ❌ wrong method", { method: event.httpMethod });
    console.groupEnd("monarchLogin");
    return createResponse(405, { error: 'Method not allowed. Use POST.' })
  }

  try {
    let { email, encryptedPassword, deviceUuid, otp } = JSON.parse(event.body)
    if (!email || !encryptedPassword || !deviceUuid) {
      console.error("MonarchLogin ❌ missing credentials");
      console.groupEnd("monarchLogin");
      return createResponse(400, { error: 'Email, password, and device UUID are required.' })
    }

    const decryptedPassword = decryptPassword(email, encryptedPassword);
    const body = {
      username: email,
      password: decryptedPassword,
      trusted_device: true,
      supports_mfa: true,
      supports_email_otp: true,
      supports_recaptcha: true,
      ...(otp && { email_otp: otp }) // include OTP if present
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'client-platform': 'web',
      'device-uuid': deviceUuid,
    }

    const response = await fetch('https://api.monarchmoney.com/auth/login/', {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    })

    const data = await response.json().catch(() => ({}));

    // Forbidden: OTP required or invalid credentials
    if (response.status === 403) {

      // Invalid API request
      if (data.detail && data.detail.toLowerCase().includes("version")) {
        console.error("MonarchLogin ❌ Invalid API request", response, data);
        console.groupEnd("monarchLogin");
        return createResponse(500, { error: `Seems there's a bug in our code. Please let us know by reporting it here: <a href=\"https://github.com/DFazekas/YnabToMonarch/issues\">https://github.com/DFazekas/YnabToMonarch/issues</a>` })
      }

      if (data.error_code == 'EMAIL_OTP_REQUIRED') {
        // Response:
        // {
        //   "detail": "Retrieve the code from your email to continue login.",
        //   "error_code": "EMAIL_OTP_REQUIRED"
        // }
        console.groupEnd("monarchLogin");
        return createResponse(200, { otpRequired: true, detail: data.detail });
      }
    }

    // Failed: CAPTCHA is required
    if (response.status == 429) {
      console.error("MonarchLogin ❌ CAPTCHA required", { status: response.status, error: data });
      console.groupEnd("monarchLogin");
      return createResponse(429, { error: "CAPTCHA required. Please try again later." });
    }

    // Unexpected failure response
    if (!response.ok) {
      console.error("MonarchLogin ❌ login failed", { status: response.status, response: response, data: data })
      console.groupEnd("monarchLogin");
      return createResponse(response.status, { error: data.detail || 'Login failed.' });
    }

    // Response success but strangely missing token in response
    if (!data.token) {
      console.error("MonarchLogin ❌ token missing in response", { status: response.status, response: response, data: data })
      console.groupEnd("monarchLogin");
      return createResponse(500, { error: "Token not found in response." });
    }

    // Successful login
    console.log("MonarchLogin ✅ login successful", { tokenPreview: data.token.slice(0, 8) + '…' })
    console.groupEnd("monarchLogin");
    return createResponse(200, { token: data.token });
  } catch (error) {
    console.error("MonarchLogin ❌ unexpected error", error)
    console.groupEnd("monarchLogin");
    return createResponse(500, { error: 'Internal Server Error' });
  }
}

function createResponse(statusCode, payload = null) {
  const isObject = typeof payload === 'object' && payload !== null;
  const responseBody = isObject ? payload : { message: payload };

  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody)
  }
}
