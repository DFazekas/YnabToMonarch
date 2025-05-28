const fetch = require('node-fetch')
const FormData = require('form-data')
const { Readable } = require('stream')

// Constants for configuration
const GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql'
const STATEMENTS_UPLOAD_URL = 'https://api.monarchmoney.com/statements/upload-async/'

class Logger {
  constructor() {
    this.logs = []
  }

  add(message) {
    this.logs.push({ type: 'success', message })
  }

  addError(message) {
    this.logs.push({ type: 'error', message })
  }

  getLogs() {
    return this.logs
  }
}

module.exports.handler = async (event, context) => {
  console.group("MonarchMapAccount Lambda Handler")
  console.log("MonarchMapAccount start", {
    timestamp: new Date().toISOString(),
    requestId: context.awsRequestId,
    method: event.httpMethod
  });

  const logger = new Logger()

  // Validate HTTP method
  if (event.httpMethod !== 'POST') {
    console.warn("MonarchMapAccount ❌ wrong method", { method: event.httpMethod });
    logger.addError('Invalid method call. Use POST.')
    return createResponse(405, logger.getLogs(), 'Method not allowed. Use POST.')
  }

  try {
    console.log("MonarchMapAccount parsing request body");
    const { mappings, token } = JSON.parse(event.body)
    console.log("Mappings:", mappings);

    // Validate token
    if (!token) {
      console.error("MonarchMapAccount ❌ missing token")
      logger.addError('Missing API key.')
      return createResponse(400, logger.getLogs(), 'API token is required.')
    }

    // Validate mappings
    if (!mappings || !Array.isArray(mappings)) {
      console.error("MonarchMapAccount ❌ invalid mappings format")
      logger.addError('Invalid account mappings; must be an array.')
      return createResponse(400, logger.getLogs(), 'Mappings are required and should be an array.')
    }

    // Process all mappings concurrently with controlled concurrency
    for (const mapping of mappings) {
      await processMapping(token, mapping, logger)
      console.log("MonarchMapAccount ✅ processed mapping", { ynab: mapping.ynabAccountName })
    }

    console.log("MonarchMapAccount ✅ all mappings completed")
    logger.add(`All account mappings and transactions import completed.`)
    console.groupEnd("MonarchMapAccount Lambda Handler")
    return createResponse(200, logger.getLogs(), 'Account mappings and transactions imported.')
  } catch (error) {
    console.error("MonarchMapAccount ❌ unexpected error", error)
    logger.addError('Error processing account mappings and transactions.')
    return createResponse(500, logger.getLogs(), 'Internal Server Error')
  }
}

async function createManualAccount(token, accountInput, logger) {
  console.group("Creating Manual Account")
  const query = `
        mutation Web_CreateManualAccount($input: CreateManualAccountMutationInput!) {
            createManualAccount(input: $input) {
                account {
                    id
                    __typename
                }
                errors {
                    fieldErrors {
                        field
                        messages
                        __typename
                    }
                    message
                    code
                    __typename
                }
                __typename
            }
        }
    `
  const variables = { input: accountInput }

  const { data, errors } = await performGraphQLRequest(token, query, variables)

  if (errors) {
    logger.addError(`Error creating account: ${JSON.stringify(errors)}`)
    throw new Error(`Error creating account: ${JSON.stringify(errors)}`)
  }

  console.groupEnd("Creating Manual Account")
  return { account: data.createManualAccount.account }
}

async function uploadStatementsFile(token, transactions, logger) {
  console.group("Uploading Statements File")
  logger.add('Uploading statement file...')

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

    if (response.ok) {
      logger.add('Statement file uploaded successfully.')
      return { sessionKey: result.session_key }
    } else {
      logger.addError('Statement file uploaded failed.')
      throw new Error(`Statement file upload failed: ${JSON.stringify(result)}`)
    }
  } catch (error) {
    logger.addError(`Error uploading statement file.`)
    throw new Error(`Error uploading statement file: ${error.message}`)
  } finally {
    console.groupEnd("Uploading Statements File")
  }
}

async function importTransactions(token, accountId, sessionKey, logger) {
  console.group("Importing Transactions")
  logger.add(`Importing transactions into account...`)

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
      sessionKey: sessionKey,
      accountId: accountId,
      skipCheckForDuplicates: false,
      shouldUpdateBalance: true
    }
  }

  const { data, errors } = await performGraphQLRequest(token, query, variables)

  if (data) {
    const uploadSession = data.parseUploadStatementSession.uploadStatementSession
    console.groupEnd("Importing Transactions")
    return { status: uploadSession.status }
  } else {
    console.error('Transactions importing failed:', errors)
    logger.addError('Transactions importing failed.')
    console.groupEnd("Importing Transactions")
    throw new Error(`Transactions importing failed: ${JSON.stringify(errors)}`)
  }
}

function createResponse(statusCode, logs = [], message = null) {
  const responseBody = { logs, message }
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(responseBody)
  }
}

async function performGraphQLRequest(token, query, variables) {
  console.group("Performing GraphQL Request")
  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ query, variables })
    })

    const result = await response.json()
    console.groupEnd("Performing GraphQL Request")
    if (response.ok && !result.errors) {
      return { data: result.data }
    } else {
      const errors = result.errors || (result.data && result.data.errors)
      return { errors }
    }
  } catch (error) {
    console.groupEnd("Performing GraphQL Request")
    return { errors: error.message }
  }
}

async function handleUploadAndImport(token, accountId, transactions, logger) {
  console.group("Handling Upload and Import")
  try {
    // Upload statement file
    const { sessionKey } = await uploadStatementsFile(token, transactions, logger)

    // Wait 1.5 seconds to ensure Monarch finishes uploading statement file
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Import transactions into the account
    await importTransactions(token, accountId, sessionKey, logger)
    console.groupEnd("Handling Upload and Import")
  } catch (error) {
    console.error(`Failed to upload and import transactions: ${error.message}`)
    logger.addError(`Failed to upload and import transactions.`)
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

async function processMapping(token, mapping, logger) {
  console.group("Processing Mapping")
  const { ynabAccountName, monarchAccountName, monarchAccountId, transactions, action } = mapping

  if (action === 'create_new') {
    logger.add(`Creating account '${ynabAccountName}' in Monarch...`)

    const accountInput = {
      type: 'credit',
      subtype: 'credit_card',
      includeInNetWorth: true,
      name: monarchAccountName,
      displayBalance: 0.0
    }

    try {
      // Create new account in Monarch
      const { account } = await createManualAccount(token, accountInput, logger)
      logger.add(`Account '${ynabAccountName}' created successfully.`)

      // Handle statement file upload and importing into account
      await handleUploadAndImport(token, account.id, transactions, logger)
      logger.add(
        `Imported '${transactions.length}' ${transactions.length === 1 ? 'transaction' : 'transactions'
        } into account '${ynabAccountName}'.`
      )
      console.groupEnd("Processing Mapping")
    } catch (error) {
      logger.addError(`Failed to process account '${ynabAccountName}'.`)
      console.groupEnd("Processing Mapping")
      throw new Error(`Failed to process account '${ynabAccountName}': ${error.message}`)
    }
  } else {
    logger.add(`Importing transactions into existing account '${monarchAccountName}'...`)
    try {
      // Handle statement file upload and importing into existing account
      await handleUploadAndImport(token, monarchAccountId, transactions, logger)
      logger.add(`Imported ${transactions.length} transactions into account '${monarchAccountName}'.`)
      console.groupEnd("Processing Mapping")
    } catch (error) {
      logger.addError(`Failed to import transactions into account '${monarchAccountName}'.`)
      console.groupEnd("Processing Mapping")
      throw new Error(`Failed to import transactions into account '${monarchAccountName}': ${error.message}`)
    }
  }
}
