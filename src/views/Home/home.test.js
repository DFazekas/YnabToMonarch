import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import initHomeView from './home.js';
// Inline home.html template for jsdom tests
const homeTemplate = `
<div id="pageLayout"></div>

<section class="flex flex-col items-center mb-6 max-w-md mx-auto gap-2">
  <ui-button id="getStartedButton" data-size="large">
    Start Migrating Your Data
  </ui-button>

  <ui-modal id="migrationInfoModal">
    <ui-button slot="trigger" data-type="text">
      How does this work?
    </ui-button>

    <h3 slot="title">How the Migration Process Works</h3>

    <div slot="content">
      <div class="space-y-4 text-sm text-gray-600">
        <div>
          <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 1: Access Your Data</h4>
          <p class="text-gray-600 text-sm">Connect your YNAB account or upload your data manually. We'll retrieve your
            budgets, transactions, categories, and accounts.</p>
        </div>
        <div>
          <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 2: Filter & Process</h4>
          <p class="text-gray-600 text-sm">Decide what to migrate and make edits as needed.</p>
        </div>
        <div>
          <h4 class="text-gray-900 text-sm font-semibold mb-1">Step 3: Download or Import</h4>
          <p class="text-gray-600 text-sm">Decide to receive a ready-to-import file that you can upload into Monarch
            Money yourself, or connect to your Monarch Money account to automatically migrate your data.</p>
        </div>
      </div>
    </div>
  </ui-modal>
</section>

<section class="max-w-3xl mx-auto mb-8">
  <info-banner color="green" icon-type="checkmark" has-border>
    <strong>Your data stays yours, always:</strong> We never store, sell, or share your financial information. You remain in control of your data from start to finish.
    <ui-modal slot="action" id="privacyInfoModal">
      <ui-button slot="trigger" data-type="text">
        Learn more about how we protect your privacy
      </ui-button>

      <h3 slot="title">Privacy is our top priority</h3>

      <div slot="content">
        <div class="space-y-4 text-sm text-gray-600">
          <div>
            <h4 class="text-gray-900 font-semibold mb-1">No Data Collection</h4>
            <p>We never collect, store, or share your financial data.</p>
          </div>
        </div>
      </div>
    </ui-modal>
  </info-banner>
</section>`;

// Ensure custom elements are registered for interaction tests
import '../../components/ReusableModal.js';
import '../../components/AutoStyledButton.js';
import '../../components/pageLayout.js';

vi.mock('../../router.js', () => ({
  navigate: vi.fn(),
}));
import { navigate } from '../../router.js';

describe('Home View', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="app"></div>';
    const app = document.getElementById('app');
    app.innerHTML = homeTemplate;
    // JSDOM missing scrollTo
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders page layout containers and moves content', () => {
    initHomeView();

    const layout = document.getElementById('pageLayout');
    expect(layout).toBeTruthy();

    const nav = document.getElementById('navigationBar');
    const header = document.getElementById('pageHeader');
    const content = document.getElementById('pageContent');

    expect(nav).toBeTruthy();
    expect(header).toBeTruthy();
    expect(content).toBeTruthy();

    // Original sections should be inside pageContent now
    expect(content.querySelector('#getStartedButton')).toBeTruthy();
    expect(content.querySelector('#migrationInfoModal')).toBeTruthy();
    expect(content.querySelector('#privacyInfoModal')).toBeTruthy();
  });

  it('renders header title and description', () => {
    initHomeView();

    const titleEl = document.querySelector('#pageHeader h2');
    const descEl = document.querySelector('#pageHeader p');

    expect(titleEl).toBeTruthy();
    expect(descEl).toBeTruthy();
    expect(titleEl.textContent).toContain('YNAB to Monarch Migration');
    expect(descEl.textContent).toContain('Moving your financial data from YNAB to Monarch');
  });

  it('applies responsive classes to layout and header', () => {
    initHomeView();

    const mainEl = document.querySelector('#pageLayout main');
    expect(mainEl?.className).toContain('overflow-x-hidden');

    const headerH2 = document.querySelector('#pageHeader h2');
    const descP = document.querySelector('#pageHeader p');

    expect(headerH2?.className).toContain('text-xl');
    expect(headerH2?.className).toContain('sm:text-2xl');
    expect(headerH2?.className).toContain('md:text-3xl');
    expect(headerH2?.className).toContain('lg:text-4xl');

    expect(descP?.className).toContain('text-sm');
    expect(descP?.className).toContain('sm:text-base');
    expect(descP?.className).toContain('md:text-lg');
  });

  it('navigates to upload when Get Started is clicked', async () => {
    initHomeView();

    const btn = document.getElementById('getStartedButton');
    expect(btn).toBeTruthy();

    btn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(navigate).toHaveBeenCalledWith('/upload');
  });

  it('opens and closes migration info modal via trigger and close button', async () => {
    vi.useFakeTimers();
    initHomeView();

    const modal = document.getElementById('migrationInfoModal');
    expect(modal).toBeTruthy();

    const trigger = modal?.querySelector('[slot="trigger"]');
    expect(trigger).toBeTruthy();

    trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const overlay = document.body.querySelector('.ui-modal-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains('open')).toBe(true);
    expect(document.body.style.overflow).toBe('hidden');

    const closeBtn = overlay?.querySelector('.ui-modal-close-btn');
    closeBtn?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    // Advance animation timeout
    vi.advanceTimersByTime(550);

    const overlayAfter = document.body.querySelector('.ui-modal-overlay');
    expect(overlayAfter).toBeFalsy();
    expect(document.body.style.overflow).toBe('');
    vi.useRealTimers();
  });

  it('opens privacy modal from info banner action', () => {
    initHomeView();
    const modal = document.getElementById('privacyInfoModal');
    const trigger = modal?.querySelector('[slot="trigger"]');

    trigger?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

    const overlay = document.body.querySelector('.ui-modal-overlay');
    expect(overlay).toBeTruthy();
    expect(overlay?.classList.contains('open')).toBe(true);
  });
});
