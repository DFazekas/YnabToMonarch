const base = location.hostname === 'localhost'
  ? 'http://localhost:3000/dev/'
  : '/.netlify/functions/';

export const API = {
  login: base + 'monarchLogin',
  fetchAccounts: base + 'fetchMonarchAccounts',
  mapAccounts: base + 'mapAccounts',
  generateStatements: base + 'generateStatements'
};
