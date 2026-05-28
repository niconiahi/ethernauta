---
name: ethernauta
description: Official consumer guide for the @ethernauta/* packages — what each concept is, when to reach for it, and where the runnable example lives. Read this before writing dapp code against Ethernauta so the AI agent does not have to rediscover the API every session.
---

# Using Ethernauta

This document teaches a consuming agent how to build a dapp on top of `@ethernauta/*`. It is organized by **concept**, not by package. Each section explains WHAT the concept is, WHEN to reach for it, and points to a self-contained example file under `examples/<section>/`.

The canonical real-world consumer is the [animatronik](https://github.com/niconiahi/animatronik) dapp — every pattern below is taken verbatim from it or from `apps/playground` inside the ethernauta monorepo. If a pattern is not represented in this skill, it is not a supported usage.

---

## 1. Mental Model — Factories, Resolvers, and Methods

Before any other section, internalize this single shape. Every Ethernauta call you will ever write is:

```
method(args)(resolver({ chain_id, ...context }))
```

There are three pieces:

- **Factories** (`create_reader`, `create_writer`, `create_contract`, and the wallet-side `create_provider(provider).signer`) — module-scope (or memoized per-mount for the signer), called once per dapp with the chains you support.
- **Resolvers** — what the factory returns. Called per-call with the chain (and, for contracts, the contract address). Produces a tuple of `[transports_or_signer, context]`.
- **Methods** (`eth_getBalance`, `eth_signTransaction`, `mint`, etc.) — factory functions that return a method shape (`Readable`, `Writable`, `Signable`, or `Callable`) which takes the resolved tuple and executes.

Methods never execute on their own. They are **curried**: the first call validates and prepares the call, the second applies it to a resolved transport. Never collapse the two.

The four method shapes:

| Shape | Resolver | Use for |
|---|---|---|
| `Readable<T>` | `create_reader(CHAINS)` *or* `create_provider(provider).reader` | Raw `eth_*` state queries (balance, nonce, code, block). Both produce the same shape — pick path 2 (chain-config, no wallet) or path 1 (routed through the wallet's selected RPC) per call |
| `Writable<T>` | `create_writer(CHAINS)` | Submitting pre-signed transactions (`eth_sendRawTransaction`) |
| `Signable<T>` | `create_provider(provider).signer` | Anything that needs the wallet (account access, signing) — `provider` is an EIP-1193 source obtained via EIP-6963 discovery (section 9) |
| `Callable<T>` | `create_contract(CHAINS)` | Read-only contract method calls (`view` / `pure`) |

→ **See** `examples/chain-wiring/` for the canonical setup.

---

## 2. Chain Wiring

**What it is.** Ethernauta identifies chains with CAIP-2 strings (`"eip155:1"`, `"eip155:11155111"`) — never raw integers. You build the chain ID with `encode_chain_id({ namespace, reference })` using a chain definition from `@ethernauta/chain`, then wrap it with the HTTP RPC endpoints you want to use into a `ChainEntry`.

**When to reach for it.** Every dapp begins here. Build the `CHAIN_ID` constant and the `CHAINS` array once at module scope, then pass `CHAINS` to whichever factories you need (`create_reader`, `create_writer`, `create_contract`). Do not rebuild these per render — they are stable and cheap to share. The signer does not consume `CHAINS` — it is built from an EIP-1193 provider acquired at runtime (sections 5 and 9).

**Notes.**
- `@ethernauta/chain` exports 500+ EIP-155 chain definitions as `eip155_<chainId>`. Import the ones you need by name (`eip155_1`, `eip155_11155111`).
- `http(url)` creates an HTTP JSON-RPC transport. Pass more than one for fallback; dispatch uses `Promise.any()`, so the first to succeed wins.

→ **See** `examples/chain-wiring/example.ts`.

---

## 3. Reading Raw Chain State

**What it is.** The `eth_*` methods exported from `@ethernauta/eth` whose shape is `Readable<T>`. They wrap JSON-RPC reads like `eth_getBalance`, `eth_blockNumber`, `eth_getTransactionCount`, `eth_getCode`, `eth_getTransactionReceipt`, `eth_call`. You call them through a resolver built by `create_reader`.

**When to reach for it.** Anything chain-level that is *not* a contract method: balances of native ETH, block info, mempool inspection, transaction receipts. For contract reads, use the Contract path (next section) instead — it handles ABI encoding/decoding for you.

→ **See** `examples/reading-state/example.ts`.

---

## 4. Reading Contracts (`view` / `pure`)

**What it is.** Read-only contract methods are `Callable<T>`. Each generated method (`balanceOf`, `totalSupply`, `tokenURI`, …) handles its own ABI encoding internally and uses `eth_call` under the hood. You resolve them with `create_contract`, which adds the contract address `to` to the context.

**When to reach for it.** Any `view`/`pure` Solidity function. You do not need a wallet. You do not need to know calldata or selectors — the generated method packs them. This is what `animatronik` uses for `totalSupply()`, `tokenByIndex`, `get_data`, etc.

**Notes.**
- The contract resolver is `contract({ chain_id, to })` — `to` is required, validated as an address.
- The Callable shape is `[Http[], ContractContext] → Promise<T>`. Same shape as Readable, with `to` added to context.
- Contract method files live in your generated directory (e.g. `app/generated/animatronik/methods/`). Each is small and self-contained; they are the canonical example of what `Callable` code looks like.

→ **See** `examples/reading-state/contract-read.ts`.

---

## 5. Connecting a Wallet

**What it is.** Signing flows go through an EIP-1193 provider obtained via EIP-6963 discovery (section 9). Pass the provider to `create_provider(provider)` from `@ethernauta/transport` to get a `{ reader, signer }` resolver pair, then call `eth_requestAccounts` from `@ethernauta/eip/1102` — a `Signable<string[]>` — through the `signer` resolver.

**When to reach for it.** Whenever your UI needs the user's address. Discover providers on mount, let the user pick one, call `eth_requestAccounts` once to surface the address, and cache the picked provider for later transactions.

**Notes.**
- `create_provider(provider)` in `@ethernauta/transport` is the dapp-side adapter. It composes the provider into both a `reader` (delegates `eth_*` reads through `provider.request`) and a `signer` (delegates signable methods through `provider.request`). Same call shape as `create_reader(CHAINS)` etc. — the only difference is the construction line.
- User rejection raises an EIP-1193-shaped error with `code: 4001`. Wrap calls in try/catch and read `err.message` for display.
- In React, `@ethernauta/react` exports a `useProvider({ key })` hook that returns the `{ reader, signer }` pair already composed against the rehydrated EIP-6963 selection — see `apps/playground/app/examples/*` for the live consumer pattern.

→ **See** `examples/wallet-connect/example.tsx`.

---

## 6. Sending a Native Transfer

**What it is.** The two-step submit: (1) `eth_signTransaction([{ to, value }])` through the signer returns an RLP-encoded raw transaction; (2) `eth_sendRawTransaction([signed])` through the writer broadcasts it and returns the transaction hash.

**When to reach for it.** Native ETH (or chain-native token) transfers. For contract calls, use section 7 — but the second step (sendRawTransaction) is identical.

**Notes.**
- Do not set `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas` yourself. The wallet fills them from `eth_getTransactionCount`, `eth_estimateGas`, and `eth_feeHistory`. Leaving them unset is the contract between you and the wallet.
- `value` must be a hex string. Use `number_to_hex(amount)` from `@ethernauta/utils`.
- Same signer can be reused for `eth_requestAccounts` and `eth_signTransaction` — resolve fresh each call with `signer({ chain_id })` where `signer` came from `create_provider(provider).signer`.

→ **See** `examples/sending-transactions/example.tsx` and `examples/end-to-end-transfer/example.tsx`.

---

## 7. Calling a Contract Method (State-Changing)

**What it is.** Write-side contract methods are also `Signable<Bytes>` — the generated method encodes calldata, calls `eth_signTransaction` with `{ to, value: "0x0", input }` plus a **function sidecar** `{ signature, names }` so the wallet can render a human-readable confirmation. You then broadcast with `eth_sendRawTransaction`.

**When to reach for it.** Any non-view contract method: `mint`, `transferFrom`, `approve`, etc. This is exactly the path animatronik uses for `mint(data)`.

**Notes.**
- The resolver for write-side contract methods is the **signer**, not the contract resolver — pass `signer({ chain_id, to })` where `to` is the contract address. The signer's context accepts an optional `to`.
- The function sidecar travels on the Ethernauta envelope, not on the JSON-RPC params, so the underlying transaction stays spec-compliant. The wallet verifies it with `keccak(signature)[0:4] === input[0:4]`.
- Generated methods live under `app/generated/<project>/methods/<method>.ts`. They are produced by a codegen step from the contract ABI; do not hand-write them unless you are extending the codegen.

→ **See** `examples/smart-contract-call/example.tsx`.

---

## 8. Tracking Transactions

**Two paths depending on the shape of what you are tracking.**

### 8.1 Single-hash UI tracking (path 2 — no wallet required)

**What it is.** After a transaction lands in the mempool, use `@ethernauta/transaction` to persist its lifecycle (`pending` → `mined` / `reverted`) and observe transitions in your UI. The package provides four verbs (`register_transaction`, `set_transaction`, `watch_transaction`, `wait_for_receipt`) composed through a fifth factory `create_tracker(CHAINS, { store })` — same idiom as `create_reader` / `create_writer` / `create_contract`.

**When to reach for it.** Any single transaction your UI needs to surface (a transfer, a mint, an approval, a broadcast against any wallet) where you want to render `pending` → `mined` / `reverted` in-line. Works without an Ethernauta wallet — only RPC transports are required.

**Notes.**
- `Transaction` is the canonical Valibot-backed discriminated union for this lifecycle, exported from `@ethernauta/transaction`: `{ hash, status: "pending" | "mined" | "reverted", ...receipt fields when mined/reverted }`. Import it; do not redefine.
- The `store` config dependency-injects WHERE the lifecycle records persist. `window_store` is the default browser-side backend; pass any `Store`-shaped object for chrome-storage / IndexedDB / in-memory test backends.
- `watch_transaction` returns an `unsubscribe` function on the second call — wire it into a `useEffect` cleanup so unmounted components don't fire `setState` after the receipt arrives.
- For an awaitable "wait until N confirmations" flow, use `wait_for_receipt(hash, { confirmations, timeout_ms })(tracker(...))` instead.

→ **See** `examples/transaction-tracking/example.tsx`.

### 8.2 Batched calls (path 1 — EIP-5792, wallet required)

**What it is.** For multi-call flows that should look like one user action (`approve` + `swap`, `permit` + `transfer`, etc.), use `wallet_sendCalls` from `@ethernauta/eip/5792`. The wallet mints a bundle ID, signs each call, broadcasts sequentially, and exposes status via `wallet_getCallsStatus`. **Dapps do not track the underlying transaction hashes themselves** — the wallet owns batch lifecycle.

**When to reach for it.** Any flow that today consists of "send transaction A, wait for it, then send transaction B." Switch the *whole* flow to one `wallet_sendCalls` invocation; render UI off `wallet_getCallsStatus(bundle_id)` polling.

**Notes.**
- `wallet_sendCalls` is a `Signable<SendCallsResult>` — same curried shape as every other Ethernauta method.
- `wallet_getCallsStatus` returns receipts grouped by bundle once all calls have mined; before that, status is `PENDING`.
- Today the wallet executes calls sequentially. Atomic execution (EIP-7702) is a future capability. Dapps that branch on `wallet_getCapabilities` will degrade gracefully.

→ **See** `apps/playground/app/examples/send-calls/demo.tsx` for the live consumer pattern.

---

## 9. EIP-6963 Provider Discovery

**What it is.** EIP-6963 is the standard event protocol for multi-wallet discovery. Wallets dispatch `eip6963:announceProvider` with their info and provider; dapps dispatch `eip6963:requestProvider` to trigger announcements. `@ethernauta/eip/6963` exports the types (`EIP6963ProviderDetail`, `EIP6963AnnounceProviderEvent`), the `announce()` helper for wallet builders, and `set_provider_detail` / `get_provider_detail` / `web_storage` for persisting the user's selection.

**When to reach for it.** Always, on the dapp side, whenever you need a signer. There is no wallet-specific shortcut — every signable flow starts from an EIP-1193 provider discovered through 6963 and adapted via `create_provider(provider)` (section 5). Multi-wallet support is the *baseline*, not an opt-in.

→ **See** `examples/provider-discovery/example.ts`.

---

## 10. Parameter Shapes

**What it is.** Every parameterized Ethernauta method accepts inputs in **two equivalent forms**: a positional tuple (`[address, blockTag]`) or a named object (`{ address, block }`). Internally a Valibot `union` validates either.

**When to reach for it.** Use the named form for readability when reading complex methods; use the positional form for spec-aligned snippets. Both are equally valid. Pick one style per codebase to keep diffs clean.

**Notes.**
- The named keys match the EIP / JSON-RPC schema field names (`address`, `block`, `owner`, `uri`, etc.).
- Validation throws on the first invalid shape — never use `safeParse`. Surface the error to the user.

→ **See** `examples/parameter-shapes/example.ts`.

---

## 11. Error Handling

**What it is.** Three error sources, three distinct shapes:

| Source | Shape | When |
|---|---|---|
| User rejected in wallet | `{ code: 4001, message: "User rejected request" }` | Signer flows |
| RPC error response | `Error(response.error.message)` | Reader / Writer / Contract flows |
| No provider connected | `Error("Connect a wallet first.")` (raise yourself) | Signer flows reached before EIP-6963 selection |

**When to reach for it.** Wrap every entry-point call in try/catch. The 4001 cases are EXPECTED user behaviors — render a soft message, not a stack trace. RPC errors usually mean the call is malformed (bad chain id, gas issue, reverted call) — surface `err.message` for display and log details for debugging.

**Never.**
- Never call `safeParse` to swallow validation errors. Let `parse` throw.
- Never log private keys, mnemonics, or signed-but-unsent transactions.

→ **See** `examples/errors/example.tsx`.

---

## Where Things Live (Quick Reference)

| Package | Exports you will use |
|---|---|
| `@ethernauta/chain` | `eip155_1`, `eip155_11155111`, … (500+ chain definitions) |
| `@ethernauta/transport` | `create_reader`, `create_writer`, `create_contract`, `create_provider`, `http`, `encode_chain_id`, type `Readable`, `Writable`, `Signable`, `Callable`, `ProviderResolver`, `ResolvedSigner`, `ResolvedContract` |
| `@ethernauta/eth` | `eth_getBalance`, `eth_getTransactionCount`, `eth_blockNumber`, `eth_call`, `eth_sendRawTransaction`, `eth_signTransaction`, `eth_getTransactionReceipt`, `AddressSchema`, `Uint256Schema`, type `Bytes`, `Hash32`, `Uint256` |
| `@ethernauta/transaction` | `create_tracker`, `register_transaction`, `set_transaction`, `watch_transaction`, `wait_for_receipt`, `window_store`, type `Store` / `Transaction` / `PendingTransaction` / `MinedTransaction` / `RevertedTransaction` (single-hash lifecycle — see section 8.1) |
| `@ethernauta/react` | `useProvider`, `useProviderDetail` (composes `create_provider` against a rehydrated EIP-6963 selection — see section 5) |
| `@ethernauta/eip/1102` | `eth_requestAccounts` |
| `@ethernauta/eip/1193` | `Provider` interface (the wallet-side `create_provider` envelope-builder also lives here) |
| `@ethernauta/eip/6963` | `announce`, `EIP6963ProviderDetail`, `ANNOUNCE_EVENT`, `REQUEST_EVENT`, `set_provider_detail`, `get_provider_detail`, `web_storage` |
| `@ethernauta/eip/5792` | `wallet_sendCalls`, `wallet_getCallsStatus`, `wallet_getCapabilities` (batched-call protocol — see section 8.2) |
| `@ethernauta/abi` | `build_signature`, `encode_function_call`, `decode_function_result` (only needed when writing your own contract methods — usually codegen handles this) |
| `@ethernauta/utils` | `number_to_hex`, `hex_to_number`, `bytes_to_hex` |

---

## How To Use This Skill

When the user asks for something matching a section's "When to reach for it" line:

1. Read the matching section.
2. Open the example file under `examples/<section>/`. The example is self-contained and copy-pasteable.
3. Adapt it: change chain (mainnet vs testnet), addresses, and method names. Keep the **shape** of the call exactly as the example shows — module-scope factories, per-call resolvers, two-step curried invocation.
4. Wire errors with the patterns from section 11.

Do not invent new patterns. If the dapp needs something not in this skill, the gap is intentional — flag it to the user and read the relevant package source before guessing.
