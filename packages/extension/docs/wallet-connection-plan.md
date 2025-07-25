# Wallet Connection Plan

## Overview

This document outlines the implementation plan for connecting the Cryptoman extension with web applications. The core principle is **signing-only**: the extension securely signs transactions while web applications handle broadcasting via their preferred JSON-RPC clients.

## Architecture

### Core Components

```
Web Application → Content Script → Background Script → Extension UI → User Approval → Signing → Response Chain
```

1. **Content Script** - Injects API into web pages and bridges communication
2. **Background Script** - Routes messages and manages connection state  
3. **Extension UI** - Shows approval interface for transaction signing
4. **Message Passing** - Chrome extension messaging for secure communication

## API Design

### Web Application Interface

Web applications will interact with the extension through a simple global API:

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

Initial implementation will support:
- `eth_sendTransaction` - Sign Ethereum transactions
- `personal_sign` - Sign arbitrary messages
- `eth_signTypedData_v4` - Sign typed data (EIP-712)

## Implementation Plan

### 1. Content Script (`src/content-script.ts`)

Injects the Cryptoman API into web pages and handles communication:

```typescript
// Injected API interface
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

interface SignRequest {
  method: string
  params: any[]
}

// Content script implementation
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
  
  private async handleWebAppMessage(message: any) {
    switch (message.type) {
      case 'CRYPTOMAN_CONNECT_REQUEST':
        const response = await chrome.runtime.sendMessage({
          type: 'CONNECT_REQUEST',
          origin: window.location.origin
        })
        window.postMessage({
          type: 'CRYPTOMAN_CONNECT_RESPONSE',
          data: response
        }, '*')
        break
        
      case 'CRYPTOMAN_SIGN_REQUEST':
        const signResponse = await chrome.runtime.sendMessage({
          type: 'SIGN_REQUEST',
          data: message.data,
          origin: window.location.origin
        })
        window.postMessage({
          type: 'CRYPTOMAN_SIGN_RESPONSE',
          data: signResponse
        }, '*')
        break
    }
  }
}

new CryptomanContentScript()
```

### 2. Background Script (`src/background.ts`)

Routes messages between content script and extension UI:

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
  
  constructor() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      this.handleMessage(message, sender, sendResponse)
      return true // Keep message channel open for async responses
    })
  }
  
  private async handleMessage(
    message: any, 
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ) {
    const origin = sender.tab?.url ? new URL(sender.tab.url).origin : ''
    
    switch (message.type) {
      case 'CONNECT_REQUEST':
        await this.handleConnectRequest(message, origin, sendResponse)
        break
        
      case 'SIGN_REQUEST':
        await this.handleSignRequest(message, origin, sendResponse)
        break
        
      case 'USER_RESPONSE':
        this.handleUserResponse(message)
        break
    }
  }
  
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
      
      // Open extension popup for user approval
      chrome.action.openPopup()
      
      // Send request to extension UI
      chrome.runtime.sendMessage({
        type: 'APPROVAL_REQUEST',
        requestId,
        requestType: 'CONNECT',
        origin,
        data: { origin }
      })
    }).then(result => {
      if (result.approved) {
        this.connectedOrigins.add(origin)
      }
      sendResponse(result)
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
  }
  
  private async handleSignRequest(
    message: any, 
    origin: string, 
    sendResponse: (response: any) => void
  ) {
    if (!this.connectedOrigins.has(origin)) {
      sendResponse({ success: false, error: 'Not connected' })
      return
    }
    
    const requestId = this.generateRequestId()
    
    return new Promise((resolve, reject) => {
      this.pendingRequests.set(requestId, {
        id: requestId,
        type: 'SIGN',
        origin,
        data: message.data,
        resolve,
        reject
      })
      
      // Open extension popup for user approval
      chrome.action.openPopup()
      
      // Send request to extension UI
      chrome.runtime.sendMessage({
        type: 'APPROVAL_REQUEST',
        requestId,
        requestType: 'SIGN',
        origin,
        data: message.data
      })
    }).then(result => {
      sendResponse(result)
    }).catch(error => {
      sendResponse({ success: false, error: error.message })
    })
  }
  
  private generateRequestId(): string {
    return Math.random().toString(36).substring(2, 15)
  }
  
  private async getWalletAddress(): Promise<string> {
    // This will be implemented to get address from vault
    return '0x...'
  }
}

new CryptomanBackground()
```

### 3. Extension UI Updates

#### New View: Connection Approval (`src/views/connection/index.tsx`)

```tsx
import { useState } from 'preact/hooks'

interface ConnectionApprovalProps {
  origin: string
  onApprove: () => void
  onReject: () => void
}

export function ConnectionApproval({ origin, onApprove, onReject }: ConnectionApprovalProps) {
  return (
    <div class="approval-container">
      <h2>Connection Request</h2>
      <p>
        <strong>{origin}</strong> wants to connect to your wallet
      </p>
      <div class="approval-actions">
        <button onClick={onReject} class="reject-button">
          Reject
        </button>
        <button onClick={onApprove} class="approve-button">
          Connect
        </button>
      </div>
    </div>
  )
}
```

#### New View: Transaction Approval (`src/views/transaction-approval/index.tsx`)

```tsx
import { useState } from 'preact/hooks'

interface TransactionData {
  to: string
  value: string
  gas: string
  gasPrice: string
  data?: string
}

interface TransactionApprovalProps {
  origin: string
  transaction: TransactionData
  onApprove: () => void
  onReject: () => void
}

export function TransactionApproval({ 
  origin, 
  transaction, 
  onApprove, 
  onReject 
}: TransactionApprovalProps) {
  const valueInEth = parseFloat(transaction.value) / 1e18
  
  return (
    <div class="approval-container">
      <h2>Transaction Request</h2>
      <p>
        <strong>{origin}</strong> wants to send a transaction
      </p>
      
      <div class="transaction-details">
        <div class="detail-row">
          <span>To:</span>
          <span class="address">{transaction.to}</span>
        </div>
        <div class="detail-row">
          <span>Value:</span>
          <span>{valueInEth} ETH</span>
        </div>
        <div class="detail-row">
          <span>Gas:</span>
          <span>{parseInt(transaction.gas, 16)}</span>
        </div>
        <div class="detail-row">
          <span>Gas Price:</span>
          <span>{parseInt(transaction.gasPrice, 16) / 1e9} Gwei</span>
        </div>
        {transaction.data && (
          <div class="detail-row">
            <span>Data:</span>
            <span class="data">{transaction.data}</span>
          </div>
        )}
      </div>
      
      <div class="approval-actions">
        <button onClick={onReject} class="reject-button">
          Reject
        </button>
        <button onClick={onApprove} class="approve-button">
          Sign Transaction
        </button>
      </div>
    </div>
  )
}
```

#### Updated Controller (`src/controller.tsx`)

```tsx
import { useEffect, useState } from "preact/hooks"
import { Password } from "./views/password/index.tsx"
import { Wallet } from "./views/wallet/index.tsx"
import { Mnemonics } from "./views/mnemonics/index.tsx"
import { ConnectionApproval } from "./views/connection/index.tsx"
import { TransactionApproval } from "./views/transaction-approval/index.tsx"
import { vault_exists } from "./utils/vault.ts"
import { view } from "./utils/view.ts"

interface ApprovalRequest {
  requestId: string
  requestType: 'CONNECT' | 'SIGN'
  origin: string
  data: any
}

export function Controller() {
  const [approvalRequest, setApprovalRequest] = useState<ApprovalRequest | null>(null)

  useEffect(() => {
    async function run() {
      const exists = await vault_exists()
      if (!exists) {
        view.value = "mnemonics"
      }
    }
    run()

    // Listen for approval requests from background script
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.type === 'APPROVAL_REQUEST') {
        setApprovalRequest(message)
      }
    })
  }, [])

  const handleApproval = async (approved: boolean) => {
    if (!approvalRequest) return

    if (approved && approvalRequest.requestType === 'SIGN') {
      // Sign the transaction
      const signedTx = await signTransaction(approvalRequest.data)
      chrome.runtime.sendMessage({
        type: 'USER_RESPONSE',
        requestId: approvalRequest.requestId,
        approved: true,
        data: { signedTransaction: signedTx }
      })
    } else {
      chrome.runtime.sendMessage({
        type: 'USER_RESPONSE',
        requestId: approvalRequest.requestId,
        approved,
        data: approved ? { address: '0x...' } : null
      })
    }
    
    setApprovalRequest(null)
  }

  // Show approval UI if there's a pending request
  if (approvalRequest) {
    if (approvalRequest.requestType === 'CONNECT') {
      return (
        <ConnectionApproval
          origin={approvalRequest.origin}
          onApprove={() => handleApproval(true)}
          onReject={() => handleApproval(false)}
        />
      )
    } else if (approvalRequest.requestType === 'SIGN') {
      return (
        <TransactionApproval
          origin={approvalRequest.origin}
          transaction={approvalRequest.data.params[0]}
          onApprove={() => handleApproval(true)}
          onReject={() => handleApproval(false)}
        />
      )
    }
  }

  return <>{render_view(view.value)}</>
}

function render_view(view: string) {
  switch (view) {
    case "mnemonics": {
      return <Mnemonics />
    }
    case "password": {
      return <Password />
    }
    case "wallet": {
      return <Wallet />
    }
    default: {
      return <div>there is no view for: {view}</div>
    }
  }
}

async function signTransaction(signRequest: any): Promise<string> {
  // This will be implemented to actually sign the transaction
  // using the private key from the vault
  return '0x...' // signed transaction hex
}
```

### 4. Transaction Signing Implementation (`src/utils/signer.ts`)

```typescript
import { keccak_256 } from "@noble/hashes/sha3"
import { secp256k1 } from "@noble/curves/secp256k1"
import { to_hex } from "./crypto"

interface TransactionData {
  to: string
  value: string
  gas: string
  gasPrice: string
  nonce: string
  data?: string
  chainId?: number
}

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

function rlp_encode_transaction(tx: TransactionData): Uint8Array {
  // Simplified RLP encoding - would use proper RLP library in production
  // This is just to show the structure
  const fields = [
    tx.nonce,
    tx.gasPrice,
    tx.gas,
    tx.to,
    tx.value,
    tx.data || '0x'
  ]
  
  // In real implementation, use proper RLP encoding
  return new Uint8Array() // placeholder
}

function rlp_encode_signed_transaction(
  tx: TransactionData,
  v: number,
  r: bigint,
  s: bigint
): Uint8Array {
  // Include signature fields in RLP encoding
  const fields = [
    tx.nonce,
    tx.gasPrice,
    tx.gas,
    tx.to,
    tx.value,
    tx.data || '0x',
    v.toString(16),
    r.toString(16),
    s.toString(16)
  ]
  
  // In real implementation, use proper RLP encoding
  return new Uint8Array() // placeholder
}
```

### 5. Manifest.json Updates

```json
{
  "manifest_version": 3,
  "name": "@walle/wallet",
  "version": "0.0.1",
  "description": "A wallet browser extension that only signs",
  "action": {
    "default_popup": "index.html"
  },
  "permissions": [
    "storage",
    "activeTab"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content-script.js"],
      "run_at": "document_start"
    }
  ],
  "web_accessible_resources": [
    {
      "matches": ["<all_urls>"],
      "resources": ["injected-script.js"]
    }
  ]
}
```

## Security Considerations

1. **Origin Validation** - Always validate the requesting origin
2. **User Approval** - Every transaction requires explicit user approval
3. **Secure Storage** - Private keys remain encrypted in IndexedDB
4. **Message Validation** - Validate all messages between components
5. **CSP Headers** - Use Content Security Policy in extension

## Testing Strategy

1. **Unit Tests** - Test signing functions and message passing
2. **Integration Tests** - Test full flow from web app to extension
3. **E2E Tests** - Test with real web applications
4. **Security Audit** - Review all message passing and validation logic

## Development Steps

1. Implement content script and background script
2. Update extension UI with approval views
3. Add transaction signing functionality
4. Update manifest.json with new permissions
5. Test with sample web application
6. Create developer documentation and examples

## Future Enhancements

- Support for multiple accounts
- Hardware wallet integration
- Advanced transaction analysis
- Batch transaction signing
- Custom network support