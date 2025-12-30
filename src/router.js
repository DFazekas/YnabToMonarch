import initHomeView from './views/Home/home.js';
import homeTemplate from './views/Home/home.html';

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

import initYnabOauthCallbackView from './views/YnabOauthCallback/ynabOauthCallback.js';
import ynabOauthCallbackTemplate from './views/YnabOauthCallback/ynabOauthCallback.html';

import initDataManagementView from './views/DataManagement/dataManagement.js';
import dataManagementTemplate from './views/DataManagement/dataManagement.html';

import state from './state.js';

import loadingOverlay from './components/LoadingOverlay.js';

import './components/index.js';

const routes = {
  '/': {
    template: homeTemplate,
    init: initHomeView,
    scroll: false,
    title: 'Home - YNAB to Monarch',
    requiresAuth: false
  },
  '/upload': {
    template: uploadTemplate,
    init: initUploadView,
    scroll: false,
    title: 'Upload - YNAB to Monarch',
    requiresAuth: false
  },
  '/review': {
    template: reviewTemplate,
    init: initAccountReviewView,
    scroll: true,
    title: 'Review Accounts - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/method': {
    template: methodTemplate,
    init: initMethodSelectView,
    scroll: false,
    title: 'Select Method - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/manual': {
    template: manualInstructionsTemplate,
    init: initManualInstructionsView,
    scroll: true,
    title: 'Manual Import - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/login': {
    template: monarchCredentialsTemplate,
    init: initMonarchCredentialsView,
    scroll: false,
    title: 'Login to Monarch - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/otp': {
    template: monarchOtpTemplate,
    init: initMonarchOtpView,
    scroll: false,
    title: 'Enter OTP - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/complete': {
    template: monarchCompleteTemplate,
    init: initMonarchCompleteView,
    scroll: false,
    title: 'Migration Complete - YNAB to Monarch',
    requiresAuth: false,
    requiresAccounts: true
  },
  '/oauth/ynab/callback': {
    template: ynabOauthCallbackTemplate,
    init: initYnabOauthCallbackView,
    scroll: false,
    title: 'Authorize YNAB - YNAB to Monarch',
    requiresAuth: false
  },
  '/data-management': {
    template: dataManagementTemplate,
    init: initDataManagementView,
    scroll: true,
    title: 'Data Management - YNAB to Monarch',
    requiresAuth: false
  }
};

let isNavigating = false;
let stateLoaded = false;

// Navigation history stack to track visited pages
const navigationHistory = [];
const MAX_HISTORY_SIZE = 50; // Prevent memory issues

export async function navigate(path, replace = false, skipRouteGuards = false) {
  if (isNavigating) return;
  isNavigating = true;

  try {
    // Normalize path
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    const route = routes[path];
    if (!route) {
      console.error(`Route not found: ${path}`);
      path = '/upload';
      return navigate(path, replace);
    }

    // Ensure state is loaded before checking route guards
    if (!stateLoaded) {
      await loadPersistedState();
      stateLoaded = true;
    }

    // Check route guards (skip if explicitly requested)
    if (!skipRouteGuards && route.requiresAccounts) {
      const hasAccounts = state.hasAccounts();

      if (!hasAccounts) {
        console.warn(`Route ${path} requires accounts but none found. Redirecting to upload.`);
        return navigate('/upload', true);
      }
    }

    // Track navigation history
    const currentPath = getCurrentPath();

    // Update URL and history state
    // For OAuth callback, preserve query parameters; otherwise just use the path
    const urlToSet = path === '/oauth/ynab/callback' ? window.location.href : path;

    if (replace) {
      // When replacing, don't modify our navigation history
      history.replaceState({ path }, '', urlToSet);
    } else {
      // Only track in our history if this is a real user navigation (not a redirect)
      if (currentPath && currentPath !== path) {
        navigationHistory.push(currentPath);

        // Limit history size
        if (navigationHistory.length > MAX_HISTORY_SIZE) {
          navigationHistory.shift();
        }
      }
      history.pushState({ path }, '', urlToSet);
    }

    await renderRoute(path);
  } catch (error) {
    console.error('Navigation error:', error);
    // Fallback to upload page on error
    if (path !== '/upload') {
      return navigate('/upload', true);
    }
  } finally {
    isNavigating = false;
  }
}

async function renderRoute(path) {
  const app = document.getElementById('app');
  const route = routes[path] || routes['/upload'];

  // Reset loading overlay when navigating to a new route
  loadingOverlay.reset();

  // Set page title
  document.title = route.title;

  // Load state only once on app initialization, not on every route change
  if (!stateLoaded) {
    await loadPersistedState();
    stateLoaded = true;
  }

  // Dynamically control page overflow
  document.body.classList.toggle('always-scroll', route.scroll);

  // Scroll to top on route change
  window.scrollTo(0, 0);

  // Clear and inject HTML template
  app.innerHTML = '';
  app.innerHTML = route.template;

  // Initialize view logic
  try {
    await route.init();
  } catch (error) {
    console.error(`Error initializing route ${path}:`, error);
    // If route initialization fails, redirect to upload
    if (path !== '/upload') {
      navigate('/upload', true);
    }
  }
}

export function persistState() {
  try {
    // Also persist some state to localStorage for cross-session persistence
    const persistentState = {
      lastPath: getCurrentPath(),
      timestamp: Date.now()
    };

    localStorage.setItem('app_state', JSON.stringify(persistentState));
  } catch (error) {
    console.error('Error persisting state:', error);
  }
}

// Enhanced state loading with error recovery
async function loadPersistedState() {
  try {
    // Load Monarch credentials from sessionStorage (not localStorage - see storage strategy)
    const monarchEmail = sessionStorage.getItem('monarch_email');
    const monarchPwdEnc = sessionStorage.getItem('monarch_pwd_enc');
    const monarchToken = sessionStorage.getItem('monarch_token');
    const monarchUuid = sessionStorage.getItem('monarch_uuid');

    if (monarchEmail || monarchToken) {
      state.monarchCredentials = {
        email: monarchEmail || state.monarchCredentials.email,
        encryptedPassword: monarchPwdEnc || state.monarchCredentials.encryptedPassword,
        accessToken: monarchToken || state.monarchCredentials.accessToken,
        uuid: monarchUuid || state.monarchCredentials.uuid,
        otp: state.monarchCredentials.otp
      };
    }

    // Note: YNAB tokens are now in HttpOnly cookies, not accessible here
    // Note: Financial data is loaded from IndexedDB on the upload page

    console.log('✅ Persisted state loaded');
  } catch (error) {
    console.error('Error loading persisted state:', error);
  }
}

export function getCurrentPath() {
  return window.location.pathname;
}

export function isValidRoute(path) {
  return routes.hasOwnProperty(path);
}

// Clear all application state (useful for logout or reset)
export function clearAppState() {
  try {
    // Clear app state from localStorage (but keep credentials if remember is enabled)
    localStorage.removeItem('app_state');

    // Reset in-memory state via StateManager
    state.clearAll();
  } catch (error) {
    console.error('Error clearing app state:', error);
  }
}

/**
 * Navigate to the previous page in the navigation history.
 * Falls back to '/' if no history exists.
 */
export function goBack() {
  // Check if we have navigation history
  if (navigationHistory.length > 0) {
    const previousPath = navigationHistory.pop();

    // Validate the previous path is still a valid route
    if (isValidRoute(previousPath)) {
      // Navigate directly to the previous path
      // Using replace=true to avoid adding this back navigation to history
      navigate(previousPath, true);
      return;
    }
  }

  // Fallback: navigate to home page
  navigate('/', true);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', async (event) => {
  if (!isNavigating) {
    const path = event.state?.path || window.location.pathname;
    try {
      // When browser back is used, remove the last item from our history
      // since we're going back to a previous state
      if (navigationHistory.length > 0) {
        navigationHistory.pop();
      }

      await renderRoute(path);
    } catch (error) {
      console.error('Error handling popstate:', error);
      navigate('/upload', true);
    }
  }
});

// Handle initial page load
window.addEventListener('DOMContentLoaded', async () => {
  const path = window.location.pathname;
  const route = routes[path];

  try {
    if (route) {
      // Initialize history state for the current page
      // For OAuth callback, preserve query parameters; otherwise just use the path
      if (!history.state) {
        const urlToSet = path === '/oauth/ynab/callback' ? window.location.href : path;
        history.replaceState({ path }, '', urlToSet);
      }
      await renderRoute(path);
    } else {
      navigate('/upload', true);
    }
  } catch (error) {
    console.error('Error on initial load:', error);
    navigate('/upload', true);
  }
});
