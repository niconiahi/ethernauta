---
title: Comparison with ethers and viem
section: Getting Started
section_order: 1
order: 5
---

# Comparison with ethers and viem

A functional yes/no matrix. The columns are what each library **can do** out of the box — not how it does it, not how nicely, not how ergonomically. Just the capabilities.

"Yes" means the feature ships in the library itself, with first-party support, and is usable without reaching for a third-party package. "Partial" means the building blocks exist but the feature is not exposed as a single ready-to-use API. "No" means you would need to write it yourself or pull in an external library.

## Chain access

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Read chain state (`eth_call`, balances, blocks, logs) | Yes | Yes | Yes |
| `eth_call` with state overrides (`balance` / `code` / `state` / `stateDiff`) | Yes | Yes | Yes |
| `safe` / `finalized` block tags | Yes | Yes | Yes |
| Shanghai `withdrawals` + Cancun `blobGasUsed` / `excessBlobGas` block fields | Yes | Yes | Yes |
| Subscribe to logs / blocks over WebSocket | Yes | Yes | Yes |
| Send pre-signed raw transactions | Yes | Yes | Yes |
| Batch JSON-RPC requests | Yes | Yes | Yes |
| 500+ pre-defined EIP-155 chain entries | Yes | No | Yes |
| Multicall aggregation | Yes | No | Yes |

## Signing

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Sign transactions via an injected wallet | Yes | Yes | Yes |
| Sign EIP-712 typed data | Yes | Yes | Yes |
| Sign EIP-191 personal messages | Yes | Yes | Yes |
| Sign-then-broadcast as separate operations | Yes | Yes | Yes |
| In-process HD wallet / mnemonic-backed signer | No | Yes | Yes |
| Bundled browser wallet extension (MV3) | Yes | No | No |

## ABI

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| ABI encode / decode | Yes | Yes | Yes |
| Decode revert reasons / custom errors | Yes | Yes | Yes |
| Decode event logs | Yes | Yes | Yes |
| Generate typed bindings from ABI (CLI) | Yes | No | Yes |
| Strict TypeScript inference from inline ABI | Partial | No | Yes |

## Wallet-protocol standards

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| EIP-1102 — `eth_requestAccounts` | Yes | Yes | Yes |
| EIP-1193 — provider consumption | Yes | Yes | Yes |
| EIP-2255 — `wallet_getPermissions` / `requestPermissions` | Yes | No | Yes |
| EIP-3085 — `wallet_addEthereumChain` | Yes | No | Yes |
| EIP-3326 — `wallet_switchEthereumChain` | Yes | No | Yes |
| EIP-4361 — Sign-In with Ethereum | Yes | No | Yes |
| EIP-5792 — `wallet_sendCalls` (batched calls) | Yes | No | Yes |
| EIP-6963 — multi-wallet discovery | Yes | No | Yes |
| EIP-7702 — set-code (delegated) transactions | Yes | Partial | Yes |

## Proxy and contract-shape standards

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| EIP-1167 — minimal-proxy detection + deploy bytecode | Yes | No | Partial |
| EIP-1967 — proxy storage slot reads (implementation / admin / beacon) | Yes | No | Partial |
| EIP-5267 — self-describing EIP-712 domain (`eip712Domain()`) | Yes | No | Yes |

## Signature verification

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Verify EIP-191 personal-message signatures | Yes | Yes | Yes |
| Verify EIP-712 typed-data signatures | Yes | Yes | Yes |
| Verify EIP-1271 contract signatures | Yes | Partial | Yes |
| Verify ERC-6492 signatures from predeploy / undeployed accounts | Yes | No | Yes |
| Single universal `verify_signature` across 191 / 712 / 1271 / 6492 | Yes | No | Yes |

## ENS

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Forward resolution (`name → address`) | Yes | Yes | Yes |
| Reverse resolution (`address → name`) | Yes | Yes | Yes |
| ENSIP-15 name normalization | Yes | Yes | Yes |
| ENSIP-10 wildcard / off-chain resolvers | Yes | Yes | Yes |
| Text-record / content-hash reads | Yes | Yes | Yes |

## Tokens

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| ERC-20 read / write helpers | Yes | Partial | Yes |
| ERC-721 read / write helpers | Yes | Partial | Yes |
| ERC-1155 read / write helpers | Yes | Partial | Yes |
| Permit (EIP-2612) typed-data signatures | Yes | Partial | Yes |
| Pre-generated selector registry | Yes | No | No |

## Transactions and lifecycle

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Wait for receipt | Yes | Yes | Yes |
| Track pending → mined → confirmed → reorged states | Yes | No | Partial |
| Persistable transaction store across reloads | Yes | No | No |
| Gas estimation | Yes | Yes | Yes |
| EIP-1559 fee field handling | Yes | Yes | Yes |
| EIP-2930 access lists | Yes | Yes | Yes |
| EIP-2718 typed-transaction encoding | Yes | Yes | Yes |
| EIP-4844 blob transactions | Partial | Yes | Yes |

## Testing

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| First-party test client with anvil / hardhat actions | No | No | Yes |
| Mockable transport via plain function | Yes | Partial | Yes |
| Time / block manipulation helpers (`mine`, `setNextBlockTimestamp`) | No | No | Yes |
| Account impersonation helpers | No | No | Yes |
| Snapshot / revert helpers | No | No | Yes |
| Local-node fork helpers | No | No | Yes |

## Framework integrations

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| First-party React hooks | Yes | No | Partial |
| Server-side / SSR-safe | Yes | Yes | Yes |
| Tree-shakeable per-method imports | Yes | Partial | Yes |

## Validation and runtime safety

| Capability | Ethernauta | ethers | viem |
|---|---|---|---|
| Schema-validated wire boundaries at runtime | Yes | No | Partial |
| Throwing parse at the boundary (no silent coercion) | Yes | No | No |
| Types derived from runtime schemas | Yes | No | No |

## Operational stance

| Property | Ethernauta | ethers | viem |
|---|---|---|---|
| No hosted-service dependency for any feature | Yes | Yes | Yes |
| No mandatory paid RPC provider | Yes | Yes | Yes |
| Bundled wallet extension shipped with the library | Yes | No | No |

## How to read this

The matrix is deliberately functional. Two libraries marked "Yes" on the same row can have very different ergonomics, type safety, bundle sizes, and architectural commitments — none of which this page tries to capture. For the architectural commitments specific to Ethernauta — two consumer paths, schemas as types, folder-shaped standards, EIP-1193 as a transport — see the [Concepts](/concepts/primitives-first) section.
