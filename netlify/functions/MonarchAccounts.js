const fetch = require('node-fetch')

module.exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        }
    }
    try {
        const { token } = JSON.parse(event.body)
        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Token is required.' })
            }
        }

        // Fetch accounts from Monarch Money API
        const response = await fetch('https://api.monarchmoney.com/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${token}`
            },
            body: JSON.stringify({ query: 'query { accounts { id displayName } }' })
        })

        if (!response.ok) {
            const error = await response.json()
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: error.message || 'Account fetch failed.' })
            }
        }

        const accounts = await response.json()

        // Return accounts to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ accounts: accounts.data.accounts })
        }
    } catch (error) {
        console.error('Error fetching accounts:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        }
    }
}
