import fetch from 'node-fetch';
import FormData from 'form-data';
import Readable from 'stream';

// Constants for configuration
const GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql'
const STATEMENTS_UPLOAD_URL = 'https://api.monarchmoney.com/statements/upload-async/'

export async function handler(event, context) {
  console.group("CreateMonarchAccounts Lambda Handler")
  console.log("CreateMonarchAccounts start", {
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    method: event.httpMethod
  });

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    console.warn("❌ wrong method", { method: event.httpMethod });
    return createResponse(405, 'Method not allowed. Use POST.')
  }

  try {
    console.log("Parsing request body");
    const { accounts, token } = JSON.parse(event.body)
    console.log("Accounts:", accounts);

    // Validate token
    if (!token) {
      console.error("❌ missing token")
      return createResponse(400, 'API token is required.')
    }

    // Validate mappings
    if (!accounts || !Array.isArray(accounts)) {
      console.error("❌ invalid accounts format")
      return createResponse(400, 'Accounts must be an array.')
    }

    // Process all accounts concurrently with controlled concurrency
    for (const account of accounts) {
      const response = await processAccount(token, account)
      if (response.error) {
        console.error("❌ error processing account", { account: account.modifiedName, error: response.error })
        return createResponse(500, `Error processing account "${account.modifiedName}": ${response.error}`)
      }
      console.log("✅ processed account", { account: account })
    }

    console.log("✅ all accounts completed")
    console.groupEnd("CreateMonarchAccounts Lambda Handler")
    return createResponse(200, 'All account accounts imported successfully.')
  } catch (error) {
    console.error("❌ unexpected error", error)
    console.groupEnd("CreateMonarchAccounts Lambda Handler")
    return createResponse(500, error.message)
  }
}

async function createManualAccount(token, accountInput) {
  console.group("Creating Manual Account")

  console.log("accountInput:", accountInput);
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

  try {
    const variables = { input: accountInput }
    const result = await performGraphQLRequest(token, query, variables, "Web_CreateManualAccount")

    if (result.error) return { error: result.error }

    const apiErrors = data.createManualAccount.errors;
    console.log("API Errors:", apiErrors);
    if (apiErrors) {
      const fieldErrors = apiErrors.fieldErrors?.map(fe => `${fe.field}: ${fe.messages.join(', ')}`).join('; ') || ''
      const message = apiErrors.message || 'Unknown error'
      throw new Error(`${message} ${fieldErrors}`)
    }

    console.groupEnd("Creating Manual Account")
    console.log("✅ Manual account created successfully:", data.createManualAccount.account);
    return { account: data.createManualAccount.account }
  } catch (err) {

    console.groupEnd("Creating Manual Account")
    throw new Error(err.message)
  }
}

async function uploadStatementsFile(token, transactions) {
  console.group("Uploading Statements File")

  // Generate CSV content
  const csvContent = generateCSV(transactions)

  // Create a readable stream from the CSV string
  const csvStream = Readable.from([csvContent])

  // Prepare FormData
  const form = new FormData()
  form.append('file', csvStream, {
    filename: 'transactions.csv',
    contentType: 'text/csv'
  })

  try {
    const response = await fetch(STATEMENTS_UPLOAD_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        ...form.getHeaders()
      },
      body: form
    })

    const result = await response.json()

    if (!response.ok) {
      throw new Error(`Statement file upload failed: ${JSON.stringify(result)}`)
    }

    console.groupEnd("Uploading Statements File")
    return { sessionKey: result.session_key }
  } catch (error) {
    console.groupEnd("Uploading Statements File")
    throw new Error(`Error uploading statement file: ${error.message}`)
  }
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

  const result = await performGraphQLRequest(token, query, variables)

  if (result.error) return { error: result.error }
  const data = result.data

  const uploadSession = data.parseUploadStatementSession.uploadStatementSession.status
  console.groupEnd("Importing Transactions")
  return { status: uploadSession }
}

function createResponse(statusCode, message = null) {
  const responseBody = { message }
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody)
  }
}

async function performGraphQLRequest(token, query, variables, operationName = null) {
  console.group("Performing GraphQL Request")
  console.log("token:", token, "query:", query, "variables:", variables);
  try {
    const body = { query, variables }
    if (operationName) body.operationName = operationName

    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(body)
    })

    const result = await response.json()

    if (!response.ok || result.errors) {

      // Check if subscription has ended
      if (result.errors.some(err => err.message.includes("SUBSCRIPTION_ENDED"))) {
        console.error("❌ Subscription has ended. Please renew your subscription or use a different account.");
        console.groupEnd("Performing GraphQL Request")
        return { error: "Monarch subscription has ended. Please renew your subscription or use different account." };
      }

      const errors = result.errors || (result.data && result.data.errors)
      console.groupEnd("Performing GraphQL Request")
      return { error: errors ? errors.map(e => e.message).join('; ') : 'Unknown error' }
    }

    console.groupEnd("Performing GraphQL Request")
    return { data: result.data };
  } catch (error) {
    console.groupEnd("Performing GraphQL Request")
    throw new Error(error.message)
  }
}

async function handleUploadAndImport(token, accountId, transactions) {
  console.group("Handling Upload and Import")
  try {
    // Upload statement file
    const { sessionKey } = await uploadStatementsFile(token, transactions)

    // Wait 1.5 seconds to ensure Monarch finishes uploading statement file
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Import transactions into the account
    await importTransactions(token, accountId, sessionKey)
    console.log("✅ Transactions imported successfully for account:", accountId)
    console.groupEnd("Handling Upload and Import")
  } catch (error) {
    console.error(`❌ Failed Upload/Import: ${error}`)
    console.groupEnd("Handling Upload and Import")
    throw error
  }
}

function generateCSV(transactions) {
  console.group("Generating CSV")
  const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`
  const rows = transactions.map(
    (tx) =>
      `"${tx.Date}","${tx.Merchant}","${tx.Category}","${tx.Account}","${tx['Original Statement']}","${tx.Notes}","${tx.Amount}","${tx.Tags}"`
  )
  console.groupEnd("Generating CSV")
  return [headers, ...rows].join('\n')
}

async function processAccount(token, account) {
  console.group("Process account")

  if (account.excluded) {
    console.warn(`Skipping excluded account: ${account.modifiedName}`);
    return;
  }

  const accountInput = {
    type: account.type,
    subtype: account.subtype,
    includeInNetWorth: true,
    name: account.modifiedName,
    displayBalance: 0.0
  }

  try {
    // Create new account in Monarch
    const { account: newAccount, error } = await createManualAccount(token, accountInput)

    if (error) return { error }

    // Handle statement file upload and importing into account
    await handleUploadAndImport(token, newAccount.id, account.transactions)
    console.groupEnd("Process account")
  } catch (error) {
    console.groupEnd("Process account")
    throw new Error(error.message)
  }

}
