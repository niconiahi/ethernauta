# Transaction Tracking System

## Overview

This document describes the comprehensive transaction tracking system for Cryptoman that provides real-time monitoring of blockchain transactions from submission to final confirmation.

## Transaction States

The system defines four distinct transaction states, each with specific data guarantees and no optional fields:

### 1. `pending` - Transaction Submitted
**When**: Transaction submitted to mempool, waiting to be mined  
**Duration**: Seconds to minutes (depending on gas price and network congestion)  
**Data Available**:
- `hash` - Transaction hash
- `result` - Generic result field (contains the transaction hash)
- `status` - "pending"

### 2. `mined` - Transaction Included in Block
**When**: Transaction included in a block but not yet considered "safe"  
**Duration**: 0-12 blocks (until confirmed)  
**Data Available**:
- `hash` - Transaction hash
- `result` - Generic result field
- `status` - "mined"
- `blockNumber` - Block number where transaction was mined
- `blockHash` - Hash of the block containing the transaction
- `gasUsed` - Amount of gas consumed

### 3. `confirmed` - Transaction Confirmed
**When**: Transaction has sufficient confirmations (typically 12+ blocks)  
**Duration**: Final success state  
**Data Available**:
- `hash` - Transaction hash
- `result` - Generic result field
- `status` - "confirmed"
- `blockNumber` - Block number where transaction was mined
- `blockHash` - Hash of the block containing the transaction
- `gasUsed` - Amount of gas consumed
- `confirmations` - Number of confirmations

### 4. `reverted` - Transaction Failed
**When**: Transaction was mined but execution failed  
**Duration**: Final failure state  
**Data Available**:
- `hash` - Transaction hash
- `result` - Generic result field
- `status` - "reverted"
- `blockNumber` - Block number where transaction was mined
- `blockHash` - Hash of the block containing the transaction
- `gasUsed` - Amount of gas consumed (gas is consumed even on failure)
- `error` - Error message describing the failure

## Implementation

### Transaction Schemas

```typescript
import * as v from "valibot"

// 1. PENDING - Just submitted to mempool
export const PendingTransactionSchema = v.object({
  hash: v.string(),
  status: v.literal("pending"),
})

// 2. MINED - Included in block but not confirmed
export const MinedTransactionSchema = v.object({
  hash: v.string(),
  status: v.literal("mined"),
  blockNumber: v.number(),
  blockHash: v.string(),
  gasUsed: v.string(),
  result: v.any(),
})

// 3. CONFIRMED - Has sufficient confirmations
export const ConfirmedTransactionSchema = v.object({
  hash: v.string(),
  status: v.literal("confirmed"),
  blockNumber: v.number(),
  blockHash: v.string(),
  gasUsed: v.string(),
  confirmations: v.number(),
  result: v.any(),
})

// 4. REVERTED - Mined but execution failed
export const RevertedTransactionSchema = v.object({
  hash: v.string(),
  status: v.literal("reverted"),
  blockNumber: v.number(),
  blockHash: v.string(),
  gasUsed: v.string(),
  error: v.string(),
})

// Union of all transaction types
export const TransactionSchema = v.union([
  PendingTransactionSchema,
  MinedTransactionSchema,
  ConfirmedTransactionSchema,
  RevertedTransactionSchema,
])

export type PendingTransaction = v.InferOutput<typeof PendingTransactionSchema>
export type MinedTransaction = v.InferOutput<typeof MinedTransactionSchema>
export type ConfirmedTransaction = v.InferOutput<typeof ConfirmedTransactionSchema>
export type RevertedTransaction = v.InferOutput<typeof RevertedTransactionSchema>
export type Transaction = v.InferOutput<typeof TransactionSchema>
```

### State Transition Functions

```typescript
export function mark_transaction_as_mined(
  hash: `0x${string}`,
  data: { blockNumber: number; blockHash: string; gasUsed: string }
): MinedTransaction | null {
  const current = window.transactions.get(hash)
  if (!current || current.status !== "pending") return null
  
  const mined: MinedTransaction = {
    hash: current.hash,
    result: current.result,
    status: "mined",
    blockNumber: data.blockNumber,
    blockHash: data.blockHash,
    gasUsed: data.gasUsed,
  }
  
  window.transactions.set(hash, mined)
  dispatch_transaction_update(hash, mined)
  return mined
}

export function mark_transaction_as_confirmed(
  hash: `0x${string}`,
  confirmations: number
): ConfirmedTransaction | null {
  const current = window.transactions.get(hash)
  if (!current || current.status !== "mined") return null
  
  const mined = current as MinedTransaction
  const confirmed: ConfirmedTransaction = {
    ...mined,
    status: "confirmed",
    confirmations,
  }
  
  window.transactions.set(hash, confirmed)
  dispatch_transaction_update(hash, confirmed)
  return confirmed
}

export function mark_transaction_as_reverted(
  hash: `0x${string}`,
  data: { blockNumber: number; blockHash: string; gasUsed: string; error: string }
): RevertedTransaction | null {
  const current = window.transactions.get(hash)
  if (!current || current.status !== "pending") return null
  
  const reverted: RevertedTransaction = {
    hash: current.hash,
    result: current.result,
    status: "reverted",
    blockNumber: data.blockNumber,
    blockHash: data.blockHash,
    gasUsed: data.gasUsed,
    error: data.error,
  }
  
  window.transactions.set(hash, reverted)
  dispatch_transaction_update(hash, reverted)
  return reverted
}
```

### Monitoring System

The monitoring system uses Ethereum-standard RPC polling to track transaction status changes:

```typescript
const POLLING_INTERVAL = 2000 // 2 seconds
const MAX_POLL_TIME = 300000 // 5 minutes
const CONFIRMATION_BLOCKS = 12

export async function start_transaction_monitoring(
  hash: `0x${string}`,
  transports: Http[],
) {
  const start_time = Date.now()
  
  const poll_receipt = async () => {
    try {
      const call = ["eth_getTransactionReceipt", [hash]]
      const response = await Promise.any(
        transports.map(transport => transport(call))
      )
      
      if ("error" in response || !response.result) {
        return null // Still pending
      }
      
      const receipt = response.result
      const blockNumber = parseInt(receipt.blockNumber, 16)
      const gasUsed = receipt.gasUsed
      const blockHash = receipt.blockHash
      
      if (receipt.status === "0x1") {
        // Success - mark as mined
        mark_transaction_as_mined(hash, { blockNumber, blockHash, gasUsed })
        
        // Start confirmation tracking
        track_confirmations(hash, blockNumber, transports)
      } else {
        // Failure - mark as reverted
        mark_transaction_as_reverted(hash, {
          blockNumber,
          blockHash, 
          gasUsed,
          error: "Transaction reverted"
        })
      }
      return receipt
    } catch (error) {
      return null
    }
  }
  
  const interval = setInterval(async () => {
    const receipt = await poll_receipt()
    
    if (receipt) {
      clearInterval(interval)
      return
    }
    
    // Timeout check
    if (Date.now() - start_time > MAX_POLL_TIME) {
      clearInterval(interval)
      // Could mark as dropped/timeout here
    }
  }, POLLING_INTERVAL)
}

async function track_confirmations(
  hash: `0x${string}`,
  mined_block: number,
  transports: Http[]
) {
  const check_confirmations = async () => {
    try {
      const call = ["eth_blockNumber", []]
      const response = await Promise.any(
        transports.map(transport => transport(call))
      )
      
      if ("error" in response) return 0
      
      const current_block = parseInt(response.result, 16)
      const confirmations = current_block - mined_block + 1
      
      if (confirmations >= CONFIRMATION_BLOCKS) {
        mark_transaction_as_confirmed(hash, confirmations)
        return confirmations
      }
      
      return 0
    } catch {
      return 0
    }
  }
  
  const interval = setInterval(async () => {
    const confirmations = await check_confirmations()
    if (confirmations >= CONFIRMATION_BLOCKS) {
      clearInterval(interval)
    }
  }, POLLING_INTERVAL)
}
```

### Event System

The system provides a reactive event system for watching transaction changes:

```typescript
const transaction_listeners = new Map<`0x${string}`, Set<(tx: Transaction) => void>>()

function dispatch_transaction_update(hash: `0x${string}`, transaction: Transaction) {
  const listeners = transaction_listeners.get(hash)
  if (listeners) {
    listeners.forEach(listener => listener(transaction))
  }
}

export function watch_transaction(
  hash: `0x${string}`,
  callback: (transaction: Transaction) => void,
) {
  if (!transaction_listeners.has(hash)) {
    transaction_listeners.set(hash, new Set())
  }
  transaction_listeners.get(hash)!.add(callback)
  
  // Return cleanup function
  return () => {
    const listeners = transaction_listeners.get(hash)
    if (listeners) {
      listeners.delete(callback)
      if (listeners.size === 0) {
        transaction_listeners.delete(hash)
      }
    }
  }
}
```

## Integration with eth_sendRawTransaction

The `eth_sendRawTransaction` function automatically integrates with the tracking system:

```typescript
export function eth_sendRawTransaction(
  _parameters: Parameters,
): Writable<Transaction> {
  return async (
    transports: Http[],
  ): Promise<Transaction> => {
    const method = "eth_sendRawTransaction"
    const parameters = parse(parametersSchema, _parameters)
    const call = parse(callSchema, [method, parameters])
    
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    
    const hash = parse(Hash32Schema, response.result)
    
    // Create pending transaction
    const transaction: PendingTransaction = {
      status: "pending",
      hash,
      result: hash, // Store hash as generic result
    }
    
    // Store and start monitoring
    store_transaction(hash, transaction)
    start_transaction_monitoring(hash, transports)
    
    return transaction
  }
}
```

## Usage Example

```typescript
// Submit transaction
const writable = eth_sendRawTransaction([signed_transaction])
const transaction = await writable(writer(sepolia_chain_id))
// transaction: PendingTransaction with hash, result, status

// Watch for status changes
const cleanup = watch_transaction(transaction.hash, (updated) => {
  switch (updated.status) {
    case "pending":
      console.log("⏳ Waiting for mining...")
      // Available: hash, result, status
      break
      
    case "mined": 
      console.log(`⛏️  Mined in block ${updated.blockNumber}`)
      // Available: hash, result, status, blockNumber, blockHash, gasUsed
      break
      
    case "confirmed":
      console.log(`✅ Confirmed with ${updated.confirmations} confirmations`)
      // Available: hash, result, status, blockNumber, blockHash, gasUsed, confirmations
      break
      
    case "reverted":
      console.log(`❌ Failed: ${updated.error}`)
      // Available: hash, result, status, blockNumber, blockHash, gasUsed, error
      break
  }
})

// Clean up listener when done
// cleanup()
```

## Transaction Flow

```
Submit Transaction
       ↓
   [pending] ────────────────→ [timeout after 5min]
       ↓
   Get Receipt via polling
       ↓
   receipt.status === "0x1"? 
       ↓              ↓
     Yes             No
       ↓              ↓
   [mined] ────→ [reverted]
       ↓              
   Wait for 12+ confirmations
       ↓
   [confirmed]
```

## Benefits

1. **Type Safety**: Each state has exact fields with no optional properties
2. **Generic Result**: Flexible storage for any transaction return data
3. **Ethereum Standard**: Uses official `eth_getTransactionReceipt` polling
4. **Automatic Monitoring**: No manual polling required
5. **Real-time Updates**: Reactive event system for UI updates
6. **Clear API**: Consumers know exactly what data is available in each state

## Ethereum Monitoring Methods

### Polling (Implemented)
- **Method**: Regular `eth_getTransactionReceipt` calls
- **Pros**: Widely supported, reliable, simple
- **Cons**: Less efficient than subscriptions
- **Recommendation**: Best for most use cases

### WebSocket Subscriptions (Alternative)
- **Methods**: `eth_subscribe("newHeads")`, `eth_subscribe("pendingTransactions")`
- **Pros**: More efficient, real-time
- **Cons**: Requires WebSocket RPC endpoint
- **Use Case**: High-frequency applications

### Event Logs (Specialized)
- **Method**: `eth_getLogs` with filters
- **Use Case**: Contract-specific event monitoring
- **Limitation**: Only for contract interactions with events
