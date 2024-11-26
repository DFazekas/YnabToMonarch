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
        this.logs.push(message)
    }

    merge(otherLogs) {
        this.logs.push(...otherLogs)
    }

    getLogs() {
        return this.logs
    }
}

module.exports.handler = async (event) => {
    const logger = new Logger()

    // Validate HTTP method
    if (event.httpMethod !== 'POST') {
        logger.add('Invalid method call. Use POST.')
        return createResponse(405, logger.getLogs(), 'Method not allowed. Use POST.')
    }

    try {
        const { mappings, token } = JSON.parse(event.body)

        // Validate token
        if (!token) {
            logger.add('Missing API key.')
            return createResponse(400, logger.getLogs(), 'API token is required.')
        }

        // Validate mappings
        if (!mappings || !Array.isArray(mappings)) {
            logger.add('Invalid account mappings; must be an array.')
            return createResponse(400, logger.getLogs(), 'Mappings are required and should be an array.')
        }

        // Process all mappings concurrently with controlled concurrency
        for (const mapping of mappings) {
            await processMapping(token, mapping, logger)
        }

        logger.add(`All account mappings and transactions import completed.`)
        return createResponse(200, logger.getLogs(), 'Account mappings and transactions imported.')
    } catch (error) {
        console.error('Error processing account mappings and transactions:', error)
        logger.add('Error processing account mappings and transactions.')
        return createResponse(500, logger.getLogs(), 'Internal Server Error')
    }
}

async function createManualAccount(token, accountInput, logger) {
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

    if (data) {
        logger.add('Account created successfully.')
        return { account: data.createManualAccount.account }
    } else {
        logger.add(`Error creating account: ${JSON.stringify(errors)}`)
        throw new Error(`Error creating account: ${JSON.stringify(errors)}`)
    }
}

async function uploadStatementsFile(token, transactions, logger) {
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
            logger.add('Statement file uploaded failed.')
            throw new Error(`Statement file upload failed: ${JSON.stringify(result)}`)
        }
    } catch (error) {
        logger.add(`Error uploading statement file.`)
        throw new Error(`Error uploading statement file: ${error.message}`)
    }
}

async function importTransactions(token, accountId, sessionKey, logger) {
    logger.add(`Importing transactions into account '${accountId}'...`)

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
        logger.add(`Transactions imported successfully into account '${accountId}' with status '${uploadSession.status}'.`)
        return { status: uploadSession.status }
    } else {
        console.error('Transactions importing failed:', errors)
        logger.add('Transactions importing failed.')
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

        if (response.ok && !result.errors) {
            return { data: result.data }
        } else {
            const errors = result.errors || (result.data && result.data.errors)
            return { errors }
        }
    } catch (error) {
        return { errors: error.message }
    }
}

async function handleUploadAndImport(token, accountId, transactions, logger) {
    try {
        // Upload statement file
        const { sessionKey } = await uploadStatementsFile(token, transactions, logger)

        // Wait 1.5 seconds to ensure Monarch finishes uploading statement file
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Import transactions into the account
        await importTransactions(token, accountId, sessionKey, logger)
    } catch (error) {
        console.error(`Failed to upload and import transactions: ${error.message}`)
        logger.add(`Failed to upload and import transactions.`)
        throw error
    }
}

function generateCSV(transactions) {
    const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`
    const rows = transactions.map(
        (tx) =>
            `"${tx.Date}","${tx.Merchant}","${tx.Category}","${tx.Account}","${tx['Original Statement']}","${tx.Notes}","${tx.Amount}","${tx.Tags}"`
    )
    return [headers, ...rows].join('\n')
}

async function processMapping(token, mapping, logger) {
    const { ynabAccountName, monarchAccountName, monarchAccountId, transactions } = mapping

    if (monarchAccountName === 'Create new account') {
        logger.add(`Creating account '${ynabAccountName}' in Monarch...`)

        const accountInput = {
            type: 'credit',
            subtype: 'credit_card',
            includeInNetWorth: true,
            name: ynabAccountName,
            displayBalance: 0.0
        }

        try {
            // Create new account in Monarch
            const { account } = await createManualAccount(token, accountInput, logger)
            logger.add(`Account '${ynabAccountName}' created successfully.`)

            // Handle statement file upload and importing into account
            await handleUploadAndImport(token, account.id, transactions, logger)
            logger.add(`Imported '${transactions.length}' transactions into account '${ynabAccountName}'.`)
        } catch (error) {
            logger.add(`Failed to process account '${ynabAccountName}'.`)
            throw new Error(`Failed to process account '${ynabAccountName}': ${error.message}`)
        }
    } else {
        logger.add(`Importing transactions into existing account '${monarchAccountName}'...`)
        try {
            // Handle statement file upload and importing into existing account
            await handleUploadAndImport(token, monarchAccountId, transactions, logger)
            logger.add(`Imported ${transactions.length} transactions into account '${monarchAccountName}'.`)
        } catch (error) {
            logger.add(`Failed to import transactions into account '${monarchAccountName}'.`)
            throw new Error(`Failed to import transactions into account '${monarchAccountName}': ${error.message}`)
        }
    }
}
