import fs from 'fs/promises';
import fetch from 'node-fetch';

// Insert your Monarch API secrets here:
const MONARCH_API_TOKEN = 'cd9ba5e39fd7a23725abb0cb3c5e061eebd70b1716a58587c89806b205350e8f';
const DEVICE_UUID = '57a59b6d-d1c6-449a-9e1c-699c23f9d1bd';
const OTP = '094376';

const API_URL = 'https://api.monarch.com/graphql';
const OUTPUT_FILE_PATH = './public/static-data/monarchAccountTypes.json';

async function fetchAccountTypeOptions() {
  console.group("fetchAccountTypeOptions");
  const requestBody = {
    supports_email_otp: true,
    trusted_device: true,
    email_otp: OTP,
    operationName: "Common_GetAccountTypeOptions",
    variables: {},
    query: `query Common_GetAccountTypeOptions {
      accountTypeOptions {
        type {
          name
          display
          group
          possibleSubtypes {
            display
            name
            __typename
          }
          __typename
        }
        subtype {
          name
          display
          __typename
        }
        __typename
      }
    }`
  };

  const headers = {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': `Token ${MONARCH_API_TOKEN}`,
    'client-platform': 'web',
    'device-uuid': DEVICE_UUID,
    'origin': 'https://app.monarchmoney.com',
    'referer': 'https://app.monarchmoney.com/',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
    'accept-language': 'en-US,en;q=0.9',
  };

  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(requestBody)
  });

  const json = await response.json();

  if (json.errors) {
    console.error("❌ GraphQL returned errors:");
    console.error(JSON.stringify(json.errors, null, 2));
    console.groupEnd("fetchAccountTypeOptions");
    throw new Error("GraphQL returned errors");
  }

  if (!json.data?.accountTypeOptions) {
    console.error("❌ No data returned:");
    console.error(json);
    console.groupEnd("fetchAccountTypeOptions");
    throw new Error("No data returned");
  }

  console.groupEnd("fetchAccountTypeOptions");
  return json.data.accountTypeOptions;
}

async function transform(accountTypeOptions) {
  return accountTypeOptions.map(option => ({
    typeName: option.type.name,
    typeDisplay: option.type.display,
    group: option.type.group,
    subtypes: (option.type.possibleSubtypes || []).map(sub => ({
      name: sub.name,
      display: sub.display
    }))
  }));
}

async function writeStaticFile(transformedData) {
  const now = new Date().toISOString();

  const payload = {
    generatedAt: now,
    generatedBy: "tools/fetchMonarchAccountTypes.js",
    data: transformedData
  };

  await fs.writeFile(OUTPUT_FILE_PATH, JSON.stringify(payload, null, 2));
}

async function generateStaticFile() {
  try {
    const accountTypeOptions = await fetchAccountTypeOptions();
    const transformed = await transform(accountTypeOptions);
    await writeStaticFile(transformed);
  } catch (err) {
    console.error("❌ Failed to generate static file:", err);
  }
}

generateStaticFile();
