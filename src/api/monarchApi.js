import { API } from './config.js';
import { postJson } from './utils.js';

export const monarchApi = {
  login: (email, encryptedPassword, deviceUuid, otp) => postJson(API.login, { email, encryptedPassword, deviceUuid, otp }),
  fetchAccounts: token => postJson(API.fetchAccounts, { token }),
  createAccounts: (token, accounts) => postJson(API.createAccounts, { token, accounts }),
  generateAccounts: accounts => fetch(API.generateStatements, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accounts }),
  }),
  queryUploadStatus: (token, sessionKey) => postJson(API.getUploadStatus, { token, sessionKey }),
  deleteAccount: (token, accountId) => postJson(API.deleteAccounts, { token, accountId }),
};
