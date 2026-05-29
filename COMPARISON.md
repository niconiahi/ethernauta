# Ethernauta vs viem vs ethers.js — Feature Comparison

Legend:
- ✅ first-class / built-in
- ⚠️ partial / via add-on / awkward
- ❌ not provided
- 📦 separate package (same vendor)

---

## 1. Architecture & Philosophy

| Dimension | Ethernauta | viem | ethers.js v6 |
|---|---|---|---|
| Validation at boundaries | ✅ Valibot `parse` everywhere | ⚠️ TS-only types, internal asserts | ⚠️ runtime checks, no schemas |
| Tree-shake granularity | ✅ per-EIP/ERC subpath import | ✅ named-export shaking | ⚠️ class-based, less aggressive |
| Curried method shape (`method(args)(transport)`) | ✅ central pattern | ❌ flat function calls | ❌ class methods |
| Sign-then-broadcast as first-class path | ✅ M3 path 2 mandatory | ⚠️ possible but uncommon | ⚠️ possible via raw tx |
| Reads work with **no** wallet attached | ✅ `create_reader(CHAINS)` | ✅ `publicClient` | ✅ `JsonRpcProvider` |
| Ships its own wallet extension | ✅ MV3 (`packages/wallet`) | ❌ | ❌ |
| Bundles 500+ chain configs in-repo | ✅ ~2,636 EIP-155 chains | 📦 `viem/chains` (~300) | ❌ user-supplied |
| Standards land "folder + done" | ✅ `packages/eip/src/<n>/` | ❌ ad-hoc placement | ❌ ad-hoc placement |

---

## 2. JSON-RPC Method Coverage (`eth_*`, `net_*`, `web3_*`)

| Method | Ethernauta | viem | ethers.js |
|---|---|---|---|
| `eth_accounts` / `eth_blockNumber` / `eth_chainId` / `eth_coinbase` / `eth_syncing` | ✅ | ✅ | ✅ |
| `eth_getBalance` / `eth_getCode` / `eth_getStorageAt` / `eth_getTransactionCount` | ✅ | ✅ | ✅ |
| `eth_getBlockByHash` / `…ByNumber` / `…ReceiptsReceipts` | ✅ | ✅ | ✅ |
| `eth_getBlockTransactionCount*` / `eth_getUncleCount*` | ✅ | ⚠️ uncles dropped | ✅ |
| `eth_getTransactionByHash` / `…ByBlockHashAndIndex` / `…ByBlockNumberAndIndex` | ✅ | ✅ | ✅ |
| `eth_getTransactionReceipt` | ✅ | ✅ | ✅ |
| `eth_call` / `eth_estimateGas` / `eth_createAccessList` | ✅ | ✅ | ✅ |
| `eth_gasPrice` / `eth_maxPriorityFeePerGas` / `eth_feeHistory` / `eth_blobBaseFee` | ✅ | ✅ | ✅ |
| `eth_sendTransaction` / `eth_sendRawTransaction` | ✅ | ✅ | ✅ |
| `eth_getProof` (EIP-1186) | ✅ | ✅ | ⚠️ via `send` |
| `eth_newFilter` / `…BlockFilter` / `…PendingTransactionFilter` / `getFilterChanges` / `getFilterLogs` / `uninstallFilter` | ✅ | ⚠️ wrapped as `watch*` actions | ✅ |
| `eth_getLogs` | ✅ | ✅ | ✅ |
| `eth_subscribe` (logs / newHeads / newPendingTransactions) | ✅ ws transport | ✅ ws/socket actions | ✅ via WebSocketProvider |
| `web3_clientVersion` / `web3_sha3` | ✅ | ⚠️ via raw `request` | ⚠️ via `send` |
| `net_version` / `net_listening` / `net_peerCount` | ✅ | ⚠️ via raw `request` | ⚠️ via `send` |

---

## 3. Transaction Types & Encoding

| Type | EIP | Ethernauta | viem | ethers.js |
|---|---|---|---|---|
| Legacy | — | ⚠️ raw bytes only | ✅ | ✅ |
| Access list | 2930 | ✅ schemas + encode | ✅ | ✅ |
| Dynamic-fee | 1559 | ✅ encode + base-fee math | ✅ | ✅ |
| Blob | 4844 | ✅ encode + KZG + blobs | ✅ | ✅ |
| Set-code | 7702 | ✅ full (encode/decode/sign/auth list) | ✅ | ✅ |
| RLP encoder/decoder | — | ✅ `rlp()` in utils | ✅ `toRlp` / `fromRlp` | ✅ `encodeRlp` / `decodeRlp` |

---

## 4. Wallet / Provider Standards (EIPs the library implements)

| EIP | Description | Ethernauta | viem | ethers.js |
|---|---|---|---|---|
| 55 | Checksum address | ✅ `to_checksum_address` | ✅ `getAddress` | ✅ `getAddress` |
| 191 | `personal_sign` | ✅ build + sign + verify | ✅ | ✅ |
| 712 | Typed-data sign | ✅ hash + sign + verify | ✅ | ✅ |
| 1014 | CREATE2 address | ✅ `get_create2_address` | ✅ `getContractAddress` | ✅ `getCreate2Address` |
| 1102 | `eth_requestAccounts` | ✅ | ✅ | ✅ |
| 1193 | Provider interface | ✅ envelope + emitter + full error space | ⚠️ consumed only | ⚠️ consumed only (`BrowserProvider`) |
| 1271 | Contract sig verification | ✅ `verify_hash` + magic value | ✅ `verifyMessage` falls back | ⚠️ manual |
| 2255 | Wallet permissions | ✅ request/get + caveats | ⚠️ via raw request | ❌ |
| 3085 | `wallet_addEthereumChain` | ✅ | ✅ | ⚠️ via send |
| 3326 | `wallet_switchEthereumChain` | ✅ | ✅ | ⚠️ via send |
| 4337 | Account Abstraction | ✅ v0.7 packing + RPC methods + signing | 📦 `permissionless` (3rd-party) | ❌ |
| 4361 | SIWE | ✅ build/parse/nonce | 📦 `viem/siwe` | ❌ |
| 4844 | Blob txs | ✅ KZG, blobs, versioned hash | ✅ | ✅ |
| 5792 | `wallet_sendCalls` | ✅ send + status + capabilities | ✅ | ❌ |
| 6492 | Counterfactual sig | ✅ wrap/unwrap/verify | ✅ `verifyMessage` | ❌ |
| 6963 | Multi-wallet discovery | ✅ announce + discover + persist | ⚠️ helper | ❌ |
| 7702 | Set-code delegation | ✅ full | ✅ | ✅ |

---

## 5. ABI Encoding / Decoding

| Capability | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Encode function call (selector + args) | ✅ | ✅ | ✅ |
| Decode function result | ✅ | ✅ | ✅ |
| Decode raw calldata | ✅ | ✅ | ✅ |
| Encode constructor + bytecode | ✅ | ✅ | ✅ |
| Selector / signature hash | ✅ `function_selector` / `to_selector` | ✅ `toFunctionSelector` | ✅ `Interface` |
| Build canonical signature string | ✅ | ✅ | ✅ |
| Encode event topics | ✅ | ✅ | ✅ |
| Decode single log | ✅ | ✅ | ✅ |
| Batch decode logs by sig | ✅ `decode_logs` | ✅ `parseEventLogs` | ⚠️ loop |
| Human-readable ABI parsing | ⚠️ primitives only, no struct/tuple | ✅ via `abitype` | ✅ |
| Custom error decoding | ⚠️ split into EIP-1271 + ERC packages | ✅ `decodeErrorResult` | ✅ |
| Nested tuples / arrays | ✅ recursive | ✅ | ✅ |
| Strong static types from ABI const | ⚠️ Valibot codecs, no `abitype`-level inference | ✅ best-in-class | ⚠️ TypeChain add-on |

---

## 6. Token Standards (ERCs)

| ERC | Description | Ethernauta | viem | ethers.js |
|---|---|---|---|---|
| 20 | Fungible + extensions (burn/cap/meta/mint/pause/wrapper) | ✅ method bindings + extensions | ⚠️ ABI const, no bindings | ⚠️ Contract instance |
| 137 | ENS reverse registrar | ✅ | ⚠️ via ENS actions | ⚠️ via name resolver |
| 165 | `supportsInterface` | ✅ | ⚠️ user-supplied ABI | ⚠️ user-supplied |
| 181 | ENS reverse metadata | ✅ | ❌ | ❌ |
| 634 | ENS text records | ✅ | ✅ `getEnsText` | ✅ `getText` |
| 721 | NFTs + extensions (burn/enum/meta/pause) | ✅ | ⚠️ user ABI | ⚠️ user ABI |
| 1155 | Multi-token + URI | ✅ | ⚠️ user ABI | ⚠️ user ABI |
| 1577 | ENS contenthash | ✅ | ⚠️ user-side | ⚠️ user-side |
| 2304 | ENS multicall resolver | ✅ | ❌ | ❌ |
| 2612 | EIP-2612 Permit | ✅ | ⚠️ user-side typed-data | ⚠️ user-side |
| 2981 | NFT royalties | ✅ | ❌ | ❌ |
| 3156 | Flash loans (borrower + lender) | ✅ | ❌ | ❌ |
| 4494 | ERC-721 Permit | ✅ | ❌ | ❌ |
| 4626 | Tokenized vault | ✅ full method surface | ❌ | ❌ |
| 5564 | Stealth addresses | ✅ Scheme1 | ❌ | ❌ |
| 5805 | Gov votes delegation | ✅ | ❌ | ❌ |
| 6372 | Clock interface | ✅ | ❌ | ❌ |
| 7683 | Cross-chain intents | ✅ origin + dest settlers + EIP-712 | ❌ | ❌ |

**ERC built-in bindings**: Ethernauta 18, viem ~2 (ENS-ish + abis only), ethers ~0 (everything via raw `Contract`).

---

## 7. ENS

| Capability | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Forward resolve name → address | ✅ `get_ens_address` | ✅ `getEnsAddress` | ✅ `resolveName` |
| Reverse address → name | ✅ `get_ens_name` | ✅ `getEnsName` | ✅ `lookupAddress` |
| Text records | ✅ | ✅ | ✅ |
| Content hash | ✅ ERC-1577 | ✅ | ⚠️ manual |
| Avatar resolution | ✅ ENSIP-12 parser | ✅ `getEnsAvatar` | ✅ |
| ENSIP-15 normalization (NFC, beautify) | ✅ in-house | ✅ via `@adraffy/ens-normalize` | ✅ via same |
| Get resolver | ✅ | ✅ | ✅ |
| `namehash` | ✅ | ✅ | ✅ |

---

## 8. Signing & Verification

| Capability | Ethernauta | viem | ethers.js |
|---|---|---|---|
| `personal_sign` (EIP-191) | ✅ | ✅ | ✅ |
| Verify EIP-191 | ✅ `verify_message` (1271+6492 fallthrough) | ✅ | ✅ |
| EIP-712 typed-data sign | ✅ | ✅ | ✅ |
| Verify EIP-712 | ✅ | ✅ | ✅ |
| Contract sig (1271) | ✅ inside verify | ✅ inside verify | ⚠️ manual |
| Counterfactual sig (6492) | ✅ inside verify | ✅ | ❌ |
| SIWE message build/parse/verify (4361) | ✅ | 📦 `viem/siwe` | ❌ |
| Sign + broadcast separated (M3 path 2) | ✅ first-class | ⚠️ possible | ⚠️ possible |
| `eth_signTransaction` (sign without broadcast) | ✅ | ⚠️ rare | ⚠️ rare |
| `eth_sign` legacy | ✅ | ⚠️ deprecated | ⚠️ deprecated |
| BIP-39 / BIP-32 / BIP-44 key derivation | ✅ `@ethernauta/crypto` | ❌ (use `@scure`) | ✅ `HDNodeWallet` |
| ECDSA recover address | ✅ | ✅ | ✅ |

---

## 9. Chain Definitions

| | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Built-in count | ~2,636 | ~300 | 0 |
| Source | `chainid.network` import | hand-curated | user |
| Per-chain subpath import (tree-shake) | ✅ `@ethernauta/chain/eip155-1` | ⚠️ named exports from `viem/chains` | n/a |
| Schema-validated | ✅ Valibot | ⚠️ TS types | n/a |
| Includes ENS registry, explorers, faucets, parent bridges, slip44 | ✅ | ⚠️ subset | n/a |

---

## 10. Transport Layer

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| HTTP transport | ✅ | ✅ | ✅ |
| WebSocket transport | ✅ | ✅ | ✅ |
| IPC transport | ❌ | ✅ | ✅ |
| Configurable retry (attempts + backoff) | ✅ | ✅ | ⚠️ basic |
| Request batching (window + max size) | ✅ | ✅ | ⚠️ manual |
| Custom headers | ✅ | ✅ | ✅ |
| Multicall3 aggregator | ✅ `create_multicall` w/ allowFailure | ✅ `multicall` action | 📦 ethers-multicall |
| Fallback / load-balanced transport | ❌ | ✅ `fallback` | ⚠️ `FallbackProvider` |
| EIP-1193 injected adapter | ✅ `create_injected_transport` | ✅ `custom` | ✅ `BrowserProvider` |

---

## 11. Testing

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Anvil-aware namespace | ✅ `@ethernauta/testing` | ✅ `viem/test` | ❌ |
| Vitest plugin spawning anvil per worker | ✅ `ethernauta_anvil()` | ❌ (BYO) | ❌ |
| Auto snapshot/revert isolation per test | ✅ | ❌ | ❌ |
| Pre-derived deterministic test accounts | ✅ | ✅ | ⚠️ derive yourself |
| `evm_mine` / `evm_increaseTime` / `evm_snapshot` / `evm_revert` | ✅ | ✅ | ⚠️ raw `send` |
| `anvil_*` impersonate / setBalance / setCode / setStorageAt / dump-load | ✅ | ✅ | ⚠️ raw `send` |
| Fork mode (fork URL + block + base fee) | ✅ via plugin options | ✅ | ⚠️ raw |

---

## 12. Gas & Fees

| Capability | Ethernauta | viem | ethers.js |
|---|---|---|---|
| EIP-1559 base-fee math | ✅ `calculate_base_fee` | ✅ | ⚠️ manual |
| Priority-fee estimation | ✅ | ✅ | ✅ |
| Gas-limit buffer helper | ✅ | ⚠️ manual | ⚠️ manual |
| Arbitrum L2 gas | ✅ `calculate_gas_arbitrum` | ⚠️ chain-specific actions | ❌ |
| OP-Stack L2 gas | ✅ | ✅ via `viem/op-stack` | ❌ |
| zkSync L2 gas | ✅ | ✅ via `viem/zksync` | ❌ |
| Gas-family detection per chain | ✅ `gas_family()` | ❌ | ❌ |

---

## 13. Account Abstraction (EIP-4337)

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| EntryPoint v0.7 packing helpers | ✅ | 📦 `permissionless.js` | ❌ |
| `eth_sendUserOperation` / `eth_estimateUserOperationGas` / `eth_getUserOperationByHash` / `…Receipt` / `eth_supportedEntryPoints` | ✅ | 📦 | ❌ |
| User-op hash + inner hash | ✅ | 📦 | ❌ |
| Sign user-op | ✅ | 📦 | ❌ |
| Bundler client / paymaster client | ❌ (M4: no hosted services) | 📦 | ❌ |

> Note Ethernauta's Maxim M4 deliberately excludes the bundler/paymaster service layer; the on-chain envelope is implemented, the off-chain infrastructure is out of scope.

---

## 14. Built-in Wallet Capabilities

| Capability | Ethernauta wallet | viem | ethers.js |
|---|---|---|---|
| Ships a real MV3 extension | ✅ `packages/wallet` | ❌ | ❌ |
| Encrypted mnemonic vault (IndexedDB) | ✅ | n/a | n/a |
| EIP-1193 dispatch w/ allowlists | ✅ (4 lists in `dispatch.ts`) | n/a | n/a |
| Permission gating (EIP-2255) | ✅ caveat-based | n/a | n/a |
| Multi-chain switch/add (EIP-3085/3326) | ✅ | n/a | n/a |
| Batched calls (EIP-5792) | ✅ | n/a | n/a |
| Set-code delegation (EIP-7702) | ✅ | n/a | n/a |
| Counterfactual / 6492 sigs | ✅ | n/a | n/a |
| EIP-6963 announce | ✅ | n/a | n/a |

---

## 15. Utility Helpers

| Helper | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Hex ↔ BigInt / number / bytes | ✅ | ✅ | ✅ |
| keccak256 | ✅ via crypto/utils | ✅ | ✅ |
| Unit conversion (wei/gwei/ether) | ✅ `unit` | ✅ `parseEther`/`formatEther` | ✅ |
| Time-unit helpers | ✅ `time` | ❌ | ❌ |
| RLP | ✅ | ✅ | ✅ |
| Address checksum | ✅ | ✅ | ✅ |
| CREATE / CREATE2 addr | ✅ | ✅ | ✅ |
| `camel_to_kebab` etc. | ✅ niche | ❌ | ❌ |

---

## 16. Summary Scorecard

| Bucket | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Core JSON-RPC breadth | ✅ widest (uncles, filters, web3_*, net_*) | ✅ wide, drops uncles | ✅ wide |
| Tx-type coverage (2930/1559/4844/7702) | ✅ | ✅ | ✅ |
| Wallet-side EIP implementations | ✅ **17 EIPs in-tree** | ⚠️ ~10 (mostly dapp-side) | ⚠️ ~5 |
| ERC token-standard bindings | ✅ **18 ERCs in-tree** | ⚠️ ~2 | ❌ |
| Built-in ENS resolution | ✅ | ✅ | ✅ |
| Strong runtime validation (Valibot) | ✅ unique | ❌ | ❌ |
| Static ABI type-inference quality | ⚠️ codec-based | ✅ industry best (abitype) | ⚠️ TypeChain |
| Anvil testing ergonomics | ✅ vitest plugin | ✅ test actions, no plugin | ❌ |
| Bundled chain registry size | ✅ ~2,636 | ⚠️ ~300 | ❌ 0 |
| Ships a real wallet | ✅ MV3 | ❌ | ❌ |
| Ecosystem maturity / community | ⚠️ new | ✅ large | ✅ largest |
| AA bundler/paymaster client | ❌ (by M4) | 📦 permissionless | ❌ |
| Fallback / load-balanced transport | ❌ | ✅ | ✅ |
| IPC transport | ❌ | ✅ | ✅ |

---

## Where Ethernauta Wins

1. **In-tree wallet-side standards.** 17 EIPs and 18 ERCs implemented as importable subpaths with method bindings — viem treats most ERCs as raw ABI, ethers leaves them to the user.
2. **Valibot-validated boundaries.** Every wire envelope, RPC param, and response is `parse`d; viem/ethers rely on TS types plus internal asserts.
3. **Real wallet extension.** Neither competitor ships one; Ethernauta uses its own primitives inside `packages/wallet/` (M2).
4. **Two equal consumer paths (M3).** `eth_signTransaction` + `eth_sendRawTransaction` is a first-class path with no wallet needed beyond signing — viem/ethers default to the wallet-broadcast path.
5. **Chain registry size & schema-validation** (~9× viem's count).
6. **Vitest plugin** for Anvil with per-test snapshot/revert isolation.
7. **Niche standards** (ERC-3156 flash loans, 4626 vaults, 5564 stealth, 7683 intents) — present in Ethernauta, absent in both competitors.

## Where viem / ethers Still Win

1. **`abitype`-grade static ABI inference** (viem) — Ethernauta's codec-based system is runtime-safe but doesn't infer call-site arg types from an ABI `as const` the way viem does.
2. **Fallback / load-balanced transports** (both) — Ethernauta has retry+batch but no multi-endpoint fallback.
3. **IPC transport** (both).
4. **AA bundler/paymaster clients** — viem's `permissionless` ecosystem; Ethernauta deliberately stops at the on-chain envelope (M4).
5. **Community size, ecosystem integrations, documentation breadth** — both competitors are years older with vast tutorial coverage.
6. **Legacy tx schema** — present in both, only "raw bytes" in Ethernauta.

---

# Gap Analysis — What viem / ethers Ship That Ethernauta Doesn't

Same legend as above.

## A. JSON-RPC Methods

| Method / capability | Ethernauta | viem | ethers.js |
|---|---|---|---|
| `eth_simulateV1` (multi-call state-overrided sim) | ❌ | ✅ | ❌ |
| `debug_traceTransaction` / `debug_traceCall` / `debug_traceBlockByNumber` (geth tracers) | ✅ typed callTracer / prestateTracer / 4byteTracer / struct via `@ethernauta/eth` | ⚠️ via raw `request` | ⚠️ via raw `send` |
| `trace_*` (Parity / Erigon / Reth) | ❌ | ⚠️ via raw `request` | ⚠️ via raw `send` |
| `ots_*` (Otterscan extensions) | ❌ | ❌ | ❌ |
| State overrides in `eth_call` (`stateDiff`, `code`, `balance`) | ✅ third arg on `eth_call` | ✅ `simulateContract` | ✅ `Contract.staticCall` w/ overrides |
| Block tags `safe` / `finalized` in block-tag schema | ✅ | ✅ | ✅ |
| Shanghai `withdrawals` field in block schema | ✅ + Cancun `blobGasUsed` / `excessBlobGas` | ✅ | ✅ |

## B. Standards Missing from `packages/eip/` & `packages/erc/`

| Standard | What it covers | Ethernauta | viem | ethers.js |
|---|---|---|---|---|
| **EIP-3668** CCIP-Read | Off-chain data resolution; required for ENS L2 names (basenames, OP names, wildcard resolvers) | ❌ | ✅ | ⚠️ partial |
| **EIP-5267** Domain getter | `eip712Domain()` self-describing contracts | ✅ `get_domain` (Callable) | ✅ | ⚠️ manual |
| **EIP-1167** Minimal proxy (clones) | Tiny proxy bytecode + factory pattern | ✅ `is_clone` / `get_clone_target` / `deploy_clone` | ⚠️ helper | ❌ |
| **EIP-1967** Standard proxy slots | Impl/admin slot reads for TransparentUpgradeable | ✅ `get_implementation` / `get_admin` / `get_beacon` | ⚠️ helper | ❌ |
| **EIP-1822** UUPS | UUPS upgrade pattern detection | ❌ | ❌ | ❌ |
| **EIP-2470** Singleton factory | Deterministic deploy at fixed address | ❌ | ❌ | ❌ |
| **EIP-7212 / RIP-7212** P256 precompile | Passkey / WebAuthn signing | ❌ | ❌ | ❌ |
| **ERC-2535** Diamond proxy | Multi-facet upgradeable contracts | ❌ | ❌ | ❌ |
| **ERC-6551** Token Bound Accounts | NFT-as-wallet | ❌ | ❌ | ❌ |
| **ERC-7579** Modular smart accounts | Module-based AA accounts (current frontier) | ❌ | ❌ | ❌ |
| **ERC-7677** Paymaster web service | Paymaster RPC protocol | ❌ | ⚠️ via permissionless | ❌ |
| **ERC-7710** Delegation permissions | Delegated permissions schema | ❌ | ❌ | ❌ |
| **ERC-7715** Wallet `requestPermissions` (new) | Dapp-requested wallet permissions | ❌ | ❌ | ❌ |
| **ERC-5189** Bundler mempool validation | Bundler-side validation rules | ❌ | ❌ | ❌ |
| **ERC-7562** Validation tracing rules | Bundler-side simulation rules | ❌ | ❌ | ❌ |
| **EIP-4337 bundler-side** | Bundler implementation (not just dapp bindings) | ❌ | ❌ | ❌ |

## C. Transport / Connection Features

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| IPC transport (Unix socket / Windows named pipe) | ❌ | ✅ | ✅ |
| Fallback / round-robin transport | ❌ | ✅ `fallback` | ✅ `FallbackProvider` |
| Rate-limited transport wrapper | ❌ | ⚠️ user-side | ⚠️ user-side |
| WebSocket reconnect / heartbeat | ⚠️ verify | ✅ | ✅ |

## D. ABI / Contract Ergonomics

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Static type inference from ABI `as const` (`abitype`-grade) | ❌ | ✅ | ⚠️ TypeChain |
| Human-readable ABI with structs/tuples | ⚠️ primitives only | ✅ | ✅ |
| Custom error decoding at ABI layer | ⚠️ split across packages | ✅ `decodeErrorResult` | ✅ |
| Object-shaped contract handle (`.read.x()` / `.write.x()` / `.simulate.x()` / `.watch.x()`) | ❌ (by design — `Callable<T>` per M3) | ✅ | ✅ |
| `simulateContract` (sim + decoded result + request hydration) | ❌ | ✅ | ⚠️ manual |
| `parseEventLogs` (batch decode by ABI) | ✅ `decode_logs` | ✅ | ⚠️ loop |

## E. Wallet / Key Management

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Geth-format keystore JSON (encrypted v3 wallet) import/export | ❌ | ❌ | ✅ |
| Mnemonic wordlists beyond English | ⚠️ verify | ❌ | ✅ |
| Local in-memory account (`privateKeyToAccount`) | ⚠️ verify exposure | ✅ | ✅ `Wallet` |
| HDWallet derivation API surface | ✅ in `@ethernauta/crypto` | ❌ | ✅ `HDNodeWallet` |

## F. Off-Chain Infrastructure (M4 boundary)

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| Bundler **client** (consumes any bundler via RPC) | ✅ (`@ethernauta/eip/4337`) | 📦 permissionless | ❌ |
| Bundler **server** (`@ethernauta/bundler`) | ❌ proposed | ❌ | ❌ |
| Paymaster **client** (ERC-7677) | ❌ | 📦 permissionless | ❌ |
| Paymaster **server** | ❌ proposed | ❌ | ❌ |
| Etherscan / Sourcify ABI fetch | ❌ | ❌ | ❌ |
| Contract verification (Etherscan submit) | ❌ | ❌ | ❌ |

## G. L2-Specific

| Feature | Ethernauta | viem | ethers.js |
|---|---|---|---|
| OP Stack deposit/withdraw helpers | ❌ | ✅ `viem/op-stack` | ❌ |
| Arbitrum L1→L2 message helpers | ❌ | ❌ | 📦 `@arbitrum/sdk` |
| zkSync deposit/withdraw | ❌ | ✅ `viem/zksync` | 📦 `zksync-ethers` |
| CCIP-Read for L2 ENS (depends on EIP-3668 above) | ❌ | ✅ | ⚠️ partial |

---

## Gap Reading

- The non-grant-relevant gaps (IPC, fallback transport, keystore JSON, L2 deposit helpers) are real but boring — fix them when a user actually complains.
- The grant-relevant gaps cluster in two tracks: **AA stack** (3668, 7212, 7579, 7677, 7710, 7715, bundler, paymaster) and **ENS-on-L2** (3668, universal resolver). Both tracks are ESP-shaped.
- Adding the proxy patterns (1167, 1967, 1822, 2535) isn't a grant in itself but it's the kind of completeness that makes reviewers stop nitpicking.

## Suggested Order of Operations

1. **EIP-3668** first. Unblocks ENS-on-L2 grant story AND is a prereq for the AA stack story (ERC-7677 paymasters use it).
2. **State overrides + `debug_traceCall`** next. Prereq for the bundler. Also makes `simulateContract`-style ergonomics possible.
3. **`@ethernauta/bundler`** scoped as its own package, written in TS on top of Ethernauta's own primitives (M2 pattern). Open-source repo, paid hosted instance optional. M4-compatible because the library never depends on it.
4. Tier-1 ERCs (6551, 7579, 7710/7715) once the AA-stack vs ENS-on-L2 grant track is chosen.
