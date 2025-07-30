# RLP Implementation Plan

## Point 1: Basic RLP Encoding Implementation

### Core RLP Functions

```typescript
// rlp.ts - RLP encoding implementation for wallet

type RLPInput = string | number | bigint | Uint8Array | RLPInput[];

/**
 * Encode data using RLP (Recursive Length Prefix)
 */
function encode_rlp(input: RLPInput): Uint8Array {
  if (Array.isArray(input)) {
    return encode_list(input);
  }
  return encode_item(input);
}

// Internal encoding functions
function encode_item(item: string | number | bigint | Uint8Array): Uint8Array {
  const bytes = to_bytes(item);
  
  if (bytes.length === 1 && bytes[0] < 0x80) {
    // Single byte < 0x80 encodes as itself
    return bytes;
  }
  
  if (bytes.length <= 55) {
    // Short string: 0x80 + length + data
    return new Uint8Array([0x80 + bytes.length, ...bytes]);
  }
  
  // Long string: 0xb7 + length_of_length + length + data
  const length_bytes = encode_length(bytes.length);
  return new Uint8Array([
    0xb7 + length_bytes.length,
    ...length_bytes,
    ...bytes
  ]);
}

function encode_list(list: RLPInput[]): Uint8Array {
  const encoded_items = list.map(item => encode_rlp(item));
  const total_length = encoded_items.reduce((sum, item) => sum + item.length, 0);
  
  if (total_length <= 55) {
    // Short list: 0xc0 + length + items
    return new Uint8Array([0xc0 + total_length, ...encoded_items.flat()]);
  }
  
  // Long list: 0xf7 + length_of_length + length + items
  const length_bytes = encode_length(total_length);
  return new Uint8Array([
    0xf7 + length_bytes.length,
    ...length_bytes,
    ...encoded_items.flat()
  ]);
}

// Utility functions
function to_bytes(input: string | number | bigint | Uint8Array): Uint8Array {
  if (input instanceof Uint8Array) return input;
  if (typeof input === 'string') {
    if (input.startsWith('0x')) {
      return hex_to_bytes(input);
    }
    return new TextEncoder().encode(input);
  }
  if (typeof input === 'number' || typeof input === 'bigint') {
    return number_to_bytes(BigInt(input));
  }
  throw new Error(`Cannot convert ${typeof input} to bytes`);
}

function hex_to_bytes(hex: string): Uint8Array {
  const clean_hex = hex.slice(2); // Remove 0x prefix
  const bytes = new Uint8Array(clean_hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean_hex.slice(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function number_to_bytes(num: bigint): Uint8Array {
  if (num === 0n) return new Uint8Array([]);
  
  const hex = num.toString(16);
  const padded_hex = hex.length % 2 ? '0' + hex : hex;
  return hex_to_bytes('0x' + padded_hex);
}

function encode_length(length: number): Uint8Array {
  if (length === 0) return new Uint8Array([]);
  
  const bytes: number[] = [];
  let temp = length;
  while (temp > 0) {
    bytes.unshift(temp & 0xff);
    temp >>= 8;
  }
  return new Uint8Array(bytes);
}

// Export main functions
export { encode_rlp };
```

### Usage Examples

```typescript
// Example usage
const examples = {
  // Encode single byte
  single_byte: encode_rlp(0x7f), // [0x7f]
  
  // Encode empty string
  empty_string: encode_rlp(''), // [0x80]
  
  // Encode short string
  short_string: encode_rlp('dog'), // [0x83, 0x64, 0x6f, 0x67]
  
  // Encode number
  number: encode_rlp(1024), // [0x82, 0x04, 0x00]
  
  // Encode empty list
  empty_list: encode_rlp([]), // [0xc0]
  
  // Encode simple list
  simple_list: encode_rlp(['cat', 'dog']), // [0xc8, 0x83, 0x63, 0x61, 0x74, 0x83, 0x64, 0x6f, 0x67]
  
  // Encode nested list
  nested_list: encode_rlp([['cat'], ['dog']]), // Complex nested structure
};
```

## Point 2: Integration with Ethereum Transaction Encoding

### Transaction Structure

```typescript
// transaction.ts - Ethereum transaction RLP encoding

interface EthTransaction {
  nonce: bigint;
  gas_price: bigint;
  gas_limit: bigint;
  to: string | null; // null for contract creation
  value: bigint;
  data: Uint8Array;
  v?: bigint; // signature recovery
  r?: bigint; // signature r
  s?: bigint; // signature s
}

interface EIP1559Transaction {
  chain_id: bigint;
  nonce: bigint;
  max_priority_fee_per_gas: bigint;
  max_fee_per_gas: bigint;
  gas_limit: bigint;
  to: string | null;
  value: bigint;
  data: Uint8Array;
  access_list: Array<{
    address: string;
    storage_keys: string[];
  }>;
  v?: bigint;
  r?: bigint;
  s?: bigint;
}

/**
 * Encode legacy transaction for signing (without signature)
 */
function encode_transaction_for_signing(tx: EthTransaction, chain_id: bigint): Uint8Array {
  const rlp_data: RLPInput[] = [
    tx.nonce,
    tx.gas_price,
    tx.gas_limit,
    tx.to || '',
    tx.value,
    tx.data,
    chain_id, // EIP-155
    0, // empty r
    0  // empty s
  ];
  
  return encode_rlp(rlp_data);
}

/**
 * Encode signed legacy transaction
 */
function encode_signed_transaction(tx: EthTransaction): Uint8Array {
  if (!tx.v || !tx.r || !tx.s) {
    throw new Error('Transaction must be signed');
  }
  
  const rlp_data: RLPInput[] = [
    tx.nonce,
    tx.gas_price,
    tx.gas_limit,
    tx.to || '',
    tx.value,
    tx.data,
    tx.v,
    tx.r,
    tx.s
  ];
  
  return encode_rlp(rlp_data);
}

/**
 * Encode EIP-1559 transaction for signing
 */
function encode_eip1559_for_signing(tx: EIP1559Transaction): Uint8Array {
  const access_list_rlp = tx.access_list.map(item => [
    item.address,
    item.storage_keys
  ]);
  
  const rlp_data: RLPInput[] = [
    tx.chain_id,
    tx.nonce,
    tx.max_priority_fee_per_gas,
    tx.max_fee_per_gas,
    tx.gas_limit,
    tx.to || '',
    tx.value,
    tx.data,
    access_list_rlp
  ];
  
  const encoded = encode_rlp(rlp_data);
  
  // EIP-1559 transactions are prefixed with 0x02
  return new Uint8Array([0x02, ...encoded]);
}

/**
 * Encode signed EIP-1559 transaction
 */
function encode_signed_eip1559(tx: EIP1559Transaction): Uint8Array {
  if (!tx.v || !tx.r || !tx.s) {
    throw new Error('Transaction must be signed');
  }
  
  const access_list_rlp = tx.access_list.map(item => [
    item.address,
    item.storage_keys
  ]);
  
  const rlp_data: RLPInput[] = [
    tx.chain_id,
    tx.nonce,
    tx.max_priority_fee_per_gas,
    tx.max_fee_per_gas,
    tx.gas_limit,
    tx.to || '',
    tx.value,
    tx.data,
    access_list_rlp,
    tx.v,
    tx.r,
    tx.s
  ];
  
  const encoded = encode_rlp(rlp_data);
  return new Uint8Array([0x02, ...encoded]);
}

export {
  encode_transaction_for_signing,
  encode_signed_transaction,
  encode_eip1559_for_signing,
  encode_signed_eip1559,
  type EthTransaction,
  type EIP1559Transaction
};
```

### Integration Example

```typescript
// wallet-integration.ts - How to use RLP with wallet signing

import { encode_transaction_for_signing, encode_signed_transaction } from './transaction';
import { keccak256 } from '@noble/hashes/sha3';
import { secp256k1 } from '@noble/secp256k1';

async function sign_and_encode_transaction(
  tx: EthTransaction,
  private_key: Uint8Array,
  chain_id: bigint
): Promise<string> {
  // 1. Encode transaction for signing
  const unsigned_rlp = encode_transaction_for_signing(tx, chain_id);
  
  // 2. Hash the RLP-encoded transaction
  const tx_hash = keccak256(unsigned_rlp);
  
  // 3. Sign the hash
  const signature = secp256k1.sign(tx_hash, private_key);
  
  // 4. Calculate recovery ID (v)
  const recovery_id = signature.recovery!;
  const v = BigInt(recovery_id) + (chain_id * 2n) + 35n; // EIP-155
  
  // 5. Create signed transaction
  const signed_tx: EthTransaction = {
    ...tx,
    v,
    r: BigInt('0x' + signature.r.toString(16)),
    s: BigInt('0x' + signature.s.toString(16)),
  };
  
  // 6. Encode final signed transaction
  const final_rlp = encode_signed_transaction(signed_tx);
  
  // 7. Return as hex string for broadcast
  return '0x' + Array.from(final_rlp).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Usage example
const example_tx: EthTransaction = {
  nonce: 42n,
  gas_price: 20000000000n, // 20 gwei
  gas_limit: 21000n,
  to: '0x742C0a0fBF78e0fd3D8fCd3D8A7B9F1C0C55F2d5',
  value: 1000000000000000000n, // 1 ETH
  data: new Uint8Array(),
};

// This would be called in the wallet when user confirms transaction
// const signed_tx_hex = await sign_and_encode_transaction(example_tx, private_key, 1n);
```

This implementation provides a lightweight, encoding-only RLP solution focused on what a wallet actually needs: creating and signing transactions for broadcast to the Ethereum network.