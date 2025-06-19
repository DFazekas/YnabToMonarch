import fetch from 'node-fetch';
import FormData from 'form-data';
import { Readable } from 'stream';
import generateCSV from '../../shared/generateCsv.js';

// Constants for configuration
const GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql'
const STATEMENTS_UPLOAD_URL = 'https://api.monarchmoney.com/statements/upload-async/'

export async function handler(event, context) {
  console.group("CreateMonarchAccounts Lambda Handler")

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    console.warn("❌ wrong method", { method: event.httpMethod });
    return createResponse(405, { error: 'Method not allowed. Use POST.' })
  }

  try {
    const { accounts, token } = JSON.parse(event.body)
    const results = await Promise.allSettled(accounts.map(account =>
      processAccount(token, account).then((result) => ({
        name: account.modifiedName,
        success: true,
        sessionKeys: result.sessionKeys || []
      })).catch(err => ({
        name: account.modifiedName,
        success: false,
        error: err.message
      }))
    ));

    const success = [];
    const failed = [];

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        success.push({ name: result.value.name, sessionKeys: result.value.sessionKeys });
      } else {
        const failedResult = result.status === 'fulfilled' ? result.value : result.reason;
        failed.push({ name: failedResult.name, error: failedResult.error || 'Unknown error' });
      }
    }

    return createResponse(200, { success, failed });
  } catch (err) {
    console.error("❌ unexpected error", error)
    return createResponse(500, { error: err.message });
  } finally {
    console.groupEnd("CreateMonarchAccounts Lambda Handler")
  }
}

async function processAccount(token, account) {
  console.group("Process account")

  if (!account.included) {
    console.warn(`Skipping excluded account: ${account.modifiedName}`);
    return { skipped: true };
  }

  const accountInput = {
    type: account.type,
    subtype: account.subtype,
    includeInNetWorth: true,
    name: account.modifiedName,
    displayBalance: 0.0
  }

  // Create new account in Monarch
  const { account: newAccount, error } = await createManualAccount(token, accountInput)
  if (error) return { error }

  const txChunks = chunkArray(account.transactions, 3000);
  if (txChunks.length > 1) {
    console.warn(`Account ${account.modifiedName} has ${txChunks.length} chunks of transactions, which may take longer to process.`);
  }

  const sessionKeys = [];

  await Promise.all(txChunks.map(async (chunk) => {
    const { sessionKey } = await uploadStatementsFile(token, chunk, account.modifiedName);
    await importTransactions(token, newAccount.id, sessionKey);
    sessionKeys.push(sessionKey);
  }));

  console.groupEnd("Process account");
  return { sessionKeys };
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function createManualAccount(token, input) {
  console.group("Creating Manual Account")

  const query = `
    mutation Web_CreateManualAccount($input: CreateManualAccountMutationInput!) {
      createManualAccount(input: $input) {
        account { id __typename }
        errors {
          fieldErrors { field messages __typename }
          message code __typename
        }
        __typename
      }
    }
  `;

  const res = await performGraphQLRequest(token, query, { input });

  if (res.error) return { error: res.error };
  if (res.data.createManualAccount.errors?.length) {
    console.groupEnd("Creating Manual Account")
    return { error: res.data.createManualAccount.errors.map(e => e.message).join('; ') };
  }

  console.groupEnd("Creating Manual Account")
  return { account: res.data.createManualAccount.account };
}

async function uploadStatementsFile(token, transactions, accountName) {
  console.group("Uploading Statements File")

  // Generate CSV content
  const csv = generateCSV(accountName, transactions)
  const csvStream = Readable.from([csv])

  // Prepare FormData
  const form = new FormData()
  form.append('file', csvStream, {
    filename: 'transactions.csv',
    contentType: 'text/csv'
  })

  const res = await fetch(STATEMENTS_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      ...form.getHeaders()
    },
    body: form
  })

  const result = await res.json()

  if (!res.ok) {
    console.error("❌ Upload failed", { status: res.status, result: result });
    console.groupEnd("Uploading Statements File")
    throw new Error(`Upload failed: ${JSON.stringify(result)}`)
  }

  console.groupEnd("Uploading Statements File")
  return { sessionKey: result.session_key }
}

async function importTransactions(token, accountId, sessionKey) {
  console.group("Importing Transactions")

  const query = `
      mutation Web_ParseUploadStatementSession($input: ParseStatementInput!) {
          parseUploadStatementSession(input: $input) {
              uploadStatementSession {
                  ...UploadStatementSessionFields
                  __typename
              }
              __typename
          }
      }
      fragment UploadStatementSessionFields on UploadStatementSession {
          sessionKey
          status
          errorMessage
          skipCheckForDuplicates
          uploadedStatement {
              id
              transactionCount
              __typename
          }
          __typename
      }
  `

  const variables = {
    input: {
      parserName: 'monarch_csv',
      sessionKey,
      accountId,
      skipCheckForDuplicates: false,
      shouldUpdateBalance: true
    }
  }

  const res = await performGraphQLRequest(token, query, variables)
  if (res.error) throw new Error(res.error);
}

async function performGraphQLRequest(token, query, variables) {
  console.group("Performing GraphQL Request")

  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify({ query, variables })
  })

  const result = await res.json()

  if (!res.ok || result.errors) {

    // Check if subscription has ended
    if (result?.errors?.some(err => err.message.includes("SUBSCRIPTION_ENDED"))) {
      console.error("❌ Subscription has ended. Please renew your subscription or use a different account.");
      console.groupEnd("Performing GraphQL Request")
      throw new Error("Monarch subscription has ended. Please renew your subscription or use different account.")
    }

    console.groupEnd("Performing GraphQL Request")
    throw new Error(`GraphQL request failed: ${JSON.stringify(result.errors)}`);
  }

  console.groupEnd("Performing GraphQL Request")
  return { data: result.data }
}

function createResponse(statusCode, payload) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }
}
