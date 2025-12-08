import fetch from 'node-fetch';

const MONARCH_GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql';

export async function handler(event) {
  console.group("getUploadStatus")
  if (event.httpMethod !== 'POST') {
    console.groupEnd("getUploadStatus")
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    // Handle missing or empty body
    if (!event.body) {
      console.error("getUploadStatus ❌ missing request body");
      console.groupEnd("getUploadStatus")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Request body is required.' })
      };
    }

    // Parse body - handle both string and object cases
    const bodyData = typeof event.body === 'string' 
      ? JSON.parse(event.body) 
      : event.body;

    const { token, sessionKey } = bodyData;
    
    if (!token || !sessionKey) {
      console.error("getUploadStatus ❌ missing token or sessionKey");
      console.groupEnd("getUploadStatus")
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Token and sessionKey are required.' })
      };
    }

    const res = await fetch(MONARCH_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({
        operationName: 'GetUploadStatementSession',
        variables: { sessionKey },
        query: `
          query GetUploadStatementSession($sessionKey: String!) {
            uploadStatementSession(sessionKey: $sessionKey) {
              sessionKey
              status
              errorMessage
              uploadedStatement {
                id
                transactionCount
              }
            }
          }
        `
      })
    });

    const result = await res.json();
    console.groupEnd("getUploadStatus")
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('getUploadStatus ❌ unexpected error:', error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      body: event.body,
      bodyType: typeof event.body
    });
    console.groupEnd("getUploadStatus")
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || 'Internal Server Error' }),
    };
  }
}
