import { requireMethod, graphqlRequest, uploadStatementsFile } from './lib/api.js';
import { createResponse } from './response.js';

// ...shared helpers from lib/api.js...

export async function handler(event, context) {
  console.group("CreateMonarchAccounts Lambda Handler");

  const methodError = requireMethod(event, 'POST');
  if (methodError) {
    console.warn("❌ wrong method", { method: event.httpMethod });
    console.groupEnd();
    return methodError;
  }

  try {
    const { accounts, token } = JSON.parse(event.body)
    const results = await Promise.allSettled(accounts.map(account =>
      processAccount(token, account).then((result) => ({
        name: account.modifiedName,
        success: true,
        sessionKeys: result.sessionKeys || []
      })).catch(err => ({
        name: account.modifiedName,
        success: false,
        error: err.message
      }))
    ));

    const success = [];
    const failed = [];

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value.success) {
        success.push({ name: result.value.name, sessionKeys: result.value.sessionKeys });
      } else {
        const failedResult = result.status === 'fulfilled' ? result.value : result.reason;
        failed.push({ name: failedResult.name, error: failedResult.error || 'Unknown error' });
      }
    }

    return createResponse(200, { success, failed });
  } catch (err) {
    console.error("❌ unexpected error", err)
    return createResponse(500, { error: err.message });
  } finally {
    console.groupEnd("CreateMonarchAccounts Lambda Handler");
  }
}

async function processAccount(token, account) {
  console.group("Process account")

  if (!account.included) {
    console.warn(`Skipping excluded account: ${account.modifiedName}`);
    return { skipped: true };
  }

  const accountInput = {
    type: account.type,
    subtype: account.subtype,
    includeInNetWorth: true,
    name: account.modifiedName,
    displayBalance: 0.0
  }

  // Create new account in Monarch
  const { account: newAccount, error } = await createManualAccount(token, accountInput);
  if (error) return { error }

  const txChunks = chunkArray(account.transactions, 3000);
  if (txChunks.length > 1) {
    console.warn(`Account ${account.modifiedName} has ${txChunks.length} chunks of transactions, which may take longer to process.`);
  }

  const sessionKeys = [];

  await Promise.all(txChunks.map(async (chunk) => {
    const { sessionKey } = await uploadStatementsFile(token, chunk, account.modifiedName);
    await importTransactions(token, newAccount.id, sessionKey);
    sessionKeys.push(sessionKey);
  }));

  console.groupEnd()
  return { sessionKeys };
}

function chunkArray(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

async function createManualAccount(token, input) {
  console.group("Creating Manual Account");

  const query = `
    mutation Web_CreateManualAccount($input: CreateManualAccountMutationInput!) {
      createManualAccount(input: $input) {
        account { id __typename }
        errors {
          fieldErrors { field messages __typename }
          message code __typename
        }
        __typename
      }
    }
  `;

  const { data } = await graphqlRequest(token, query, { input });
  if (data.createManualAccount.errors?.length) {
    console.groupEnd();
    return { error: data.createManualAccount.errors.map(e => e.message).join('; ') };
  }

  console.groupEnd();
  return { account: data.createManualAccount.account };
}

async function importTransactions(token, accountId, sessionKey) {
  console.group("Importing Transactions");
  const query = `
      mutation Web_ParseUploadStatementSession($input: ParseStatementInput!) {
          parseUploadStatementSession(input: $input) {
              uploadStatementSession {
                  ...UploadStatementSessionFields
                  __typename
              }
              __typename
          }
      }
      fragment UploadStatementSessionFields on UploadStatementSession {
          sessionKey
          status
          errorMessage
          skipCheckForDuplicates
          uploadedStatement {
              id
              transactionCount
              __typename
          }
          __typename
      }
  `;
  const variables = {
    input: {
      parserName: 'monarch_csv',
      sessionKey,
      accountId,
      skipCheckForDuplicates: false,
      shouldUpdateBalance: true
    }
  };
  await graphqlRequest(token, query, variables);
  console.groupEnd();
}
