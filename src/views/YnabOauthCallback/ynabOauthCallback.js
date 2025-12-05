import { handleOauthCallback } from '../../api/ynabApi.js';

export default async function initYnabOauthCallbackView() {
  const heroMessage = document.querySelector('[data-ynab-oauth-message]');
  if (heroMessage) {
    heroMessage.textContent = 'Processing YNAB authorization...';
  }
  
  // The handleOauthCallback function will take care of the token exchange,
  // fetching budgets, and navigating to the next page.
  await handleOauthCallback();
}
