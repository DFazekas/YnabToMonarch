# Storage Strategy Documentation

**Last Updated:** December 21, 2025  
**Application:** YNAB to Monarch Money Migration Tool  
**Architecture:** Netlify Static Site + Netlify Functions (Node.js) Backend

---

## Overview

This document defines where and how different types of data are stored in the YnabToMonarch application. It serves as a reference for developers and Copilot to understand the security model, data persistence requirements, and storage implementation across the stack.

**Key Principle:** Use the least-privileged storage mechanism for each data type (HttpOnly cookies > IndexedDB > sessionStorage > localStorage).

---

## Storage Mechanisms

### 1. HttpOnly Cookies (Most Secure)

**Purpose:** Store YNAB OAuth tokens  
**Accessibility:** Server-side only (JavaScript cannot access)  
**Scope:** Domain-wide, sent with all requests  
**Lifespan:** Session (configurable per cookie)

#### Implementation Details

- **Backend Setup:** Netlify Functions set cookies in response headers
- **Attributes:**
  - `HttpOnly`: True (prevents XSS access)
  - `Secure`: True (HTTPS only in production)
  - `SameSite`: Strict (prevents CSRF)
  - `Max-Age`: 3600 seconds (1 hour for access token), 31536000 seconds (1 year for refresh token)

#### Stored Data

| Cookie Name | Content | Max-Age | Refresh Mechanism |
|---|---|---|---|
| `ynab_access_token` | JWT access token | 3600s (1 hour) | `ynabTokenRefresh.cjs` |
| `ynab_refresh_token` | OAuth refresh token | 31536000s (1 year) | Manual via refresh endpoint |

#### Files Involved

- **Set:** `netlify/functions/ynabTokenExchange.cjs` (initial OAuth exchange)
- **Set:** `netlify/functions/ynabTokenRefresh.cjs` (token refresh)
- **Read:** `netlify/functions/ynabProxy.cjs` (extracts token for YNAB API calls)
- **Verify:** `netlify/functions/ynabAuthStatus.cjs` (reports cookie presence to the frontend without exposing tokens)
- **Client:** `src/api/ynabTokens.js` (manages refresh lifecycle)

#### Security Notes

- Tokens **never** appear in JavaScript code
- Frontend cannot read or modify cookies directly
- Backend validates cookies on every API request
- Automatic refresh via `ynabTokenRefresh.cjs` when access token expires (401 response)
- No token exposure in browser console or localStorage

---

### 2. IndexedDB (Persistent, Structured)

**Purpose:** Store financial data (accounts, transactions, upload states)  
**Accessibility:** JavaScript only (async promises)  
**Scope:** Per-origin, per-browser  
**Lifespan:** Until explicitly cleared or localStorage is cleared

#### Database Schema

**Database Name:** `YnabToMonarchDB`  
**Version:** 1

#### Object Stores

```
📦 YnabToMonarchDB (v1)
├── accounts (keyPath: 'id')
│   ├── id (string): Unique account ID
│   ├── name (string): Account name
│   ├── type (string): Account type
│   ├── balance (number): Current balance
│   ├── source (string): 'ynab' | 'monarch' | 'manual'
│   ├── syncedAt (number): Timestamp of last sync
│   └── metadata (object): Additional account-specific data
│
├── transactions (keyPath: 'id')
│   ├── id (string): Unique transaction ID
│   ├── accountId (string): Foreign key to accounts
│   ├── date (number): Transaction timestamp
│   ├── amount (number): Transaction amount
│   ├── payee (string): Payee name
│   ├── category (string): Category name
│   ├── memo (string): Transaction memo
│   ├── source (string): 'ynab' | 'csv' | 'manual'
│   └── syncedAt (number): Timestamp of last sync
│
├── uploadStates (keyPath: 'itemId')
│   ├── itemId (string): Unique upload item ID
│   ├── status (string): 'pending' | 'success' | 'failed'
│   ├── errorMessage (string): Error details if failed
│   ├── retryCount (number): Number of retry attempts
│   ├── createdAt (number): Creation timestamp
│   └── updatedAt (number): Last update timestamp
│
└── metadata (keyPath: 'key')
    ├── key (string): Metadata key
    ├── value (any): Metadata value
    └── updatedAt (number): Last update timestamp
```

#### Files Involved

- **Management:** `src/utils/indexedDB.js` (OOP wrapper with FinancialDataDB class)
- **Usage:** `src/views/Upload/uploadData.js` (saves fetched/parsed financial data)
- **Usage:** `src/views/Upload/upload.js` (loads accounts on page init)

#### Key Methods

```javascript
// Initialization
await financialDB.init()

// Accounts
await financialDB.saveAccounts(accountsArray)
const accounts = await financialDB.getAccounts()
const hasAccounts = await financialDB.hasAccounts()

// Transactions
await financialDB.saveTransactions(transactionsArray)
const transactions = await financialDB.getTransactions()

// Upload States
await financialDB.saveUploadState(itemId, status, errorMsg, retryCount)
const failedUploads = await financialDB.getUploadStatesByStatus('failed')

// Metadata
await financialDB.saveMetadata(key, value)
const metadata = await financialDB.getMetadata(key)

// Cleanup
await financialDB.clearAccounts()
await financialDB.clearAll()
```

#### Lazy Initialization Pattern

IndexedDB is wrapped with environment detection to prevent errors in Node.js:

```javascript
const isIndexedDBAvailable = typeof indexedDB !== 'undefined';

class FinancialDataDB {
  async init() {
    if (!isIndexedDBAvailable) {
      console.warn('IndexedDB not available');
      return;
    }
    // ... proceed with initialization
  }
}
```

This allows the same code to run in both browser and Node.js environments without errors.

---

### 3. SessionStorage (Temporary, Per-Tab)

**Purpose:** Store Monarch Money credentials and temporary app state  
**Accessibility:** JavaScript only (synchronous)  
**Scope:** Per-tab (cleared on tab close)  
**Lifespan:** Until browser tab is closed or user logs out

#### Stored Data

| Key | Content | Type | Format |
|---|---|---|---|
| `monarch_email` | User email | string | Plain text |
| `monarch_pwd_enc` | Encrypted password | string | Base64-encoded (AES-GCM) |
| `monarch_token` | API access token | string | JWT or Bearer token |
| `monarch_uuid` | Device UUID | string | UUID v4 format |
| `monarch_otp` | One-time passcode | string | 6-digit code (temporary) |
| `app_state_*` | Temporary UI state | string | JSON |

#### Files Involved

- **Set:** `src/views/MonarchCredentials/` (user login flow)
- **Read:** `src/router.js` (restore credentials on page load)
- **Clear:** User logout or automatic on tab close

#### Security Notes

- Cleared automatically when tab closes (no persistence across sessions)
- Passwords encrypted with AES-GCM using email as key material
- No sensitive data remains if browser crashes or is force-killed
- Protects against malicious code in other tabs (sessionStorage is same-origin)
- YNAB tokens are never written here; clients call `/.netlify/functions/ynabAuthStatus` when auth state is needed

#### Encryption Mechanism

```javascript
// Encryption (shared/crypto.js)
import { encryptPassword, decryptPassword } from './crypto.js';

const email = 'user@example.com';
const password = 'secretPassword123';
const encrypted = await encryptPassword(email, password);
sessionStorage.setItem('monarch_pwd_enc', encrypted);

// Decryption (shared/crypto.js)
const encrypted = sessionStorage.getItem('monarch_pwd_enc');
const decrypted = await decryptPassword(email, encrypted);
```

**Encryption Details:**
- Algorithm: AES-256-GCM
- Key Derivation: PBKDF2 from email + static salt
- IV: Random 12 bytes per encryption
- Auth Tag: 16 bytes for authentication
- Output: Base64-encoded `[IV | Ciphertext | Auth Tag]`

---

### 4. LocalStorage (Persistent, Simple)

**Purpose:** UI preferences and non-sensitive app state  
**Accessibility:** JavaScript only (synchronous)  
**Scope:** Per-origin, per-browser  
**Lifespan:** Until explicitly cleared or localStorage quota exceeded

#### Stored Data

| Key | Content | Lifespan |
|---|---|---|
| `theme_preference` | 'light' \| 'dark' \| 'system' | Persistent |
| `language` | ISO language code | Persistent |
| `tutorial_completed` | Boolean | Persistent |
| `last_sync_time` | ISO timestamp | Until app update |
| `ui_state_*` | Collapsed/expanded state, scroll positions | Session |

#### Files Involved

- **Usage:** `src/views/` (individual component preferences)
- **Cleanup:** Manual via settings or "Clear App Data" button

#### Security Notes

- Only stores non-sensitive UI preferences
- Does **not** store credentials or financial data
- Does **not** store auth tokens (HttpOnly cookies used instead)
- Safe to inspect in browser DevTools

#### Quota

- Typical limit: 5-10 MB per origin
- Graceful degradation if quota exceeded
- Can be cleared by users in browser settings

---

## Data Flow Diagrams

### OAuth Token Flow (YNAB)

```
1. User clicks "Connect to YNAB"
   ↓
2. Frontend redirects to YNAB OAuth endpoint
   ↓
3. User logs in and authorizes app
   ↓
4. YNAB redirects to /oauth/callback?code=AUTH_CODE
   ↓
5. Frontend calls exchangeYnabToken(code)
   ↓
6. POST /.netlify/functions/ynabTokenExchange
   ├─ Body: { code: "AUTH_CODE" }
   └─ Response headers:
      ├─ Set-Cookie: ynab_access_token=JWT; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
      └─ Set-Cookie: ynab_refresh_token=TOKEN; HttpOnly; Secure; SameSite=Strict; Max-Age=31536000
   ↓
7. Browser stores cookies automatically
   ↓
8. Frontend redirected to app with ✅ success
```

### API Call with Auto-Refresh

```
Frontend calls: await ynabApiCall('/budgets')
   ↓
Calls /.netlify/functions/ynabProxy?path=/budgets&method=GET
   ├─ Browser sends: Cookie: ynab_access_token=JWT; ynab_refresh_token=TOKEN
   ↓
Backend (ynabProxy.cjs):
   ├─ Parse ynab_access_token from cookies
   ├─ Call YNAB API: GET https://api.ynab.com/v1/budgets
   │  Headers: Authorization: Bearer JWT
   ├─ Response: 200 OK with data
   └─ Return data to frontend
   ↓
Frontend receives: { budgets: [...] }

---

If YNAB returns 401 (token expired):
   ↓
Frontend catches 401, calls: await refreshYnabToken()
   ↓
Calls /.netlify/functions/ynabTokenRefresh
   ├─ Browser sends: Cookie: ynab_refresh_token=TOKEN
   ↓
Backend (ynabTokenRefresh.cjs):
   ├─ Parse ynab_refresh_token from cookies
   ├─ Call YNAB OAuth: POST https://api.ynab.com/oauth/token
   │  Body: { grant_type: 'refresh_token', refresh_token: TOKEN, ... }
   ├─ Response: new access_token
   └─ Set-Cookie: ynab_access_token=NEW_JWT; HttpOnly; Secure; SameSite=Strict; Max-Age=3600
   ↓
Frontend retries original request with new token
   ↓
Frontend receives: { budgets: [...] }
```

### Financial Data Persistence

```
User uploads YNAB ZIP file
   ↓
Frontend validates file: validateZipFile()
   ↓
Frontend calls: parseUploadedFile(file)
   ├─ Parse CSV contents
   ├─ Save to IndexedDB: await financialDB.saveAccounts(accounts)
   ├─ Save to IndexedDB: await financialDB.saveTransactions(transactions)
   ├─ Update in-memory: state.accounts
   └─ Return parsed data
   ↓
User closes browser/tab
   ↓
User returns to app
   ↓
Frontend init: await financialDB.init()
   ↓
If hasStoredAccounts(), load: await financialDB.getAccounts()
   ├─ Restore state.accounts
   ├─ Load transactions: await financialDB.getTransactions()
   └─ Display in review page
   ↓
User can continue with same data (no re-upload needed)
```

### Monarch Login Flow

```
User enters email + password
   ↓
Frontend calls encryptPassword(email, password)
   ├─ Derive key from email via PBKDF2
   ├─ Encrypt password with AES-256-GCM
   └─ Encode as Base64
   ↓
Frontend stores in sessionStorage:
   ├─ monarch_email = email
   ├─ monarch_pwd_enc = Base64([IV | CT | Tag])
   ├─ monarch_uuid = device_uuid
   └─ monarch_token = api_token (from backend response)
   ↓
User can use credentials in same tab
   ↓
If tab closes:
   ├─ sessionStorage cleared automatically
   ├─ Credentials lost (user must log in again)
   └─ No data persisted to disk
```

---

## Decision Matrix

| Data Type | Primary Storage | Backup | Why |
|---|---|---|---|
| YNAB access token | HttpOnly cookie | None | Must not be accessible to JS; expires hourly |
| YNAB refresh token | HttpOnly cookie | None | Long-lived secret; server-only access |
| Monarch email | sessionStorage | None | Temporary; cleared on tab close; only needed for current session |
| Monarch password | sessionStorage (encrypted) | None | Highly sensitive; encrypted; cleared on tab close |
| Accounts (YNAB/CSV) | IndexedDB | Memory (`state.accounts`) | Large dataset; needs persistence; queryable |
| Transactions | IndexedDB | Memory | Large dataset; needs persistence; queryable |
| Upload status | IndexedDB | Memory | Track retry state; survives page reload |
| UI theme preference | localStorage | Default | Doesn't change often; can lose without issue |
| Current upload progress | sessionStorage | Memory | Tab-specific state; ok to lose on refresh |

---

## Implementation Checklist

When adding new data storage to the app:

- [ ] Identify sensitivity level (public, internal, secret)
- [ ] Choose appropriate storage:
  - Secret credentials → HttpOnly cookies
  - Sensitive temporary data → sessionStorage (encrypted if needed)
  - Structured persistent data → IndexedDB
  - Simple preferences → localStorage
- [ ] Document in this file
- [ ] Add CRUD operations to `StorageManager` or utility class
- [ ] Add error handling for quota exceeded and unavailable storage
- [ ] Test in browser DevTools (inspect cookies, sessionStorage, IndexedDB)
- [ ] Test data survives tab close / browser restart (as applicable)
- [ ] Test data is cleared on logout

---

## Security Considerations

### XSS (Cross-Site Scripting)

| Storage | Protection |
|---|---|
| HttpOnly Cookies | ✅ Not accessible to JavaScript (immune to XSS for token access) |
| sessionStorage | ⚠️ Accessible to JavaScript (vulnerable if XSS exists) → encrypt sensitive data |
| localStorage | ⚠️ Accessible to JavaScript (vulnerable if XSS exists) → only store non-sensitive data |
| IndexedDB | ⚠️ Accessible to JavaScript (vulnerable if XSS exists) → validate data before use |

**Mitigation:** Sanitize all user inputs and use CSP (Content Security Policy) headers.

### CSRF (Cross-Site Request Forgery)

| Storage | Protection |
|---|---|
| HttpOnly Cookies | ✅ SameSite=Strict attribute prevents CSRF |
| Netlify Functions | ✅ Check Origin/Referer headers if needed |

### Session Hijacking

| Storage | Protection |
|---|---|
| HttpOnly Cookies | ✅ Secure flag (HTTPS only) + SameSite |
| sessionStorage | ⚠️ Accessible if attacker has JavaScript execution; cleared on tab close |

### Data Leakage

| Storage | Protection |
|---|---|
| HttpOnly Cookies | ✅ Not logged in console; not sent to third-party domains |
| Encrypted sessionStorage | ✅ Password encrypted; key not stored |
| IndexedDB | ⚠️ Unencrypted; use for non-sensitive data only |

---

## Testing Storage

### Browser DevTools

```javascript
// Check cookies
document.cookie // Shows non-HttpOnly cookies only

// Check sessionStorage
sessionStorage.getItem('monarch_email')

// Check localStorage
localStorage.getItem('theme_preference')

// Check IndexedDB
// Open DevTools → Application → IndexedDB → YnabToMonarchDB
```

### Programmatic Tests

```javascript
// Test IndexedDB
import FinancialDataDB from './utils/indexedDB.js';
const db = new FinancialDataDB();
await db.init();
await db.saveAccounts([{ id: '1', name: 'Checking', balance: 1000 }]);
const accounts = await db.getAccounts();
console.assert(accounts.length === 1);

// Test sessionStorage encryption
import { encryptPassword, decryptPassword } from './shared/crypto.js';
const original = 'secretPassword123';
const encrypted = await encryptPassword('user@example.com', original);
const decrypted = await decryptPassword('user@example.com', encrypted);
console.assert(original === decrypted);

// Test HTTP-only cookies (via Network tab in DevTools)
// 1. Log in to YNAB
// 2. Check Network tab for ynabTokenExchange request
// 3. Inspect Response Headers for Set-Cookie with HttpOnly flag
// 4. Verify ynab_access_token is NOT visible in Application → Cookies
```

---

## Related Files

- **OAuth Tokens:** `netlify/functions/ynabTokenExchange.cjs`, `ynabTokenRefresh.cjs`, `ynabProxy.cjs`
- **Token Management:** `src/api/ynabTokens.js`
- **IndexedDB:** `src/utils/indexedDB.js`
- **Encryption:** `shared/crypto.js`, `shared/cryptoSpec.js`
- **State Management:** `src/state.js`
- **Router/Persistence:** `src/router.js`
- **Data Loading:** `src/views/Upload/uploadData.js`, `upload.js`

---

## Revision History

| Date | Changes | Author |
|---|---|---|
| 2025-12-21 | Initial document; defined all storage mechanisms and flows | Copilot |
