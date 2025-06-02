import initUploadView from './views/Upload/upload.js';
import uploadTemplate from './views/Upload/upload.html';

import initAccountReviewView from './views/AccountReview/review.js';
import reviewTemplate from './views/AccountReview/review.html';

import initMethodSelectView from './views/MethodSelect/method.js';
import methodTemplate from './views/MethodSelect/method.html';

import initManualImportView from './views/ManualImport/manual.js';
import manualTemplate from './views/ManualImport/manual.html';



// Define your route registry
const routes = {
 upload: { template: uploadTemplate, init: initUploadView },
  review: { template: reviewTemplate, init: initAccountReviewView },
  method: { template: methodTemplate, init: initMethodSelectView },
  manual: { template: manualTemplate, init: initManualImportView }
};

// Central router object
const router = {
  navigate(viewName) {
    const route = routes[viewName];
    if (!route) {
      console.error(`Unknown view: ${viewName}`);
      return;
    }

    // Inject HTML template
    document.getElementById('app').innerHTML = route.template;

    // Initialize view logic
    route.init();
  }
};

export default router;
