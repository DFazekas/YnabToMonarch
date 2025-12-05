// This file will fetch the public configuration from the serverless function.
let config = null;

async function fetchConfig() {
  if (config) {
    return config;
  }

  try {
    const response = await fetch('/.netlify/functions/config');
    if (!response.ok) {
      throw new Error('Failed to fetch configuration');
    }
    config = await response.json();
    return config;
  } catch (error) {
    console.error('Could not fetch app configuration:', error);
    // Fallback for local development if the serverless function isn't running
    // This assumes you have a way to get these values, e.g. a local .env file
    // that a build tool would normally provide.
    return {
      ynabClientId: 'FALLBACK_CLIENT_ID',
      ynabRedirectUri: 'http://localhost:8888/oauth/ynab/callback'
    };
  }
}

export async function getConfig() {
  return await fetchConfig();
}

const base = location.hostname === 'localhost'
  ? 'http://localhost:3000/dev/'
  : '/.netlify/functions/';

export const API = {
  login: base + 'monarchLogin',
  fetchAccounts: base + 'fetchMonarchAccounts',
  createAccounts: base + 'createMonarchAccounts',
  generateStatements: base + 'generateStatements',
  getUploadStatus: base + 'getUploadStatus',
};
