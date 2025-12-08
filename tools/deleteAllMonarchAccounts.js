import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

const MONARCH_EMAIL = 'fazekas.devon+monarch7@gmail.com';
const MONARCH_PASSWORD = '!f7dTT%USwy$&r';

// 🔐 OTP SUPPORT: If the login requires OTP, paste the code here and rerun the script
// Leave as null if no OTP is needed or you haven't received one yet
const OTP_CODE = "116401"; // Set to '123456' if you have an OTP code

// 📱 DEVICE UUID: Provide a consistent device UUID to avoid repeated OTP requests
// Leave as null to generate a new one (will be displayed for future use)
const DEVICE_UUID_PROVIDED = "da5bfb56-1cb4-402e-861d-b3c07887119c"; // Set to 'uuid-value' if you have one from previous runs

const API_URL = 'https://api.monarchmoney.com/graphql';
const LOGIN_URL = 'https://api.monarchmoney.com/auth/login/';

// Generate or use provided device UUID
const DEVICE_UUID = DEVICE_UUID_PROVIDED || uuidv4();

async function loginToMonarch() {
  console.group("🔐 Logging into Monarch Money");

  try {
    const body = {
      username: MONARCH_EMAIL,
      password: MONARCH_PASSWORD,
      trusted_device: true,
      supports_mfa: true,
      supports_email_otp: true,
      supports_recaptcha: true,
      ...(OTP_CODE && { email_otp: OTP_CODE }) // Include OTP if provided
    };

    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'client-platform': 'web',
      'device-uuid': DEVICE_UUID,
    };

    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));

    // Handle OTP requirement
    if (response.status === 403 && data.error_code === 'EMAIL_OTP_REQUIRED') {
      console.groupEnd("🔐 Logging into Monarch Money");
      throw new Error("❌ OTP required. Please follow the instructions above.");
    }

    // Handle CAPTCHA requirement
    if (response.status === 429) {
      console.groupEnd("🔐 Logging into Monarch Money");
      throw new Error("❌ CAPTCHA required. Please try again later.");
    }

    // Handle other errors
    if (!response.ok) {
      console.groupEnd("🔐 Logging into Monarch Money");

      // If we tried with OTP but it was wrong
      if (OTP_CODE && response.status === 403) {
        throw new Error(`❌ Invalid OTP code. ${data.detail || 'Please try again with a new code.'}`);
      }

      throw new Error(`❌ Login failed: ${data.detail || 'Unknown error'} (Status: ${response.status})`);
    }

    // Check for token
    if (!data.token) {
      console.groupEnd("🔐 Logging into Monarch Money");
      throw new Error("❌ Login succeeded but no token received");
    }

    if (OTP_CODE) {
      console.log("🔐 OTP verification successful!");
    }
    console.groupEnd("🔐 Logging into Monarch Money");
    return data.token;

  } catch (error) {
    console.groupEnd("🔐 Logging into Monarch Money");
    throw error;
  }
}

async function fetchAllAccounts(token) {
  console.group("🔍 Fetching all accounts");

  const requestBody = {
    query: 'query { accounts { id displayName } }'
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Token ${token}`
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    const json = await response.json();

    if (json.errors) {
      console.error("❌ GraphQL returned errors:");
      console.error(JSON.stringify(json.errors, null, 2));
      console.groupEnd("🔍 Fetching all accounts");
      throw new Error("GraphQL returned errors");
    }

    if (!json.data?.accounts) {
      console.error("❌ No accounts data returned:");
      console.error(json);
      console.groupEnd("🔍 Fetching all accounts");
      throw new Error("No accounts data returned");
    }

    const accounts = json.data.accounts;

    console.groupEnd("🔍 Fetching all accounts");
    return accounts;
  } catch (error) {
    console.error("❌ Failed to fetch accounts:", error.message);
    console.groupEnd("🔍 Fetching all accounts");
    throw error;
  }
}

async function deleteAccount(token, accountId, accountName) {
  const requestBody = {
    operationName: "Common_DeleteAccount",
    variables: {
      id: accountId
    },
    query: `mutation Common_DeleteAccount($id: UUID!) {
      deleteAccount(id: $id) {
        deleted
        errors {
          ...PayloadErrorFields
          __typename
        }
        __typename
      }
    }

    fragment PayloadErrorFields on PayloadError {
      fieldErrors {
        field
        messages
        __typename
      }
      message
      code
      __typename
    }`
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Token ${token}`,
    'client-platform': 'web',
    'device-uuid': DEVICE_UUID,
    'origin': 'https://app.monarchmoney.com',
    'referer': 'https://app.monarchmoney.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
  };

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestBody)
    });

    const json = await response.json();

    if (json.errors) {
      console.error(`❌ Failed to delete "${accountName}": GraphQL errors`);
      console.error(JSON.stringify(json.errors, null, 2));
      return { success: false, error: json.errors };
    }

    if (!json.data?.deleteAccount) {
      console.error(`❌ Failed to delete "${accountName}": No delete response`);
      console.error(json);
      return { success: false, error: 'No delete response' };
    }

    const deleteResult = json.data.deleteAccount;

    if (deleteResult.errors && deleteResult.errors.length > 0) {
      console.error(`❌ Failed to delete "${accountName}": Server errors`);
      console.error(JSON.stringify(deleteResult.errors, null, 2));
      return { success: false, error: deleteResult.errors };
    }

    if (deleteResult.deleted) {
      console.log(`✅ Successfully deleted "${accountName}"`);
      return { success: true };
    } else {
      console.error(`❌ Failed to delete "${accountName}": Not deleted (unknown reason)`);
      return { success: false, error: 'Not deleted' };
    }

  } catch (error) {
    console.error(`❌ Failed to delete "${accountName}": Network error - ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function deleteAllAccounts() {
  // Wait 5 seconds to give user a chance to cancel
  await new Promise(resolve => setTimeout(resolve, 5000));

  let token;
  try {
    // Step 1: Login to get API token
    token = await loginToMonarch();

    // Step 2: Fetch all accounts
    const accounts = await fetchAllAccounts(token);

    if (accounts.length === 0) {
      console.log("ℹ️  No accounts found to delete.");
      return;
    }

    // Step 3: Delete each account with progress tracking
    const results = {
      total: accounts.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];

      const result = await deleteAccount(token, account.id, account.displayName);

      if (result.success) {
        results.successful++;
      } else {
        results.failed++;
        results.errors.push({
          account: account.displayName,
          id: account.id,
          error: result.error
        });
      }

      // Small delay between deletions to be API-friendly
      if (i < accounts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    if (results.errors.length > 0) {
      console.log("❌ Failed deletions:");
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. "${error.account}" (${error.id})`);
        console.log(`     Error: ${typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}`);
      });
    }
  } catch (error) {
    console.error("💥 Fatal error during deletion process:", error.message);
    process.exit(1);
  }
}

// Run the deletion process
deleteAllAccounts().catch(error => {
  console.error("💥 Unhandled error:", error);
  process.exit(1);
});
