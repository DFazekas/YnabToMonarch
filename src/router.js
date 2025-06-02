import initUploadView from './views/Upload/upload.js';
import uploadTemplate from './views/Upload/upload.html';

import initAccountReviewView from './views/AccountReview/review.js';
import reviewTemplate from './views/AccountReview/review.html';

import initMethodSelectView from './views/MethodSelect/method.js';
import methodTemplate from './views/MethodSelect/method.html';

import initManualImportView from './views/ManualImport/manual.js';
import manualTemplate from './views/ManualImport/manual.html';

const routes = {
  upload: { template: uploadTemplate, init: initUploadView, scroll: false },
  review: { template: reviewTemplate, init: initAccountReviewView, scroll: true },
  method: { template: methodTemplate, init: initMethodSelectView, scroll: false },
  manual: { template: manualTemplate, init: initManualImportView, scroll: false }
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
