import { createResponse } from './response.js';
import { requireMethod, graphqlRequest } from './lib/api.js';

export async function handler(event) {
  console.group("getUploadStatus");
  const methodError = requireMethod(event, 'POST');
  if (methodError) {
    console.groupEnd("getUploadStatus");
    return methodError;
  }
  try {
    const { token, sessionKey } = JSON.parse(event.body);

    const query = `
      query GetUploadStatementSession($sessionKey: String!) {
        uploadStatementSession(sessionKey: $sessionKey) {
          sessionKey
          status
          errorMessage
          uploadedStatement { id transactionCount }
        }
      }
    `;
    const { data } = await graphqlRequest(token, query, { sessionKey });
    console.groupEnd("getUploadStatus");
    return createResponse(200, data);
  } catch (error) {
    console.error('❌ Error fetching upload status:', error);
    console.groupEnd("getUploadStatus");
    return createResponse(500, { error: error.message });
  }
}
