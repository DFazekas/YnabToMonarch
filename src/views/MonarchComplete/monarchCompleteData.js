import { monarchApi } from '../../api/monarchApi.js';

export function ensurePendingStatusForAccounts(state) {
  state.accounts.accounts.forEach(account => {
    if (!account.status) {
      account.status = 'pending';
    }
  });
}

export function getIncludedAccountsToProcess(state) {
  return state.accounts.accounts
    .filter(account => account.included && account.status !== 'completed')
    .map(account => ({
      id: account.id,
      name: account.current.name,
      modifiedName: account.current.name,
      type: account.current.type,
      subtype: account.current.subtype,
      transactions: account.transactions,
      balance: account.balance,
      included: account.included,
      status: account.status
    }));
}

export function splitIntoBatches(allAccounts, batchSize = 5) {
  const batches = [];
  for (let i = 0; i < allAccounts.length; i += batchSize) {
    batches.push(allAccounts.slice(i, i + batchSize));
  }
  return batches;
}

export async function createAccountsBatch(token, batch) {
  return await monarchApi.createAccounts(token, batch);
}

export async function monitorUploadStatus(token, accountName, sessionKeys) {
  await Promise.all(sessionKeys.map(async (sessionKey) => {
    let attempts = 0;
    const maxAttempts = 60;

    while (attempts < maxAttempts) {
      try {
        const statusResponse = await monarchApi.queryUploadStatus(token, sessionKey);

        if (statusResponse.data?.uploadStatementSession) {
          const session = statusResponse.data.uploadStatementSession;
          const status = session.status;

          if (status === 'completed') {
            return;
          } else if (status === 'failed' || status === 'error') {
            const errorMessage = session.errorMessage || 'Transaction upload failed';
            throw new Error(errorMessage);
          }
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
        attempts++;

      } catch (error) {
        attempts++;
        if (attempts >= maxAttempts) throw error;
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }

    throw new Error(`Upload status check timed out for account ${accountName}`);
  }));
}

export function markBatchProcessing(state, batch) {
  batch.forEach(batchAccount => {
    const account = state.accounts.accounts.find(acc => acc.current.name === batchAccount.modifiedName);
    if (account) account.status = 'processing';
  });
}

export function markBatchFailedDueToApi(state, batch, errorMessage) {
  batch.forEach(batchAccount => {
    const account = state.accounts.accounts.find(acc => acc.current.name === batchAccount.modifiedName);
    if (account) {
      account.status = 'failed';
      account.errorMessage = errorMessage;
    }
  });
}

export function markUnprocessedAsFailed(state, batch) {
  batch.forEach(batchAccount => {
    const account = state.accounts.accounts.find(acc => acc.current.name === batchAccount.modifiedName);
    if (account && account.status === 'processing') {
      account.status = 'failed';
      account.errorMessage = 'Account not processed by server';
    }
  });
}

export function handleCreateResponse(state, batch, response) {
  if (response.failed && response.failed.length > 0) {
    response.failed.forEach((result) => {
      const matchingBatchAccount = batch.find(acc => acc.modifiedName === result.name);
      if (matchingBatchAccount) {
        const account = state.accounts.accounts.find(acc => acc.current.name === matchingBatchAccount.modifiedName);
        if (account) {
          account.status = 'failed';
          account.errorMessage = result.error || 'Account creation failed';
        }
      }
    });
  }

  if (response.success && response.success.length > 0) {
    response.success.forEach((result) => {
      const matchingBatchAccount = batch.find(acc => acc.modifiedName === result.name);
      if (matchingBatchAccount) {
        const account = state.accounts.accounts.find(acc => acc.current.name === matchingBatchAccount.modifiedName);
        if (account) {
          account.status = 'uploading';
          account.sessionKeys = result.sessionKeys || [];
        }
      }
    });
  }
}
