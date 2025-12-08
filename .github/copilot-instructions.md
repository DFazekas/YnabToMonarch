# AI Agent Instructions for YNAB to Monarch

## Architecture Overview

**Hybrid Static + Serverless Application**: A client-side SPA bundled with esbuild that calls Netlify Functions for sensitive operations (auth, API proxying). No traditional backend—all state lives in browser storage.

- **Frontend**: Vanilla JS ES6 modules, no framework. Router-based SPA in `src/router.js` with view templates imported as text via esbuild's `--loader:.html=text`
- **State Management**: Global `state.js` object + dual storage strategy:
  - `sessionStorage`: YNAB accounts, Monarch accounts (cleared on tab close)
  - `localStorage`: Encrypted Monarch credentials, remember-me flags (persistent)
- **Serverless Functions**: `netlify/functions/*.cjs` (CommonJS) proxy sensitive operations (Monarch login, YNAB OAuth token exchange, account creation)
- **Security Pattern**: Client-side password encryption (`shared/crypto.js` Web Crypto API) → serverless decryption (`shared/crypto-node.js` Node crypto) → never stored plaintext

## Critical Developer Workflows

### Development Server
```bash
npm run dev  # Runs 3 parallel processes: Tailwind watch, esbuild watch, netlify dev
```
- Netlify Dev serves on `localhost:3000` (proxies serverless functions)
- Static files served from `public/`, functions from `netlify/functions/`
- Environment vars loaded from `.env` (required: `YNAB_CLIENT_ID`, `YNAB_CLIENT_SECRET`, `YNAB_REDIRECT_URI`)

### Build Process
```bash
npm run build  # Production build: Tailwind minify + esbuild minify
```
- Entry point: `src/main.js` → bundles to `public/bundle.js`
- HTML templates bundled as text strings (not separate files in production)

### Debugging Netlify Functions Locally
```bash
npm run functions  # Run serverless-offline with auto-reload
```
Use when testing auth flows or Monarch API integrations without full dev server.

## Project-Specific Conventions

### View Structure Pattern
Every view in `src/views/*/` follows this contract:
```javascript
// view.js - MUST export default init function
import { renderPageLayout } from '../../components/pageLayout.js';

export default function initViewNameView() {
  // 1. Render page layout (wraps existing content from router)
  renderPageLayout();
  
  // 2. Render navigation bar (optional)
  // 3. Render page header (optional)
  // 4. Call renderButtons() to activate UI button system
  // 5. Query DOM elements and attach event listeners
  // 6. Call view-specific render logic
}
```

**HTML Structure:**
```html
<div id="pageLayout"></div>

<!-- Page-specific content here -->
<div class="my-content">...</div>
```

**Note**: The router injects the HTML template first, then the view's `renderPageLayout()` wraps that content in the layout structure.

**Router Registration** (in `src/router.js`):
```javascript
import initViewNameView from './views/ViewName/viewName.js';
import viewNameTemplate from './views/ViewName/viewName.html';

routes['/path'] = {
  template: viewNameTemplate,
  init: initViewNameView,
  scroll: true|false,  // Controls body overflow
  requiresAuth: false,  // Not implemented yet
  requiresAccounts: true  // Redirects to /upload if state.accounts is empty
};
```

### Reusable Components

#### Page Header Component
Standardized header and subheader rendering:
```javascript
import { renderPageHeader } from '../../components/pageHeader.js';

renderPageHeader({
  title: 'Step 1: Import YNAB Data',
  description: 'Choose how you\'d like to bring your YNAB data into Monarch Money...',
  containerId: 'pageHeader'  // default
});
```

HTML template must include:
```html
<div id="pageHeader"></div>
```

#### Page Layout Component
Provides consistent, responsive layout structure by wrapping existing page content:
```javascript
import { renderPageLayout } from '../../components/pageLayout.js';

// Wrap existing content (already injected by router)
renderPageLayout();

// Then query elements normally
const myButton = document.getElementById('myButton');
```

HTML structure (in view.html):
```html
<div id="pageLayout"></div>

<!-- Your page content here -->
<div class="my-alert hidden" id="myAlert">...</div>
<section>...</section>
```

**How it works:**
1. Router injects the view's HTML template into `#app`
2. `renderPageLayout()` finds `#pageLayout` container
3. Moves all sibling elements into the layout structure
4. Creates slots for navigation bar, page header, and content

**Layout features:**
- Responsive padding: `px-4 sm:px-6 md:px-8` with responsive vertical spacing
- Max-width container: `max-w-6xl` for optimal content width
- Auto-included: Navigation bar, page header, content container slots

#### Navigation Bar Component
Optional back button and data management button:
```javascript
import { renderNavigationBar } from '../../components/navigationBar.js';

renderNavigationBar({
  showBackButton: true,
  showDataButton: true,
  backText: 'Back',  // default
  containerId: 'navigationBar'  // default
});
```

HTML template must include:
```html
<div id="navigationBar"></div>
```

### Auto-Styled Button System
Buttons automatically style themselves using Web Components - no manual `renderButtons()` calls needed:

```html
<!-- Auto-styled button (recommended) -->
<ui-button class="ui-button" data-type="primary" data-size="large" data-fullwidth>
  Button Text
</ui-button>

<!-- Legacy button (still works with renderButtons()) -->
<button class="ui-button" data-type="primary">Old Button</button>
```

**Button types**: `primary`, `secondary`, `text`, `danger`, `warning`
**Button sizes**: `small`, `medium`, `large`
**Modifiers**: `data-fullwidth`, `disabled`

**Auto-update feature**: Styles automatically update when attributes change:
```javascript
import '../../components/AutoStyledButton.js';

const button = document.getElementById('myButton');
button.dataset.type = 'danger'; // Styles update automatically
button.disabled = true; // Styles update automatically
```

**No more manual styling calls** - Import once and buttons auto-style themselves.

### Reactive State System (Optional)
For complex UIs that need to respond to state changes, use the reactive signal system:

```javascript
import { signal, bind } from '../../core/reactiveState.js';

// Create reactive state
const isLoading = signal(false);
const message = signal('Ready');

// Bind to DOM elements
const button = document.getElementById('submitBtn');
bind(button, {
  'attr:disabled': isLoading,
  'textContent': message
});

// Updates automatically trigger DOM changes
isLoading.value = true; // Button disables
message.value = 'Loading...'; // Button text updates
```

**When to use**:
- Dynamic UI that changes based on state
- Loading states, form validation, conditional rendering
- Complex interactions requiring multiple DOM updates

**When NOT to use**:
- Simple static pages
- One-time DOM manipulations
- When vanilla JS is simpler

### Reusable Modal Components (Reactive Web Components)
Modals are self-managing Web Components with reactive state and animations. Create multiple instances with different content.

**Base Component**: `<ui-modal>` (ReusableModal.js)
```html
<!-- Instance 1: Privacy Info Modal -->
<ui-modal id="privacyModal">
  <button slot="trigger" data-type="text">Learn more</button>
  <h3 slot="title">Privacy Details</h3>
  <div slot="content">Privacy information here</div>
</ui-modal>

<!-- Instance 2: Migration Info Modal -->
<ui-modal id="migrationModal">
  <button slot="trigger" data-type="text">How does this work?</button>
  <h3 slot="title">Migration Steps</h3>
  <div slot="content">Step-by-step guide here</div>
</ui-modal>
```

**Programmatic Control** (if needed):
```javascript
const modal = document.querySelector('#privacyModal');
modal.open();   // Open modal
modal.close();  // Close modal
modal.toggle(); // Toggle modal
```

**Features**:
- Reactive state via signals (auto-updates animations)
- Shadow DOM for style encapsulation
- Slot-based content composition
- Built-in animations (fade + slide, 300ms)
- Accessibility: ARIA attributes, Escape key support, backdrop click
- Auto-cleanup on disconnect
- Create unlimited instances with different content

**When to use**:
- Any modal dialog (confirmation, info, feedback)
- Multiple modals on same page (one component, many instances)
- Page-specific modals with custom content

**When NOT to use**:
- Simple alerts (use browser `alert()` for emergency cases)
- Tooltips (use CSS or hover components)
- Inline popovers (consider floating UI)

### Reusable Table Component (Reactive Web Component)
Tables are self-managing Web Components with reactive state, master checkbox, and customizable cells. Supports desktop table view and mobile responsive card view.

**Base Component**: `<ui-table>` (ReusableTable.js)
```html
<ui-table 
  id="accountsTable" 
  data-mobile-breakpoint="lg" 
  data-enable-selection="true"
  data-row-id-key="id">
</ui-table>
```

**JavaScript Configuration**:
```javascript
import '../../components/ReusableTable.js';

const table = document.getElementById('accountsTable');

// Define columns with different cell types
table.columns = [
  { 
    key: 'select', 
    type: 'checkbox', 
    header: '',
    width: '60px',
    masterCheckbox: true,
    disabled: (row) => row.status === 'processed'
  },
  { 
    key: 'name', 
    type: 'text', 
    header: 'Account Name',
    clickable: true,
    tooltip: (row) => `Click to edit ${row.name}`,
    onClick: (row) => console.log('Edit', row)
  },
  { 
    key: 'type', 
    type: 'select', 
    header: 'Type',
    options: [...], // or function: (row) => [...]
    onChange: (row, value) => { row.type = value; }
  },
  { 
    key: 'status', 
    type: 'button', 
    header: 'Status',
    render: (row) => ({ 
      text: row.included ? 'Included' : 'Excluded',
      type: row.included ? 'primary' : 'secondary',
      size: 'small',
      onClick: () => { row.included = !row.included; }
    })
  }
];

// Set data
table.data = accountsArray;

// Listen to selection changes
table.addEventListener('selectionchange', (e) => {
  console.log('Selected count:', e.detail.count);
  console.log('All selected:', e.detail.allSelected);
  console.log('Some selected (indeterminate):', e.detail.someSelected);
  console.log('Selected row IDs:', e.detail.selected);
  console.log('Selected row objects:', e.detail.selectedRows);
});

// Programmatic control
table.clearSelection();
table.selectAll();
table.refresh();
```

**Column Configuration Options**:
- `key`: Data property key
- `type`: `'checkbox'`, `'text'`, `'select'`, `'button'`, `'custom'`
- `header`: Column header text
- `width`, `minWidth`: Column sizing
- `headerClass`, `cellClass`: Custom CSS classes
- `disabled`: Function to disable cell interaction
- `clickable`: Make text cells clickable
- `tooltip`: Static string or function
- `onClick`: Click handler for clickable cells
- `getValue`: Custom value getter
- `render`: Custom render function
- `options`: Array or function returning options for selects
- `onChange`: Change handler for selects
- `cellStyle`: Static object or function returning styles
- `mobileHidden`: Hide column in mobile view
- `mobileLabel`: Label for mobile card layout
- `mobileClass`: CSS class for mobile layout
- `masterCheckbox`: Enable master checkbox for selection column

**Features**:
- Master checkbox with indeterminate state
- Row selection with state propagation
- Customizable cell types (text, button, checkbox, dropdown, custom)
- Mobile responsive card view (auto-switches at breakpoint)
- Filtering and search integration (external)
- Reactive state via signals
- Selection change events
- Programmatic selection control

**When to use**:
- Data tables with row selection
- Tables with mixed cell types (buttons, dropdowns, etc.)
- Mobile-responsive table views
- Tables requiring master checkbox
- Dynamic tables with state management

**When NOT to use**:
- Simple static tables (use plain HTML `<table>`)
- Read-only tables without interaction
- When vanilla table is simpler

**When NOT to use**:
- Simple alerts (use browser `alert()` for emergency cases)
- Tooltips (use CSS or hover components)
- Inline popovers (consider floating UI)

### Navigation & Back Button Logic
- Uses a **navigation history stack** (`navigationHistory` array in `router.js`)
- `goBack()` pops from history and navigates to previous page
- Works universally for all pages - no hardcoded route mappings
- History is maintained during normal navigation (not on redirects with `replace=true`)

### Storage & State Persistence
```javascript
// Persist state after major changes
persistState();  // Saves accounts to sessionStorage, lastPath to localStorage

// Load on app init (automatic in router)
loadPersistedState();  // Restores from sessionStorage + localStorage
```

**Storage Keys** (defined in `src/utils/storage.js`):
- `monarchEmail`, `monarchPasswordBase64`, `monarchApiToken`, `monarchDeviceUuid`, `monarchRememberMe`
- `ynab_accounts` (session), `monarch_accounts` (session), `app_state` (local)

### Password Encryption Flow
1. **Client-side** (`shared/crypto.js`): `encryptPassword(email, plaintext)` → base64 string
   - Uses Web Crypto API (AES-GCM, PBKDF2 with email as key material)
   - Format: `[IV (12 bytes) | ciphertext | auth tag (16 bytes)]`
2. **Serverless** (`shared/crypto-node.js`): `decryptPassword(email, base64Encrypted)` → plaintext
   - Node.js crypto module, same PBKDF2 parameters (see `shared/cryptoSpec.js`)
3. **Never store plaintext password anywhere**—even serverless functions decrypt on-the-fly

### Tailwind Usage
- Config: `tailwind.config.js` with custom breakpoints (`xs: 475px`, `max-xs`, `max-sm`, etc.)
- Responsive pattern: Mobile-first with `sm:`, `md:`, `lg:` prefixes
- Custom colors: `brand: #005B96` for primary actions
- **Touch targets**: `min-h-44` and `min-w-44` classes (44px iOS minimum)

## Integration Points

### YNAB OAuth Flow
1. User clicks "Connect to YNAB" → `redirectToYnabOauth()` in `src/api/ynabApi.js`
2. YNAB redirects to `/oauth/ynab/callback` with code + state
3. View calls `handleOauthCallback()` → serverless function `ynabTokenExchange.cjs` exchanges code for access token
4. Token stored in state, used to fetch budgets/accounts via YNAB API

### Monarch Money Integration
1. Login: `monarchApi.login()` → `netlify/functions/monarchLogin.cjs` (handles OTP flow)
2. Fetch accounts: `monarchApi.fetchAccounts()` → serverless function queries Monarch API
3. Create accounts: `monarchApi.createAccounts()` → serverless function posts account data + transactions
4. Status polling: `monarchApi.getUploadStatus()` tracks async uploads

**Monarch API Base**: `https://api.monarchmoney.com` (proxied through serverless functions)

### CSV Parsing (YNAB ZIP Export)
- `src/services/ynabParser.js`: Parses YNAB's exported ZIP (contains CSV files per account)
- Uses `jszip` + `papaparse` libraries
- Transforms YNAB schema → Monarch-compatible format in `shared/generateCsv.js`

## Common Gotchas

1. **HTML Templates Not Updating**: Run `npm run build:js` or check esbuild watch is running
2. **Buttons Not Styling**: Forgot to call `renderButtons()` after HTML injection
3. **Route Guards Failing**: `requiresAccounts: true` needs accounts in `state.accounts` (check `persistState()` was called)
4. **Serverless Function 500s**: Check `.env` file exists with YNAB OAuth credentials
5. **Password Decryption Errors**: Email must match exactly (used as PBKDF2 key material)
6. **Modal Not Showing**: Call `openModal('modalId')` from `src/components/modal.js`, ensure modal has proper structure with `.relative` wrapper

## File Organization

- `src/views/*/`: View templates (HTML) + init functions (JS)
- `src/components/`: Reusable UI (buttons, modals, navigation, page header)
- `src/utils/`: Pure utilities (DOM, formatting, storage, navigation)
- `src/api/`: Frontend API clients (YNAB, Monarch) + config loader
- `netlify/functions/`: Serverless endpoints (CommonJS `.cjs` files)
- `shared/`: Code used by both client + serverless (crypto, CSV generation)
- `public/`: Static assets + build output (`bundle.js`, `styles.css`)
- `tools/`: Admin scripts (fetch Monarch shortcuts, delete test accounts)

## Testing Monarch Integration
```bash
npm run delete:AllAccounts  # Clears test accounts from Monarch (requires credentials in .env)
```

## Key Dependencies
- **esbuild**: Bundles ES6 modules + imports HTML as text
- **jszip**: Parses YNAB ZIP exports
- **papaparse**: CSV parsing (YNAB account registers)
- **uuid**: Generates device UUIDs for Monarch auth
- **Tailwind CLI v4**: Standalone binary (no PostCSS)
