const csv = require('csv-parser')
const { Readable } = require('stream')

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        }
    }

    try {
        // Parse the file from multipart/form-data
        const contentType = event.headers['content-type'] || event.headers['Content-Type']
        if (!contentType || !contentType.includes('multipart/form-data')) {
            throw new Error('Invalid content-type. Expected multipart/form-data.')
        }

        // Extract raw body (file content)
        const body = Buffer.from(event.body, 'base64')
        const boundary = contentType.split('boundary=')[1]
        const parts = body.toString().split(`--${boundary}`)

        // Find the file part in multipart data
        const filePart = parts.find((part) => part.includes('Content-Disposition: form-data; name="file"'))
        if (!filePart) {
            throw new Error('No file provided in the request.')
        }

        // Extract file content
        const fileContentStart = filePart.indexOf('\r\n\r\n') + 4
        const fileContent = filePart.slice(fileContentStart, -2)

        // Parse CSV and collect unique accounts
        const accountsSet = new Set()
        const inputStream = Readable.from(fileContent)

        await new Promise((resolve, reject) => {
            inputStream
                .pipe(
                    csv({
                        mapHeaders: ({ header }) => header.replace(/['"]+/g, '').trim() // Strip extra quotes from headers
                    })
                )
                .on('data', (row) => {
                    if (row.Account) {
                        accountsSet.add(row.Account.trim())
                    }
                })
                .on('end', resolve)
                .on('error', reject)
        })

        // Convert the set of accounts to a sorted array
        const sortedAccounts = Array.from(accountsSet).sort()

        // Return the sorted list of accounts
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ accounts: sortedAccounts })
        }
    } catch (error) {
        console.error('Error processing file:', error.message)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        }
    }
}
