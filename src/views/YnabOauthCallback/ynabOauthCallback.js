import state from '../../state.js';
import { navigate } from '../../router.js';
import { renderButtons } from '../../components/button.js';
import { clearExpectedState, getExpectedState } from '../../api/ynabOauth.js';

export default async function initYnabOauthCallbackView() {
  renderButtons();

  const heroMessage = document.querySelector('[data-ynab-oauth-message]');
  const heroSubtext = document.querySelector('[data-ynab-oauth-subtext]');
  const badge = document.querySelector('[data-ynab-oauth-badge]');
  const callout = document.querySelector('[data-ynab-oauth-callout]');
  const iconHolder = document.querySelector('[data-ynab-oauth-hero-icon]');
  const continueButton = document.querySelector('[data-ynab-oauth-continue]');
  const codeInput = document.querySelector('[data-ynab-oauth-code]');
  const copyButton = document.querySelector('[data-ynab-oauth-copy]');
  const copyStatus = document.querySelector('[data-ynab-oauth-copy-status]');

  const timelineSteps = {
    request: document.querySelector('[data-ynab-oauth-step="request"]'),
    approval: document.querySelector('[data-ynab-oauth-step="approval"]'),
    storage: document.querySelector('[data-ynab-oauth-step="storage"]'),
  };

  const params = new URLSearchParams(window.location.search);
  const code = params.get('code');
  const stateParam = params.get('state');
  const error = params.get('error');
  const errorDescription = params.get('error_description');
  const expectedState = getExpectedState();
  const isStateMismatch = expectedState && stateParam && expectedState !== stateParam;
  clearExpectedState();

  let copyFeedbackTimer = null;

  const statusConfig = {
    pending: {
      heroText: 'Receiving the authorization code…',
      subtext: 'Hang tight while we confirm the details sent back from YNAB.',
      callout: 'We are securely capturing the authorization code so you can continue without retyping credentials.',
      badgeText: 'Pending',
      badgeType: 'progress',
      icon: 'pending'
    },
    success: {
      heroText: 'Authorization captured',
      subtext: 'Return to the app and keep migrating without entering credentials again.',
      callout: 'The code was stored in sessionStorage and the SPA will pick it up automatically.',
      badgeText: 'Complete',
      badgeType: 'success',
      icon: 'success'
    },
    cached: {
      heroText: 'Authorization ready',
      subtext: 'Looks like we already have a valid code from a previous attempt.',
      callout: 'SessionStorage still contains your authorization code so you can continue where you left off.',
      badgeText: 'Ready',
      badgeType: 'success',
      icon: 'success'
    }
  };

  const badgeStyles = {
    neutral: ['bg-gray-100', 'text-gray-600'],
    progress: ['bg-blue-100', 'text-blue-700'],
    success: ['bg-green-100', 'text-green-600'],
    error: ['bg-red-50', 'text-red-600']
  };

  const iconStyles = {
    pending: ['bg-blue-50', 'text-blue-600'],
    success: ['bg-green-50', 'text-green-600'],
    error: ['bg-red-50', 'text-red-600']
  };

  const iconGlyphs = {
    pending: '<svg class="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-opacity="0.25"></circle><path stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M22 12a10 10 0 00-10-10"></path></svg>',
    success: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>',
    error: '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01" /><circle cx="12" cy="12" r="9" /></svg>'
  };

  function updateBadge(type, text) {
    if (!badge) return;
    badge.textContent = text;
    badge.className = 'rounded-full px-3 py-1 text-xs font-semibold';
    const styles = badgeStyles[type] || badgeStyles.neutral;
    badge.classList.add(...styles);
  }

  function updateIcon(type) {
    if (!iconHolder) return;
    iconHolder.className = 'flex items-center justify-center w-12 h-12 rounded-2xl';
    iconHolder.classList.add(...(iconStyles[type] || iconStyles.pending));
    iconHolder.innerHTML = iconGlyphs[type] || iconGlyphs.pending;
  }

  function updateHero(config) {
    if (heroMessage) heroMessage.textContent = config.heroText;
    if (heroSubtext) heroSubtext.textContent = config.subtext;
    if (callout) callout.textContent = config.callout;
    updateBadge(config.badgeType, config.badgeText);
    updateIcon(config.icon);
  }

  const stepVariantClasses = ['border-blue-300', 'ring-2', 'ring-blue-100', 'border-green-200', 'bg-green-50', 'text-green-600', 'border-red-200', 'bg-red-50', 'text-red-600'];

  function markStep(stepKey, variant) {
    const stepEl = timelineSteps[stepKey];
    if (!stepEl) return;
    const indicator = stepEl.querySelector('[data-ynab-oauth-step-indicator]');
    stepEl.classList.remove(...stepVariantClasses);
    if (indicator) {
      indicator.textContent = indicator.dataset.stepIndex || indicator.textContent;
    }

    switch (variant) {
      case 'done':
        stepEl.classList.add('border-green-200', 'bg-green-50', 'text-green-600');
        if (indicator) indicator.textContent = '✔';
        break;
      case 'active':
        stepEl.classList.add('border-blue-300', 'ring-2', 'ring-blue-100');
        break;
      case 'error':
        stepEl.classList.add('border-red-200', 'bg-red-50', 'text-red-600');
        if (indicator) indicator.textContent = '⚠';
        break;
      default:
        break;
    }
  }

  function persistCode(authCode, authState = '') {
    const normalizedState = authState || '';
    sessionStorage.setItem('ynab_oauth_code', authCode);
    sessionStorage.setItem('ynab_oauth_state', normalizedState);
    state.ynabOauth = { code: authCode, state: normalizedState, error: null };
  }

  function updateCodeField(authCode) {
    if (codeInput) {
      codeInput.value = authCode || '';
    }
    if (copyButton) {
      copyButton.disabled = !authCode;
      renderButtons();
    }
    if (copyStatus) {
      copyStatus.classList.add('hidden');
    }
  }

  function showCopyFeedback(message) {
    if (!copyStatus) return;
    copyStatus.textContent = message;
    copyStatus.classList.remove('hidden');
    if (copyFeedbackTimer) {
      clearTimeout(copyFeedbackTimer);
    }
    copyFeedbackTimer = window.setTimeout(() => {
      copyStatus.classList.add('hidden');
    }, 2500);
  }

  function handleSuccess(codeValue, stateValue = '') {
    persistCode(codeValue, stateValue);
    updateHero(statusConfig.success);
    markStep('approval', 'done');
    markStep('storage', 'done');
    updateCodeField(codeValue);
  }

  function handleCached(codeValue, stateValue = '') {
    persistCode(codeValue, stateValue);
    updateHero(statusConfig.cached);
    markStep('approval', 'done');
    markStep('storage', 'done');
    updateCodeField(codeValue);
  }

  function handleError(errorCode, description) {
    const normalizedError = errorCode || 'code_missing';
    const heroText = `Redirect error: ${normalizedError}`;
    const calloutText = description ? `YNAB response: ${description}` : 'We did not receive an authorization code. Please try again from YNAB.';
    const heroState = {
      heroText,
      subtext: 'Close this tab, start the authorization again, or open YNAB to retry.',
      callout: calloutText,
      badgeText: 'Error',
      badgeType: 'error',
      icon: 'error'
    };

    if (heroMessage) heroMessage.textContent = heroState.heroText;
    if (heroSubtext) heroSubtext.textContent = heroState.subtext;
    if (callout) callout.textContent = heroState.callout;
    updateBadge(heroState.badgeType, heroState.badgeText);
    updateIcon(heroState.icon);
    updateCodeField('');
    state.ynabOauth = { code: null, state: null, error: description || normalizedError };
    markStep('approval', 'error');
    markStep('storage', 'idle');
  }

  function handleCopyClick(event) {
    event.preventDefault();
    if (!codeInput || !codeInput.value) return;
    const clipboard = navigator.clipboard;
    if (clipboard?.writeText) {
      clipboard.writeText(codeInput.value).then(() => {
        showCopyFeedback('Copied!');
      }).catch(() => {
        codeInput.select();
        showCopyFeedback('Select + copy manually');
      });
    } else {
      codeInput.select();
      showCopyFeedback('Select + copy manually');
    }
  }

  updateHero(statusConfig.pending);
  markStep('request', 'done');
  markStep('approval', 'active');
  markStep('storage', 'active');

  if (isStateMismatch) {
    handleError('state_mismatch', 'The authorization state returned from YNAB did not match the request. Please try again.');
    return;
  }

  if (code) {
    handleSuccess(code, stateParam);
  } else if (error) {
    handleError(error, errorDescription);
  } else {
    const storedCode = sessionStorage.getItem('ynab_oauth_code');
    const storedState = sessionStorage.getItem('ynab_oauth_state');
    if (storedCode) {
      handleCached(storedCode, storedState);
    } else {
      state.ynabOauth = { code: null, state: null, error: null };
    }
  }

  if (continueButton) {
    continueButton.addEventListener('click', (event) => {
      event.preventDefault();
      navigate('/upload', true);
    });
  }

  if (copyButton) {
    copyButton.addEventListener('click', handleCopyClick);
  }
}
