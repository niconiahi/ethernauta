---
title: Overview
section: EIPs
section_order: 5
order: 1
---

# EIPs

Every Ethereum Improvement Proposal that Ethernauta implements lives as a subpath of `@ethernauta/eip`. The folder name is the EIP number. Import what you need:

```ts
import { sign_typed_data } from "@ethernauta/eip/712";
import { wallet_send_calls } from "@ethernauta/eip/5792";
import { discover_providers } from "@ethernauta/eip/6963";
```

## What's shipped

| EIP | Title | Purpose |
|---|---|---|
| [55](/eips/55) | Checksum address encoding | Mixed-case address checksumming. |
| [191](/eips/191) | Signed Data Standard | `personal_sign` message format. |
| [712](/eips/712) | Typed structured data hashing and signing | Typed-data signing. |
| [1014](/eips/1014) | CREATE2 | Deterministic contract address derivation. |
| [1102](/eips/1102) | Opt-in account exposure | `eth_requestAccounts`. |
| [1193](/eips/1193) | Provider JavaScript API | The 1193 envelope itself. |
| [1271](/eips/1271) | Standard signature validation for contracts | Smart-account signatures. |
| [1559](/eips/1559) | Fee market change | Type-2 tx, base-fee arithmetic, `INITIAL_BASE_FEE` / elasticity constants. |
| [2255](/eips/2255) | Wallet permissions | Permission-prompt protocol. |
| [2930](/eips/2930) | Optional access lists | Type-1 tx + the `accessList` shape every later typed tx reuses. |
| [3085](/eips/3085) | `wallet_addEthereumChain` | Adding a chain at runtime. |
| [3326](/eips/3326) | `wallet_switchEthereumChain` | Switching active chain. |
| [4337](/eips/4337) | Account abstraction (entry-point + UserOperation) | Smart-account flows. |
| [4361](/eips/4361) | Sign-In with Ethereum (SIWE) | Off-chain auth message. |
| [4844](/eips/4844) | Shard blob transactions | Blob carriers + KZG commitments. |
| [5792](/eips/5792) | Wallet calls | Batched call submission (`wallet_sendCalls`). |
| [6492](/eips/6492) | Counterfactual signatures | Pre-deployment signatures. |
| [6963](/eips/6963) | Multi-injected provider discovery | Multi-wallet discovery. |
| [7702](/eips/7702) | Set EOA account code | EOA delegation to contract code. |

## Why per-folder

Hard rule 11 in CLAUDE.md: anything implementing a numbered standard lives in `packages/eip/src/<n>/`. The folder name is the standard number; the `index.ts` carries the spec link comment and re-exports the public surface. No exceptions.

That's what makes EIP adoption a `mkdir` + populate operation rather than a coordinated rollout. See [Concepts → folder-shaped standards](/concepts/folder-shaped-standards).

## ERC vs EIP, here

Token standards and contract-interface standards live under `@ethernauta/erc/<n>/` instead — see [ERCs](/ercs/overview). The split mirrors the spec namespace (`EIP-N` for protocol / wallet, `ERC-N` for token / contract).
