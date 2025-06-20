import fetch from 'node-fetch';
import { createResponse } from './response.js';

const GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql';

export async function handler(event) {
  console.groupCollapsed("deleteMonarchAccounts");

  if (event.httpMethod !== 'POST') {
    console.warn("❌ wrong method", { method: event.httpMethod });
    console.groupEnd();
    return createResponse(405, { error: 'Method not allowed. Use POST.' });
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
    const resp = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      },
      body: JSON.stringify({ query: mutation, variables: { id: accountId } })
    });
    const json = await resp.json();
    if (!resp.ok || json.errors || (json.data.deleteAccount.errors || []).length) {
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
