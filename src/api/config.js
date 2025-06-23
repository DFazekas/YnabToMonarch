const base = location.hostname === 'localhost'
  ? 'http://localhost:3000/dev/'
  : '/.netlify/functions/';

export const API = {
  login: base + 'monarchLogin',
  fetchAccounts: base + 'fetchMonarchAccounts',
  createAccounts: base + 'createMonarchAccounts',
  generateStatements: base + 'generateStatements',
  getUploadStatus: base + 'getUploadStatus',
  deleteAccounts: base + 'deleteMonarchAccounts',
  patchAccount: base + 'patchMonarchAccount',
};
