import { createResponse } from './response.js';
import { requireMethod, graphqlRequest } from './lib/api.js';

export async function handler(event) {
  console.groupCollapsed("deleteMonarchAccounts");

  const methodError = requireMethod(event, 'POST');
  if (methodError) {
    console.warn("❌ wrong method", { method: event.httpMethod });
    console.groupEnd();
    return methodError;
  }

  try {
    const { token, accountId } = JSON.parse(event.body);
    if (!token || !accountId) {
      console.error("❌ Missing token or accountId");
      console.groupEnd();
      return createResponse(400, { error: 'token and accountId are required.' });
    }

    // Delete single account via GraphQL
    const mutation = `
      mutation Common_DeleteAccount($id: UUID!) {
        deleteAccount(id: $id) {
          deleted
          errors { message }
        }
      }
    `;
    const { data, errors } = await graphqlRequest(token, mutation, { id: accountId });
    const json = { data: { deleteAccount: data.deleteAccount }, errors };
    if (!json.data.deleteAccount || (json.data.deleteAccount.errors || []).length) {
      const errMsgs = json.errors
        ? JSON.stringify(json.errors)
        : json.data.deleteAccount.errors.map(e => e.message).join('; ');
      console.error(`Failed to delete ${accountId}: ${errMsgs}`);
      console.groupEnd();
      return createResponse(500, { error: errMsgs });
    }
    console.groupEnd();
    return createResponse(200, { success: json.data.deleteAccount.deleted, id: accountId });
  } catch (err) {
    console.error('❌ unexpected error', err);
    console.groupEnd();
    return createResponse(500, { error: err.message });
  }
}
