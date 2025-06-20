import { createResponse } from './response.js';
import { requireMethod, graphqlRequest } from './lib/api.js';

export async function handler(event) {
  console.group("fetchMonarchAccounts");
  const methodError = requireMethod(event, 'POST');
  if (methodError) {
    console.warn("❌ Wrong method", { method: event.httpMethod });
    console.groupEnd();
    return methodError;
  }

  try {
    const { token } = JSON.parse(event.body)
    if (!token) {
      console.error("❌ Missing token");
      console.groupEnd();
      return createResponse(400, { error: 'Token is required.' })
    }

    const { data } = await graphqlRequest(token, 'query { accounts { id displayName } }');

    console.groupEnd();
    return createResponse(200, { accounts: data.accounts });
  } catch (error) {
    console.error("❌ Failed fetching Monarch accounts", error)
    console.groupEnd()
    return createResponse(500, { error: error.message || 'Internal Server Error' })
  }
}
