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

    console.log(`🌐 Sending login request${OTP_CODE ? ' with OTP' : ''}...`);
    const response = await fetch(LOGIN_URL, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    const data = await response.json().catch(() => ({}));

    // Handle OTP requirement
    if (response.status === 403 && data.error_code === 'EMAIL_OTP_REQUIRED') {
      console.groupEnd("🔐 Logging into Monarch Money");
      console.log("");
      console.log("🔐 OTP REQUIRED!");
      console.log("================");
      console.log(`📧 ${data.detail}`);
      console.log("");
      console.log("📝 INSTRUCTIONS:");
      console.log("1. Check your email for the OTP code");
      console.log("2. Edit this script and set: const OTP_CODE = 'your-otp-code';");
      console.log("3. Save the file and run the script again");
      console.log("");
      console.log("Example:");
      console.log("const OTP_CODE = '123456'; // Replace with your actual OTP");
      console.log("");
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
        console.log("");
        console.log("❌ OTP AUTHENTICATION FAILED!");
        console.log("================================");
        console.log("The OTP code you provided appears to be incorrect or expired.");
        console.log("");
        console.log("📝 NEXT STEPS:");
        console.log("1. Request a new OTP code from Monarch");
        console.log("2. Update the OTP_CODE variable with the new code");
        console.log("3. Run the script again");
        console.log("");
        throw new Error(`❌ Invalid OTP code. ${data.detail || 'Please try again with a new code.'}`);
      }

      throw new Error(`❌ Login failed: ${data.detail || 'Unknown error'} (Status: ${response.status})`);
    }

    // Check for token
    if (!data.token) {
      console.groupEnd("🔐 Logging into Monarch Money");
      throw new Error("❌ Login succeeded but no token received");
    }

    console.log(`✅ Login successful! Token: ${data.token.slice(0, 8)}...`);
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

    console.log("🔍 Fetching all accounts response:", json);

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
    console.log(`✅ Found ${accounts.length} accounts`);
    accounts.forEach((account, index) => {
      console.log(`  ${index + 1}. ${account.displayName} (${account.accountType?.display || 'Unknown'}) - ID: ${account.id}`);
    });

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
  console.log("🚨 DANGER: This will delete ALL accounts from your Monarch Money account!");
  console.log("⚠️  This action cannot be undone!");
  console.log("⏱️  Starting deletion process in 5 seconds...");
  console.log("");

  // Display device UUID for future reference
  if (!DEVICE_UUID_PROVIDED) {
    console.log("📱 Generated new device UUID for this session:");
    console.log(`   ${DEVICE_UUID}`);
    console.log("");
    console.log("💡 To avoid OTP requests in future runs, set:");
    console.log(`   const DEVICE_UUID_PROVIDED = '${DEVICE_UUID}';`);
    console.log("");
  } else {
    console.log(`📱 Using provided device UUID: ${DEVICE_UUID}`);
    console.log("");
  }

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

    console.log("");
    console.log(`🗑️  Starting deletion of ${accounts.length} accounts...`);
    console.log("");

    // Step 3: Delete each account with progress tracking
    const results = {
      total: accounts.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      console.log(`🗑️  [${i + 1}/${accounts.length}] Deleting "${account.displayName}"...`);

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

    // Step 4: Print summary
    console.log("");
    console.log("=".repeat(60));
    console.log("📊 DELETION SUMMARY");
    console.log("=".repeat(60));
    console.log(`Total accounts: ${results.total}`);
    console.log(`✅ Successfully deleted: ${results.successful}`);
    console.log(`❌ Failed to delete: ${results.failed}`);

    if (results.errors.length > 0) {
      console.log("");
      console.log("❌ Failed deletions:");
      results.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. "${error.account}" (${error.id})`);
        console.log(`     Error: ${typeof error.error === 'string' ? error.error : JSON.stringify(error.error)}`);
      });
    }

    console.log("");
    if (results.successful === results.total) {
      console.log("🎉 All accounts successfully deleted!");
    } else if (results.successful > 0) {
      console.log("⚠️  Some accounts were deleted, but some failed. Check the errors above.");
    } else {
      console.log("💥 No accounts were successfully deleted. Check your credentials and permissions.");
    }

  } catch (error) {
    console.log("");
    console.error("💥 Fatal error during deletion process:", error.message);
    process.exit(1);
  }
}

// Run the deletion process
deleteAllAccounts().catch(error => {
  console.error("💥 Unhandled error:", error);
  process.exit(1);
});
