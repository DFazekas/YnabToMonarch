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
import { getLocalStorage } from './utils/storage.js';

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
      const hasAccounts = state.accounts && Object.keys(state.accounts).length > 0;
      
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
      history.replaceState({ path }, '', urlToSet);
      // When replacing, don't modify our navigation history
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

  // Set page title
  document.title = route.title;

  // Load state only once on app initialization, not on every route change
  if (!stateLoaded) {
    await loadPersistedState();
    stateLoaded = true;
  }

  // Dynamically control page overflow
  if (route.scroll) {
    document.body.classList.add('always-scroll');
  } else {
    document.body.classList.remove('always-scroll');
  }

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
    // Persist accounts to sessionStorage (survives refresh, cleared on tab close)
    if (Object.keys(state.accounts).length > 0) {
      sessionStorage.setItem('ynab_accounts', JSON.stringify(state.accounts));
    }
    
    if (state.monarchAccounts) {
      sessionStorage.setItem('monarch_accounts', JSON.stringify(state.monarchAccounts));
    }

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
    // Initialize accounts as empty object if not already set
    if (!state.accounts) {
      state.accounts = {};
    }

    // Load credentials from localStorage
    const localStorageData = getLocalStorage();
    if (localStorageData.email || localStorageData.token) {
      state.credentials.email = localStorageData.email || state.credentials.email;
      state.credentials.encryptedPassword = localStorageData.encryptedPassword || state.credentials.encryptedPassword;
      state.credentials.apiToken = localStorageData.token || state.credentials.apiToken;
      state.credentials.deviceUuid = localStorageData.uuid || state.credentials.deviceUuid;
      state.credentials.remember = localStorageData.remember || state.credentials.remember;
    }

    // Load accounts from sessionStorage (survives page refresh but not tab close)
    const accountsData = sessionStorage.getItem('ynab_accounts');
    if (accountsData) {
      try {
        const parsedAccounts = JSON.parse(accountsData);
        // Validate accounts data structure
        if (parsedAccounts && typeof parsedAccounts === 'object') {
          state.accounts = parsedAccounts;
        }
      } catch (e) {
        console.warn('Failed to parse accounts from sessionStorage:', e);
        sessionStorage.removeItem('ynab_accounts');
        state.accounts = {};
      }
    }

    // Load monarch accounts from sessionStorage
    const monarchAccountsData = sessionStorage.getItem('monarch_accounts');
    if (monarchAccountsData) {
      try {
        const parsedMonarchAccounts = JSON.parse(monarchAccountsData);
        if (parsedMonarchAccounts && typeof parsedMonarchAccounts === 'object') {
          state.monarchAccounts = parsedMonarchAccounts;
        }
      } catch (e) {
        console.warn('Failed to parse monarch accounts from sessionStorage:', e);
        sessionStorage.removeItem('monarch_accounts');
        state.monarchAccounts = null;
      }
    }

    // Load app state for additional context
    const appStateData = localStorage.getItem('app_state');
    if (appStateData) {
      try {
        const appState = JSON.parse(appStateData);
        // Check if state is recent (within last 24 hours)
        if (appState.timestamp && (Date.now() - appState.timestamp) < 24 * 60 * 60 * 1000) {
          // State is recent and valid
          console.log('Loaded recent app state from localStorage');
        } else {
          // Clean up old state
          localStorage.removeItem('app_state');
        }
      } catch (e) {
        console.warn('Failed to parse app state from localStorage:', e);
        localStorage.removeItem('app_state');
      }
    }
  } catch (error) {
    console.error('Error loading persisted state:', error);
    // Reset state on critical error
    state.accounts = {};
    state.monarchAccounts = null;
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
    // Clear session storage
    sessionStorage.removeItem('ynab_accounts');
    sessionStorage.removeItem('monarch_accounts');
    
    // Clear app state from localStorage (but keep credentials if remember is enabled)
    localStorage.removeItem('app_state');
    
    // Reset in-memory state
    state.accounts = {};
    state.monarchAccounts = null;
    
    console.log('Application state cleared');
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
