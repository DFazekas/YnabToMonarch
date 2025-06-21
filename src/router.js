import initUploadView from './views/Upload/upload.js';
import uploadTemplate from './views/Upload/upload.html';

import initAccountReviewView from './views/AccountReview/review.js';
import reviewTemplate from './views/AccountReview/review.html';

import initMethodSelectView from './views/MethodSelect/method.js';
import methodTemplate from './views/MethodSelect/method.html';

import initManualInstructionsView from './views/ManualInstructions/manualInstructions.js';
import manualInstructionsTemplate from './views/ManualInstructions/manualInstructions.html';

import initMonarchCredentialsView from './views/MonarchCredentials/monarchCredentials.js';
import monarchCredentialsTemplate from './views/MonarchCredentials/monarchCredentials.html';

import initMonarchOtpView from './views/MonarchOtp/monarchOtp.js';
import monarchOtpTemplate from './views/MonarchOtp/monarchOtp.html';

import initMonarchCompleteView from './views/MonarchComplete/monarchComplete.js';
import monarchCompleteTemplate from './views/MonarchComplete/monarchComplete.html';

import initManageAccountsView from './views/ManageMonarchAccounts/manageMonarchAccounts.js';
import bulkManageAccountsTemplate from './views/ManageMonarchAccounts/manageMonarchAccounts.html';

const routes = {
  uploadView: { template: uploadTemplate, init: initUploadView, scroll: false },
  reviewView: { template: reviewTemplate, init: initAccountReviewView, scroll: true },
  methodView: { template: methodTemplate, init: initMethodSelectView, scroll: false },
  manualInstructionsView: { template: manualInstructionsTemplate, init: initManualInstructionsView, scroll: true },
  monarchCredentialsView: { template: monarchCredentialsTemplate, init: initMonarchCredentialsView, scroll: false },
  monarchOtpView: { template: monarchOtpTemplate, init: initMonarchOtpView, scroll: false },
  monarchCompleteView: { template: monarchCompleteTemplate, init: initMonarchCompleteView, scroll: false },
  bulkDeleteView: { template: bulkManageAccountsTemplate, init: initManageAccountsView, scroll: true },
};

export async function navigate(view) {
  const app = document.getElementById('app');
  app.innerHTML = '';

  const route = routes[view];
  if (!route) {
    app.innerHTML = '<p>404 - View not found</p>';
    return;
  }

  // Dynamically control page overflow
  if (route.scroll) {
    document.body.classList.add('always-scroll');
  } else {
    document.body.classList.remove('always-scroll');
  }

  // Inject HTML template
  document.getElementById('app').innerHTML = route.template;

  // Initialize view logic
  route.init();
}
