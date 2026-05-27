---
title: Dispatch
section: Wallet
section_order: 6
order: 2
---

# Dispatch

`packages/wallet/src/utils/dispatch.ts` routes every incoming 1193 `request` against four strict allowlists. A method outside all four returns error 4200 (unsupported method).

## Tier 1 — Wallet state (cached, no RPC, no popup)

| Method | Returns | EIP |
|---|---|---|
| `eth_chainId` | hex chain ID | core |
| `eth_accounts` | currently exposed accounts | core |
| `net_version` | decimal chain ID (legacy) | legacy |
| `wallet_getPermissions` | `Permission[]` | [2255](/eips/2255) |
| `wallet_getCapabilities` | `Capabilities` | [5792](/eips/5792) |
| `wallet_switchEthereumChain` | `null` | [3326](/eips/3326) |

These read wallet-managed state. `wallet_switchEthereumChain` mutates the state (and may pop the `select-chain` view on first switch) but the typical path is cached.

## Tier 2 — Chain reads (forwarded to RPC)

The wallet acts as a passthrough — it forwards the request to the active chain's HTTP RPC and returns the response unmodified. No signature, no popup, no wallet-held secrets.

| Method | Purpose |
|---|---|
| `eth_blockNumber` | Latest block. |
| `eth_blobBaseFee` | EIP-4844 base blob fee. |
| `eth_call` | Read-only execution. |
| `eth_getBalance` | Native balance. |
| `eth_getCode` | Deployed bytecode. |
| `eth_getStorageAt` | Raw storage. |
| `eth_estimateGas` | Gas estimation. |
| `eth_gasPrice` | Legacy gas price. |
| `eth_maxPriorityFeePerGas` | EIP-1559 tip. |
| `eth_feeHistory` | Historical fees. |
| `eth_getTransactionReceipt` | Receipt by hash. |
| `eth_getTransactionByHash` | Tx by hash. |
| `eth_getTransactionByBlockHashAndIndex` | Tx by block + index. |
| `eth_getTransactionByBlockNumberAndIndex` | Tx by block-number + index. |
| `eth_getTransactionCount` | Nonce. |
| `eth_getBlockByNumber` | Block by number. |
| `eth_getBlockByHash` | Block by hash. |
| `eth_getBlockTransactionCountByHash` | Tx count in block (by hash). |
| `eth_getBlockTransactionCountByNumber` | Tx count in block (by number). |
| `eth_getLogs` | Log filter query. |
| `eth_getProof` | Storage proof. |
| `eth_protocolVersion` | Node protocol version. |
| `eth_syncing` | Sync status. |
| `net_listening` | Network connectivity. |
| `net_peerCount` | Peer count. |
| `web3_clientVersion` | Node version string. |
| `web3_sha3` | Keccak via the node (rarely used by clients). |

A dapp that calls only these never opens the wallet popup.

## Tier 3 — Signables (popup confirmation required)

These open the popup and wait for the user. They are the **only methods that touch the mnemonic.** Each maps to a view:

| Method | View | EIP |
|---|---|---|
| `eth_requestAccounts` | `connect` + `select-account` | [1102](/eips/1102) |
| `wallet_requestPermissions` | `connect` (re-used) | [2255](/eips/2255) |
| `eth_sendTransaction` | `send` | core (path 1) |
| `eth_signTransaction` | `send` (path-2 variant) | core (path 2) |
| `personal_sign` | `personal-sign` | [191](/eips/191) |
| `eth_sign` | `sign` (gated; off by default) | legacy |
| `eth_signTypedData_v4` | `sign-typed-data` | [712](/eips/712) |
| `wallet_addEthereumChain` | `add-chain` | [3085](/eips/3085) |
| `wallet_sendCalls` | `send-calls` | [5792](/eips/5792) |
| `wallet_sendSetCodeTransaction` | `authorize-delegation` | [7702](/eips/7702) |

The dispatcher posts an envelope to the popup; the popup looks up the view by method name; the view renders, awaits user input, signs (if needed), posts the result back.

If the user closes the popup without confirming, the dispatcher returns error 4001 (user rejected).

## Tier 4 — Wallet internal (storage reads)

| Method | Source | EIP |
|---|---|---|
| `wallet_getCallsStatus` | extension storage | [5792](/eips/5792) |

The wallet tracks batches it submitted via `wallet_sendCalls` and serves their status from a local registry. Not a chain read, not a popup — the wallet has the answer locally.

## Why the four-tier split exists

**Auditability.** Reading the four allowlists in `dispatch.ts` is the same as reading the wallet's complete public surface. There is no fifth list, no hidden method, no debug path.

**Security boundary.** Tier 3 is the only place secrets exist. Confining secret access to one tier makes the audit surface small.

**Performance.** Tier 1 returns from in-memory cache. Tier 2 doesn't open a popup. Tier 3 opens a popup. Tier 4 reads local storage. The cost of each tier is bounded by its routing target.

**Standards-first interop.** Any standards-compliant wallet's tier 3 is the part that varies (UI, policy). Tiers 1, 2, 4 are essentially uniform across wallets. The split makes that explicit.

## Outside all four

A request like `evm_mine` (the Hardhat test cheat code) is outside every tier. The dispatcher returns 4200 (unsupported method). The dapp must catch the error and fall back appropriately.

## See also

- [Views](/wallet/views) — what each tier-3 popup looks like.
- [Vault](/wallet/vault) — where the mnemonic that backs tier-3 signing lives.
- [Concepts → the wallet contract](/concepts/wallet-contract) — dapp-facing perspective.
