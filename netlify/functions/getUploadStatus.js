import fetch from 'node-fetch';
import { createResponse } from './response.js';

const MONARCH_GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql';

export async function handler(event) {
  console.group("getUploadStatus")
  if (event.httpMethod !== 'POST') {
    console.groupEnd("getUploadStatus")
    return createResponse(405, { error: 'Method Not Allowed' });
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
    return createResponse(200, result);
  } catch (error) {
    console.error('❌ Error fetching upload status:', error);
    console.groupEnd("getUploadStatus")
    return createResponse(500, { error: error.message });
  }
}
