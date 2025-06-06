import { API } from './config.js';
import { postJson } from './utils.js';

export const monarchApi = {
  login: (email, password, deviceUuid, otp) => postJson(API.login, { email, password, deviceUuid, otp }),
  fetchMonarchAccounts: token => postJson(API.fetchAccounts, { token }),
  mapAccounts: (token, mappings) => postJson(API.mapAccounts, { token, mappings }),
  generateAccounts: accounts => fetch(API.generateStatements, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accounts }),
  }),
};
