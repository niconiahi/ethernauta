# Signing Wallet Extension Plan

## Architecture Overview
Simple signing-only wallet: receives `{ method, params }` → user approves → returns signature. No method interpretation or transaction building.

## Implementation

### 1. Extension Manifest (manifest.json)
Chrome extension configuration file that defines permissions and components.

- **`permissions: ["storage"]`** - Only needs storage access for vault operations
- **`action.default_popup`** - Points to existing wallet popup UI
- **`content_scripts`** - Injects content.js into all web pages at document start
- **`web_accessible_resources`** - Allows content script to load injected.js into page context
- **No background script** - Direct content-to-popup communication eliminates need for service worker

```json
{
  "manifest_version": 3,
  "name": "Morfar Signing Wallet",
  "version": "1.0.0",
  "description": "A secure signing wallet for blockchain transactions",
  "permissions": ["storage"],
  "action": {
    "default_popup": "index.html",
    "default_title": "Morfar Wallet"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_start"
  }],
  "web_accessible_resources": [{
    "resources": ["injected.js"],
    "matches": ["<all_urls>"]
  }]
}
```

### 2. Content Script (content.js)
Bridge between web page and extension. Runs in isolated context for security.

- **Script injection** - Dynamically loads injected.js into the page's main JavaScript context
- **Message forwarding** - Listens for signing requests from injected script and forwards to popup
- **Security isolation** - Cannot directly access page variables, communicates via postMessage
- **`chrome.runtime.getURL()`** - Gets proper extension URL for injected.js file
- **Event filtering** - Only processes messages from same window with correct type

```typescript
// Inject the signing API into the page
const script = document.createElement('script')
script.src = chrome.runtime.getURL('injected.js')
script.onload = () => script.remove()
;(document.head || document.documentElement).appendChild(script)

// Forward signing requests to popup
window.addEventListener('message', (event) => {
  if (event.source !== window) return
  if (event.data?.type === 'SIGN') {
    chrome.runtime.sendMessage(event.data)
  }
})
```

### 3. Injected Script (injected.js)
Creates the wallet API that web applications interact with. Runs in page's main context.

- **`window.ethereum`** - Standard wallet interface that dApps expect to find
- **`isMorfar: true`** - Identifies this wallet (similar to isMetaMask)
- **Single `sign()` method** - Only API needed, takes any method/params and returns signature
- **Promise-based** - Modern async/await compatible interface
- **Unique request IDs** - Matches responses to requests using random identifiers
- **Event cleanup** - Removes message listeners after receiving response to prevent memory leaks
- **Error handling** - Properly rejects promise if signing fails or user cancels

```typescript
window.walle = {
  sign: async (method, params) => {
    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36)
      window.addEventListener('message', function handler(event) {
        if (event.data?.id === id) {
          window.removeEventListener('message', handler)
          if (event.data.error) {
            reject(new Error(event.data.error))
          }
          resolve(event.data.signature)
        }
      })
      window.postMessage({
        type: 'SIGN',
        id,
        method,
        params
      }, '*')
    })
  }
}
```

### 4. Build Configuration
Configures Vite to build multiple entry points for the extension components.

- **Multiple inputs** - Builds popup (existing), content script, and injected script separately
- **Separate bundles** - Each script runs in different context, needs own bundle
- **Manifest copying** - Moves manifest.json from public/ to dist/ after build
- **Extension packaging** - Creates zip file ready for Chrome Web Store upload

Update `vite.config.ts`:
```typescript
rollupOptions: {
  input: {
    popup: resolve(__dirname, 'src/index.html'),
    content: resolve(__dirname, 'src/content.ts'),
    injected: resolve(__dirname, 'src/injected.ts')
  }
}
```

Update build script in `package.json`:
```json
{
  "scripts": {
    "build": "vite build && cp public/manifest.json dist/ && cd dist && zip -r ../extension.zip ."
  }
}
```

## Communication Flow
Complete request/response cycle from web page to wallet and back.

1. **Web page calls** `window.walle.sign(method, params)` - dApp initiates signing request
2. **Injected script** creates unique ID and posts message to content script via `window.postMessage`
3. **Content script** receives message, validates source, forwards to popup via `chrome.runtime.sendMessage`
4. **Popup opens** (if closed) and shows approval UI with method/params to user
5. **User decision** - approves (sign with crypto utils) or rejects (return error)
6. **Response travels back** - popup → content script → injected script → resolves Promise

## Popup Integration
Extends existing wallet to handle extension messages without disrupting current functionality.

- **Message listener** - Adds `chrome.runtime.onMessage` handler alongside existing code
- **Request filtering** - Only processes `SIGN` type messages
- **Crypto integration** - Uses existing `src/utils/crypto.ts` functions for actual signing
- **UI integration** - Shows approval dialog within current XState-managed interface
- **Response handling** - Calls `sendResponse()` with signature or error message

```typescript
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'SIGN') {
    // Show approval UI with request.method and request.params
    // On user approval: sign using existing crypto utils
    // sendResponse({ signature }) or sendResponse({ error })
  }
})
```
