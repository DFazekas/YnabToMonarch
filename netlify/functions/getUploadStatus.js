import fetch from 'node-fetch';

const MONARCH_GRAPHQL_ENDPOINT = 'https://api.monarch.com/graphql';

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
    const { token, sessionKey } = JSON.parse(event.body);

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
    console.error('❌ Error fetching upload status:', error);
    console.groupEnd("getUploadStatus")
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
