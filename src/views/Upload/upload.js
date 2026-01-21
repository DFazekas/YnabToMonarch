import Accounts from '../../schemas/accounts.js';
import { navigate } from '../../router.js';
import { redirectToYnabOauth } from '../../api/ynabApi.js';
import loadingOverlay from '../../components/LoadingOverlay.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import { isYnabAuthenticated } from '../../api/ynabTokens.js';

export default async function initUploadView() {
  const isYnabTokenValid = await hasYnabAccess();

  renderLayout();

  setupYnabContinueButton(isYnabTokenValid);
  setupYnabConnectButton(isYnabTokenValid);
}

/** Check if YNAB access token is valid
 * @return {Promise<boolean>} Whether the YNAB token is valid
 */
async function hasYnabAccess() {
  try {
    return await isYnabAuthenticated();
  } catch (error) {
    console.warn('Error checking YNAB authentication:', error);
    return false;
  }
}

/** Render the page layout
 * @return {void}
 */
function renderLayout() {
  renderPageLayout({
    navbar: {
      showBackButton: true,
      showDataButton: true
    },
    header: {
      title: 'Step 1: Import YNAB Data',
      description: 'Start by bringing over your YNAB data. Next, you\'ll review the data, filter and edit as needed.',
      containerId: 'pageHeader'
    }
  });
}

/** Setup YNAB continue button
 * @param {boolean} isYnabTokenValid - Whether the YNAB token is valid
 */
function setupYnabContinueButton(isYnabTokenValid) {
  const continueWithYnabBtn = document.getElementById('continueWithYnabBtn');
  const oauthError = document.getElementById('oauthError');

  continueWithYnabBtn.hidden = !isYnabTokenValid;

  document.getElementById('automaticUploadDivider').hidden = !isYnabTokenValid

  continueWithYnabBtn?.addEventListener('click', async (event) => {
    event.preventDefault();

    // Hide any previous errors
    oauthError.hide();

    // Show loading overlay and fetch accounts + transactions
    loadingOverlay.show('Fetching accounts...');
    try {
      const accounts = await uploadController.fetchYnabAccountsAndTransactions();
      if (!accounts || Object.keys(accounts).length === 0) {
        loadingOverlay.hide();
        oauthError.show(
          'No accounts found in your YNAB profile.',
          'Make sure you have at least one account in your YNAB budget, then try again.'
        );
        return;
      }

      Accounts.init(accounts);
      navigate('/review', false, true);
    } catch (error) {
      console.error('Error fetching YNAB accounts:', error);
      loadingOverlay.hide();
      oauthError.show(
        'Could not fetch accounts from YNAB.',
        'Your session may have expired. Try connecting to YNAB again below.'
      );
    }
  });
}

/** Setup YNAB connect button
 * @param {boolean} isYnabTokenValid - Whether the YNAB token is valid
 */
function setupYnabConnectButton(isYnabTokenValid) {
  const connectYnabBtn = document.getElementById('connectYnabBtn');
  const oauthError = document.getElementById('oauthError');

  connectYnabBtn.textContent = isYnabTokenValid ? 'Connect new YNAB Profile' : 'Connect to YNAB';
  connectYnabBtn.setAttribute('data-color', isYnabTokenValid ? 'white' : 'purple');
  connectYnabBtn.applyStyles();

  connectYnabBtn?.addEventListener('click', async (event) => {
    event.preventDefault();

    // Hide any previous errors when user takes action
    oauthError.hide();

    try {
      await redirectToYnabOauth();
    } catch (error) {
      console.error('Error initiating YNAB OAuth:', error);
      oauthError.show(
        'Could not connect to YNAB.',
        'Please check your internet connection and try again.'
      );
    }
  });
}
