import { API } from '../config.js';

async function postJson(url, body) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.json()).error || 'API error');
  return res.json();
}

export const monarchApi = {
  login: (email, password, deviceUuid, otp) => postJson(API.login, { email, password, deviceUuid, otp }),
  fetchAccounts: token => postJson(API.fetchAccounts, { token }),
  mapAccounts: (token, mappings) => postJson(API.mapAccounts, { token, mappings }),
  generateAccounts: accounts => fetch(API.generateStatements, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ accounts }),
  }),
};
