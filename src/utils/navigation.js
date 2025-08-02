import { getCurrentPath } from '../router.js';

/**
 * Updates the back button text based on the current route
 */
export function updateBackButtonText() {
  const currentPath = getCurrentPath();
  const backBtn = document.getElementById('backBtn');
  
  if (!backBtn) return;
  
  const backButtonTexts = {
    '/review': 'Back to Upload',
    '/method': 'Back to Review', 
    '/manual': 'Back to Method',
    '/login': 'Back to Method',
    '/otp': 'Back to Login',
    '/complete': 'Back to Review'
  };
  
  const text = backButtonTexts[currentPath] || 'Back';
  backBtn.innerHTML = `
    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
    </svg>
    ${text}
  `;
}

/**
 * Updates navigation-related button texts across the application
 */
export function updateNavigationTexts() {
  updateBackButtonText();
  
  // Update other navigation buttons as needed
  const backToMethodBtn = document.getElementById('backToMethodBtn');
  if (backToMethodBtn) {
    backToMethodBtn.innerHTML = `
      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Method
    `;
  }
}
