const fetch = require('node-fetch')

module.exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed. Use POST.' })
        }
    }
    try {
        const { email, password } = JSON.parse(event.body)
        if (!email || !password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Email and password are required.' })
            }
        }

        // Forward credentials to Monarch Money API
        const response = await fetch('https://api.monarchmoney.com/auth/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: email, password })
        })

        if (!response.ok) {
            const error = await response.json()
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: error.message || 'Login failed.' })
            }
        }

        const data = await response.json()

        if (!data.token) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Token not found in response.' })
            }
        }

        // Return the access token to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({ token: data.token })
        }
    } catch (error) {
        console.error('Error during login:', error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' })
        }
    }
}
