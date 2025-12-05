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

### UI Button System
HTML buttons use declarative data attributes, styled by `renderButtons()`:
```html
<button class="ui-button" data-type="primary|secondary|text|danger|warning" 
        data-size="small|medium|large" data-fullwidth>
  Button Text
</button>
```
**Critical**: Always call `renderButtons()` after injecting HTML or buttons won't style correctly.

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
