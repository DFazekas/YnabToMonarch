const fetch = require('node-fetch')
const FormData = require('form-data')
const fs = require('fs')

module.exports.handler = async (event) => {
    const logs = []

    if (event.httpMethod !== 'POST') {
        logs.push('Invalid method call. Use POST.')
        return {
            statusCode: 405,
            body: JSON.stringify({ logs, error: 'Method not allowed. Use POST.' })
        }
    }
    try {
        const { mappings, token } = JSON.parse(event.body)

        if (!token) {
            logs.push('Missing API key.')
            return {
                statusCode: 400,
                body: JSON.stringify({ logs, error: 'API token is required.' })
            }
        }

        if (!mappings || !Array.isArray(mappings)) {
            logs.push('Invalid account mappings; must be an array.')
            return {
                statusCode: 400,
                body: JSON.stringify({ logs, error: 'Mappings are required and should be an array.' })
            }
        }

        for (const mapping of mappings) {
            const { ynabAccountName, monarchAccountName, monarchAccountId, transactions } = mapping

            if (monarchAccountName === 'Create new account') {
                logs.push(`Creating account '${ynabAccountName}' in Monarch...`)

                // A new Monarch account should be created
                try {
                    // Create a new account in Monarch
                    const accountInput = {
                        type: 'credit',
                        subtype: 'credit_card',
                        includeInNetWorth: true,
                        name: ynabAccountName,
                        displayBalance: 0.0
                    }
                    const {
                        logs: createAccountLogs,
                        account: newAccount,
                        errors: createAccountErrors
                    } = await createManualAccount(token, accountInput)
                    logs.push(...createAccountLogs)

                    if (createAccountErrors) {
                        throw new Error(createAccountErrors)
                    }
                    if (!newAccount) {
                        logs.push('No account returned after account creation.')
                        throw new Error('No account returned after account creation.')
                    }

                    // Upload statement file
                    const {
                        logs: uploadStatementsFileLogs,
                        sessionKey,
                        errors: uploadStatementsFileErrors
                    } = await uploadStatementsFile(token, transactions)
                    logs.push(...uploadStatementsFileLogs)

                    if (uploadStatementsFileErrors) {
                        throw new Error(uploadStatementsFileErrors)
                    }
                    if (!sessionKey) {
                        logs.push('No session key returned from statement uploading.')
                        return new Error('No session key returned from statement uploading.')
                    }

                    // Wait 1.5 seconds before calling importTransactions
                    await new Promise((resolve) => setTimeout(resolve, 1500))

                    const {
                        logs: getUploadStatementSessionLogs,
                        statementSession,
                        errors: getUploadStatementSessionErrors
                    } = await getUploadStatementSession(token, sessionKey)
                    logs.push(...getUploadStatementSessionLogs)

                    if (getUploadStatementSessionErrors) {
                        throw new Error(getUploadStatementSessionErrors)
                    }
                    if (!statementSession) {
                        logs.push('No statement session returned from uploading statement session.')
                        throw new Error('No statement session returned from uploading statement session.')
                    }

                    // Import transactions into the newly created account
                    const {
                        logs: importTransactionsLogs,
                        status,
                        errors: importTransactionsErrors
                    } = await importTransactions(token, newAccount.id, sessionKey)
                    logs.push(...importTransactionsLogs)

                    if (importTransactionsErrors) {
                        throw new Error(importTransactionsErrors)
                    }
                    if (!status) {
                        logs.push('No status returned from transaction importing.')
                        throw new Error('No status returned from transaction importing.')
                    }
                } catch (error) {
                    console.error(`Error processing mappings for YNAB account '${ynabAccountName}'.`)
                    logs.push(`Failed to process YNAB account '${ynabAccountName}': ${error.message}.`)
                    throw new Error(`Error processing mappings for YNAB account '${ynabAccountName}'.`)
                }
            } else {
                // Import transactions into existing Monarch account
                await importTransactions(token, monarchAccountId, transactions)
                logs.push(`Imported ${transactions.length} transactions into existing account '${monarchAccountName}'.`)
            }
        }

        logs.push(`All account mappings and transactions import completed.`)

        const body = JSON.stringify({ logs, message: 'Account mappings and transactions imported.' })
        return {
            statusCode: 200,
            body: body
        }
    } catch (error) {
        console.error('Error processing account mappings and transactions.')
        return {
            statusCode: 500,
            body: JSON.stringify({ logs, errors: 'Internal Server Error' })
        }
    }
}

async function createManualAccount(token, accountInput) {
    const logs = []

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

    const response = await fetch('https://api.monarchmoney.com/graphql', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${token}`
        },
        body: JSON.stringify({ query, variables })
    })

    const result = await response.json()

    if (response.ok && !result.errors) {
        return { logs, account: result.data.createManualAccount.account }
    } else {
        return { logs, account: null, errors: result.errors }
    }
}

async function getUploadStatementSession(token, sessionKey) {
    try {
        const logs = []

        const query = `
            query GetUploadStatementSession($sessionKey: String!) { 
                uploadStatementSession(sessionKey: $sessionKey) { 
                    ...UploadStatementSessionFields 
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
        logs.push('Uploading statement file...')
        const variables = { sessionKey: sessionKey }
        const body = JSON.stringify({ query, variables })
        const response = await fetch('https://api.monarchmoney.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body
        })

        const result = await response.json()

        if (response.ok && !result.errors) {
            logs.push('Statement uploaded successfully.')
            return { logs, statementSession: result.data.uploadStatementSession }
        } else {
            console.error('Uploading statement file failed.')
            logs.push('Uploading statement file failed.')
            return { logs, statementSession: null, errors: 'Uploading statement file failed.' }
        }
    } catch (error) {
        console.error('Uploading statement file failed.')
        logs.push('Uploading statement file failed.')
        return { logs, statementSession: null, errors: 'Uploading statement file failed.' }
    }
}

async function uploadStatementsFile(token, transactions) {
    const logs = ['Uploading statement file...']

    // Prepare CSV data for the file
    const headers = `"Date","Merchant","Category","Account","Original Statement","Notes","Amount","Tags"`
    const csvContent = [
        headers,
        ...transactions.map(
            (tx) =>
                `"${tx.Date}","${tx.Merchant}","${tx.Category}","${tx.Account}","${tx['Original Statement']}","${tx.Notes}","${tx.Amount}","${tx.Tags}"`
        )
    ].join('\n')

    // const filePath = '/tmp/temp_transactions.csv'
    const filePath = './temp_transactions.csv'

    // Save CSV file locally
    fs.writeFileSync(filePath, csvContent)

    try {
        const form = new FormData()
        form.append('file', fs.createReadStream(filePath))

        const response = await fetch('https://api.monarchmoney.com/statements/upload-async/', {
            method: 'POST',
            headers: {
                Authorization: `Token ${token}`,
                ...form.getHeaders()
            },
            body: form
        })

        const result = await response.json()

        if (response.ok) {
            logs.push('Statement file uploaded successfully.')
            return { logs, sessionKey: result.session_key }
        } else {
            logs.push('Statement file uploaded failed.')
            return { logs, sessionKey: null, errors: 'Statement file uploaded failed.' }
        }
    } finally {
        // Clean up temporary file
        fs.unlinkSync(filePath)
    }
}

async function importTransactions(token, accountId, sessionKey) {
    try {
        const logs = []

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

        logs.push(`Import transactions into account...`)
        const response = await fetch('https://api.monarchmoney.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({ query, variables })
        })

        const result = await response.json()

        if (response.ok && !result.errors) {
            logs.push('Transactions imported successfully.')
            const importResult = result.data.parseUploadStatementSession
            return { logs, status: importResult.uploadStatementSession.status }
        } else {
            console.error('Transactions importing failed.')
            logs.push('Transactions importing failed.')
            return { logs, status: null, errors: 'Transactions importing failed.' }
        }
    } catch (error) {
        console.error(error)
        logs.push('Transactions importing failed.')
        return { logs, status: null, errors: 'Transactions importing failed.' }
    }
}
