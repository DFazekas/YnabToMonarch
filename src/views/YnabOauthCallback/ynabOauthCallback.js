import { handleOauthCallback } from '../../api/ynabApi.js';
import { renderPageLayout } from '../../components/pageLayout.js';
import '../../components/ErrorMessage.js';
import '../../components/AutoStyledButton.js';
import { navigate, persistState } from '../../router.js';

export default async function initYnabOauthCallbackView() {
  // Render page layout
  renderPageLayout();

  // Get UI elements
  const loadingSpinner = document.getElementById('loadingSpinner');
  const successIcon = document.getElementById('successIcon');
  const errorIcon = document.getElementById('errorIcon');
  const statusTitle = document.getElementById('statusTitle');
  const statusMessage = document.getElementById('statusMessage');
  const manualRedirectContainer = document.getElementById('manualRedirectContainer');
  const continueBtn = document.getElementById('continueBtn');

  try {
    // Set initial loading state
    statusTitle.textContent = 'Processing...';
    statusMessage.innerHTML = 'We\'re fetching your account data now.</br>You should be redirected automatically.';

    // Handle OAuth callback (token exchange + fetch accounts)
    await handleOauthCallback();

    // Success - hide spinner, show success icon
    loadingSpinner.hidden = true;
    successIcon.hidden = false;
    statusTitle.textContent = 'We got your data!';
    statusMessage.innerHTML = 'Still here? Sorry, sometimes redirections don\'t work.</br>Click the button below to review your data.';
    
    // Persist state before redirect
    persistState();
    
    // Redirect after a short delay to show success state
    setTimeout(() => {
      navigate('/review', true);
    }, 1500);
    
    // Show manual button as backup
    continueBtn.textContent = 'Review your Data';
    continueBtn.addEventListener('click', () => {
      navigate('/review', true);
    });
    setTimeout(() => {
      manualRedirectContainer.hidden = false;
    }, 1500);

  } catch (error) {
    console.error(error);

    // Hide spinner, show error icon
    loadingSpinner.hidden = true;
    errorIcon.hidden = false;
    statusTitle.textContent = 'Connection Failed';
    statusMessage.textContent = 'Try connecting to YNAB again.';

    // Show manual redirect button to try again
    continueBtn.textContent = 'Try Again';
    continueBtn.setAttribute('data-color', 'black');
    continueBtn.updateStyle();
    continueBtn.addEventListener('click', () => {
      navigate('/upload', true);
    });
    manualRedirectContainer.hidden = false;
  }
}
