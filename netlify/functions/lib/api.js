import fetch from 'node-fetch';
import FormData from 'form-data';
import { Readable } from 'stream';
import generateCSV from '../../../shared/generateCsv.js';
import { createResponse } from '../response.js';

// Shared endpoints
export const GRAPHQL_ENDPOINT = 'https://api.monarchmoney.com/graphql';
export const STATEMENTS_UPLOAD_URL = 'https://api.monarchmoney.com/statements/upload-async/';

// Enforce HTTP method
export function requireMethod(event, method) {
  if (event.httpMethod !== method) {
    return createResponse(405, { error: `Method not allowed. Use ${method}.` });
  }
  return null;
}

// Generic GraphQL request
export async function graphqlRequest(token, query, variables) {
  console.group("Performing GraphQL Request");
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Token ${token}`
    },
    body: JSON.stringify({ query, variables })
  });
  const result = await res.json();
  if (!res.ok || result.errors) {
    if (result?.errors?.some(err => err.message.includes("SUBSCRIPTION_ENDED"))) {
      console.error("❌ Subscription has ended. Please renew your subscription or use a different account.");
      console.groupEnd();
      throw new Error("Monarch subscription has ended. Please renew your subscription or use different account.");
    }
    console.groupEnd();
    throw new Error(`GraphQL request failed: ${JSON.stringify(result.errors)}`);
  }
  console.groupEnd();
  return { data: result.data };
}

// CSV upload helper
export async function uploadStatementsFile(token, transactions, accountName) {
  console.group("Uploading Statements File");
  const csv = generateCSV(accountName, transactions);
  const csvStream = Readable.from([csv]);
  const form = new FormData();
  form.append('file', csvStream, { filename: 'transactions.csv', contentType: 'text/csv' });
  const res = await fetch(STATEMENTS_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      ...form.getHeaders()
    },
    body: form
  });
  const result = await res.json();
  if (!res.ok) {
    console.error("❌ Upload failed", { status: res.status, result });
    console.groupEnd();
    throw new Error(`Upload failed: ${JSON.stringify(result)}`);
  }
  console.groupEnd();
  return { sessionKey: result.session_key };
}
