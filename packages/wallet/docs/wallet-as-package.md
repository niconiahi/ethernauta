# Wallet as Package: @cryptoman/wallet Library Design

## Overview

This document outlines the comprehensive plan for transforming `@cryptoman/wallet` into a clean library package that provides simple `connect()` and `sign()` functions, integrating MetaMask SDK for enhanced wallet connectivity.

**Target API:**
```typescript
const {connect, sign} from '@cryptoman/wallet'

await connect()
const signed_transaction = sign("transfer", ['0xa', '0xb', 3])
```

## Part 1: Library API Design & MetaMask SDK Integration

### Current State Analysis
- `packages/wallet` exists as a Chrome extension with Preact UI
- Has crypto utilities (`crypto.ts`, `vault.ts`) for mnemonic/key management  
- Contains extension-specific files (manifest, popup UI, etc.)
- Documentation shows plans for extension-to-web communication

### Implementation Plan

#### 1. New Library Structure
Move extension files to `packages/extension` and transform `packages/wallet` into a clean library:

```
packages/
├── extension/          # Moved from wallet
│   ├── src/
│   ├── manifest.json
│   └── ...extension files
├── wallet/             # New library
│   ├── src/
│   │   ├── index.ts         # Main exports
│   │   ├── wallet-api.ts    # connect() & sign()  
│   │   ├── providers/
│   │   │   └── metamask.ts  # MetaMask SDK integration
│   │   └── utils/           # Existing crypto utilities
│   └── package.json    # Library configuration
└── ...other packages
```

#### 2. Core API Implementation

**Main Export (`src/index.ts`):**
```typescript
export { connect, sign } from './wallet-api'
```

**API Implementation (`src/wallet-api.ts`):**
```typescript
import { MetaMaskSDK } from '@metamask/sdk'

let mmsdk: MetaMaskSDK | null = null
let provider: any = null

export async function connect(): Promise<{address: string}> {
  if (!mmsdk) {
    mmsdk = new MetaMaskSDK({
      dappMetadata: {
        name: "Cryptoman Wallet",
        url: window.location.href,
      }
    })
  }

  provider = mmsdk.getProvider()
  const accounts = await provider.request({
    method: 'eth_requestAccounts'
  })

  return { address: accounts[0] }
}

export async function sign(method: string, params: any[]): Promise<string> {
  if (!provider) {
    throw new Error('Not connected. Call connect() first.')
  }

  // Handle different signing methods
  switch (method) {
    case 'transfer':
    case 'eth_sendTransaction':
      return await provider.request({
        method: 'eth_sendTransaction',
        params: params
      })
    
    case 'personal_sign':
      return await provider.request({
        method: 'personal_sign',
        params: params
      })
    
    case 'eth_signTypedData_v4':
      return await provider.request({
        method: 'eth_signTypedData_v4',
        params: params
      })
    
    default:
      return await provider.request({
        method: method,
        params: params
      })
  }
}
```

#### 3. MetaMask SDK Benefits

The MetaMask SDK provides several advantages over direct `window.ethereum` access:
- **Enhanced Security**: Structured connection management with built-in validation
- **Cross-platform Support**: Works across web, mobile, and React Native
- **Better Developer Experience**: Cleaner API with metadata management
- **Future-proof**: Uses latest MetaMask connection standards (EIP-6963)
- **Maintains Security**: Still uses the secure injected provider under the hood

#### 4. Package Configuration

**Updated `package.json`:**
```json
{
  "name": "@cryptoman/wallet",
  "type": "module",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "dependencies": {
    "@metamask/sdk": "^0.28.0",
    "@preact/signals": "^2.2.1"
  }
}
```

## Part 2: Extension Communication Architecture (Legacy)

*Note: This section documents the previous extension-focused approach for reference.*

### Architecture Overview
Simple signing-only wallet: receives `{ method, params }` → user approves → returns signature. No method interpretation or transaction building.

### Implementation Components

#### 1. Extension Manifest (manifest.json)
Chrome extension configuration file that defines permissions and components.

- **`permissions: ["storage"]`** - Only needs storage access for vault operations
- **`action.default_popup`** - Points to existing wallet popup UI
- **`content_scripts`** - Injects content.js into all web pages at document start
- **`web_accessible_resources`** - Allows content script to load injected.js into page context
- **No background script** - Direct content-to-popup communication eliminates need for service worker

```json
{
  "manifest_version": 3,
  "name": "Cryptoman Signing Wallet",
  "version": "1.0.0",
  "description": "A secure signing wallet for blockchain transactions",
  "permissions": ["storage"],
  "action": {
    "default_popup": "index.html",
    "default_title": "Cryptoman Wallet"
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

#### 2. Content Script (content.js)
Bridge between web page and extension. Runs in isolated context for security.

- **Script injection** - Dynamically loads injected.js into the page's main JavaScript context
- **Message forwarding** - Listens for signing requests from injected script and forwards to popup
- **Security isolation** - Cannot directly access page variables, communicates via postMessage

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

#### 3. Injected Script (injected.js)
Creates the wallet API that web applications interact with. Runs in page's main context.

```typescript
window.cryptoman = {
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

## Part 3: Detailed Connection Implementation (Legacy)

*Note: This section contains the comprehensive extension implementation plan for reference.*

### Web Application Interface

Web applications interact through a global API:

```typescript
// Check if Cryptoman is available
if (window.cryptoman) {
  // Connect to the wallet
  const wallet = await window.cryptoman.connect()
  
  // Sign a transaction
  const signedTx = await wallet.signTransaction({
    method: 'eth_sendTransaction',
    params: [{
      to: '0x742d35Cc6435C532532cAA080CA99eE4a27B3Cb5',
      value: '0x1000000000000000000', // 1 ETH in wei
      gas: '0x5208', // 21000
      gasPrice: '0x4A817C800' // 20 Gwei
    }]
  })
  
  // Developer broadcasts using their preferred client
  const txHash = await myJsonRpcClient.sendRawTransaction(signedTx)
}
```

### Supported Methods

Initial implementation supports:
- `eth_sendTransaction` - Sign Ethereum transactions
- `personal_sign` - Sign arbitrary messages
- `eth_signTypedData_v4` - Sign typed data (EIP-712)

### Content Script Implementation

```typescript
interface CryptomanAPI {
  connect(): Promise<CryptomanWallet>
  isConnected(): boolean
}

interface CryptomanWallet {
  address: string
  signTransaction(request: SignRequest): Promise<string>
  signMessage(message: string): Promise<string>
  signTypedData(data: TypedData): Promise<string>
}

class CryptomanContentScript {
  private connected = false
  private address = ''
  
  constructor() {
    this.injectAPI()
    this.setupMessageListener()
  }
  
  private injectAPI() {
    const script = document.createElement('script')
    script.textContent = `
      window.cryptoman = {
        connect: () => window.postMessage({ 
          type: 'CRYPTOMAN_CONNECT_REQUEST' 
        }, '*'),
        isConnected: () => ${this.connected}
      }
    `
    document.head.appendChild(script)
  }
  
  private setupMessageListener() {
    window.addEventListener('message', (event) => {
      if (event.data.type?.startsWith('CRYPTOMAN_')) {
        this.handleWebAppMessage(event.data)
      }
    })
    
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleExtensionMessage(message, sendResponse)
    })
  }
}
```

### Background Script Implementation

```typescript
interface PendingRequest {
  id: string
  type: 'CONNECT' | 'SIGN'
  origin: string
  data?: any
  resolve: (value: any) => void
  reject: (error: any) => void
}

class CryptomanBackground {
  private pendingRequests = new Map<string, PendingRequest>()
  private connectedOrigins = new Set<string>()
  
  private async handleConnectRequest(
    message: any, 
    origin: string, 
    sendResponse: (response: any) => void
  ) {
    if (this.connectedOrigins.has(origin)) {
      sendResponse({ success: true, address: await this.getWalletAddress() })
      return
    }
    
    const requestId = this.generateRequestId()
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, {
        id: requestId,
        type: 'CONNECT',
        origin,
        resolve,
        reject
      })
      
      chrome.action.openPopup()
      
      chrome.runtime.sendMessage({
        type: 'APPROVAL_REQUEST',
        requestId,
        requestType: 'CONNECT',
        origin,
        data: { origin }
      })
    })
  }
}
```

### Transaction Signing Implementation

```typescript
import { keccak_256 } from "@noble/hashes/sha3"
import { secp256k1 } from "@noble/curves/secp256k1"

export function sign_ethereum_transaction(
  transaction: TransactionData,
  privateKey: Uint8Array
): string {
  // RLP encode the transaction
  const rlpEncoded = rlp_encode_transaction(transaction)
  
  // Hash the encoded transaction
  const hash = keccak_256(rlpEncoded)
  
  // Sign the hash
  const signature = secp256k1.sign(hash, privateKey)
  
  // Add recovery ID for Ethereum
  const v = signature.recovery + (transaction.chainId ? transaction.chainId * 2 + 35 : 27)
  
  // RLP encode with signature
  const signedTransaction = rlp_encode_signed_transaction(
    transaction,
    v,
    signature.r,
    signature.s
  )
  
  return '0x' + to_hex(signedTransaction)
}
```

## Security Considerations

1. **Origin Validation** - Always validate the requesting origin
2. **User Approval** - Every transaction requires explicit user approval
3. **Secure Storage** - Private keys remain encrypted in IndexedDB
4. **Message Validation** - Validate all messages between components
5. **MetaMask SDK Security** - Leverages MetaMask's built-in security features
6. **Provider Isolation** - SDK maintains secure provider access patterns

## Migration Strategy

### Phase 1: Library Creation
1. Create new library structure in `packages/wallet`
2. Implement `connect()` and `sign()` functions with MetaMask SDK
3. Add comprehensive tests and documentation

### Phase 2: Extension Separation
1. Move extension code to `packages/extension`
2. Update build processes and configurations
3. Maintain backward compatibility during transition

### Phase 3: Integration & Testing
1. Test library with sample applications
2. Verify MetaMask SDK integration works correctly
3. Document usage patterns and best practices

## Conclusion

This comprehensive approach transforms the Cryptoman wallet from an extension-only solution into a versatile library that can be used across different web applications. The MetaMask SDK integration provides enhanced security and developer experience while maintaining the core principle of secure transaction signing.

The library approach offers several key benefits:
- **Simple API**: Clean `connect()` and `sign()` interface
- **Enhanced Security**: Leverages MetaMask SDK's built-in protections
- **Flexibility**: Can be used in any web application
- **Future-proof**: Built on modern wallet connection standards
- **Maintainable**: Clear separation of concerns between library and extension