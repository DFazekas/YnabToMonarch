import { createResponse } from './response.js';
import { requireMethod, graphqlRequest } from './lib/api.js';

export async function handler(event) {
  console.groupCollapsed("patchMonarchAccount");

  const methodError = requireMethod(event, 'POST');
  if (methodError) {
    console.warn("❌ wrong method", { method: event.httpMethod });
    console.groupEnd();
    return methodError;
  }

  try {
    const { token, account } = JSON.parse(event.body);
    console.log("Token:", token, "Account ID:", account.id);
    if (!token || !account.id) {
      console.error("❌ Missing token or accountId");
      console.groupEnd();
      return createResponse(400, { error: 'token and accountId are required.' });
    }

    // Patch account via GraphQL
    const mutation = `
      mutation Common_UpdateAccount($input: UpdateAccountMutationInput!) {
        updateAccount(input: $input) {
          account {
            id
            displayName
            __typename
          }
          errors { message }
        }
      }
    `;
    const variables = {
      input: {
        id: account.id,
        name: account.modifiedName,
        type: account.type.name,
        subtype: account.subtype.name,
      }
    }
    const { data, errors } = await graphqlRequest(token, mutation, variables);
    const json = { data: { updateAccount: data.updateAccount }, errors };
    if (!json.data.updateAccount || (json.data.updateAccount.errors || []).length) {
      const errMsgs = json.errors
        ? JSON.stringify(json.errors)
        : json.data.updateAccount.errors.map(e => e.message).join('; ');
      console.error(`Failed to patch ${account.id}: ${errMsgs}`);
      console.groupEnd();
      return createResponse(500, { error: errMsgs });
    }
    console.groupEnd();
    return createResponse(200, { success: json.data.updateAccount.account, id: account.id });
  } catch (err) {
    console.error('❌ unexpected error', err);
    console.groupEnd();
    return createResponse(500, { error: err.message });
  }
}
