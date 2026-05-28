---
name: ethernauta
description: Self-contained consumer guide for the @ethernauta/* npm packages. Read this before writing any dapp code that talks to a chain or a wallet. Every concept, snippet, and decision rule needed to build with Ethernauta is in this file — runnable longer-form versions of each pattern live next to it under examples/<name>/example.ts.
---

# Ethernauta — consumer guide

This document is everything an agent needs to use `@ethernauta/*` correctly without reading the package source. Each section answers one user intent with: the **shape** of the call (an inline snippet that compiles), the **knobs** the consumer might want to change, and a pointer to the matching `examples/<name>/example.ts` file in this skill folder for a full runnable version.

The packages are published to npm. The consumer installs them and imports from them — no monorepo checkout is needed for anything below.

## §0 Intent → section

| The user wants to… | Section |
|---|---|
| Understand the call shape every method uses | §1 |
| Pick packages to install | §2 |
| Wire chains (build chain IDs, build factories) | §3 |
| Read native chain state (balance, block, code, logs, receipt) | §4 |
| Read a contract (view / pure) | §5 |
| Discover wallets and let the user pick one | §6 |
| Send a native transaction — path 1, wallet does it all | §7 |
| Send a native transaction — path 2, dapp owns the broadcast | §7 |
| Call a contract method that changes state | §8 |
| Batch several calls into one user action | §9 |
| Track a single transaction's lifecycle (`pending → mined / reverted`) | §10 |
| Sign or verify a message (EIP-191 / 712 / 1271 / 6492) | §11 |
| Resolve ENS (forward / reverse / avatar / text) | §12 |
| Handle errors | §13 |
| Look up which package exports a symbol | §14 |
| Refresh on the always-on rules | §15 |

---

## §1 The mental model — read this first

Every Ethernauta call is two function calls in a row:

```
method(args)(resolver({ chain_id, ...context }))
```

- **Method** — a curried function like `eth_getBalance`, `balanceOf`, `eth_signTransaction`.
- **First call** — binds the parameters. Returns a function shaped `(resolved) => Promise<T>`.
- **Second call** — binds the transport (a reader, a writer, a signer, a contract, or a tracker). The actual RPC request happens here.

**The two calls are never collapsed.** The same `eth_blockNumber` runs against a public-RPC reader, an EIP-1193 provider, or a test mock without any change to the call site — that is what the split buys you.

There are five resolver shapes:

| Shape | Built by | Use for |
|---|---|---|
| `Readable<T>` | `create_reader(CHAINS)` or `create_provider(p).reader` | `eth_*` reads — no wallet required |
| `Writable<T>` | `create_writer(CHAINS)` | `eth_sendRawTransaction` — no wallet required |
| `Signable<T>` | `create_provider(p).signer` (only) | Anything that needs the wallet to sign or expose state |
| `Callable<T>` | `contract({ chain_id, to })` from `@ethernauta/transport` | Read-only contract methods (ABI calldata + decoder) |
| `Trackable<T>` | `create_tracker(CHAINS, { store })` | Transaction lifecycle polling |

`Signable<T>` is the **only** shape that needs a wallet. The other four work entirely from public RPC endpoints.

---

## §2 Install

Minimum useful set — chain reads + every `eth_*` method:

```bash
pnpm add @ethernauta/core @ethernauta/transport @ethernauta/chain @ethernauta/eth
```

Add as the dapp needs:

- `@ethernauta/eip` — wallet protocols (`1102`, `1193`, `191`, `712`, `1271`, `5792`, `6492`, `6963`, `7702`, …) as importable subpaths.
- `@ethernauta/erc` — token bindings (`20`, `721`, `1155`, `4626`, `2612`, `5805`, `137` ENS, …) as importable subpaths.
- `@ethernauta/transaction` — lifecycle tracking.
- `@ethernauta/react` — `useProvider`, `useProviderDetail` hooks.
- `@ethernauta/crypto` — universal signature verification across 191/712/1271/6492.
- `@ethernauta/ens` — ENSIP-15 normalization, multi-call resolution.
- `@ethernauta/abi` — codecs (only when writing custom contract bindings; ERC bindings ship with their own).
- `@ethernauta/utils` — `number_to_hex`, `parse_unit`, `format_unit`, RLP, etc.

Peer requirements: TypeScript 5.x, ES2022 runtime (modern browsers / Node 20+ / Bun / Workers / Deno).

---

## §3 Chain wiring

Build chain IDs and resolver factories **once, at module scope**. Reuse for the lifetime of the dapp. Do not rebuild per render.

```ts
import { eip155_1 } from "@ethernauta/chain/eip155-1"
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import {
  create_reader,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport"

export const MAINNET_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_1.chainId,
})
export const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})

const CHAINS = [
  {
    chainId: MAINNET_CHAIN_ID,
    transports: [http("https://ethereum-rpc.publicnode.com")],
  },
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
]

export const reader = create_reader(CHAINS)
export const writer = create_writer(CHAINS)
```

Knobs:

- **Chain IDs are CAIP-2 strings** (`"eip155:1"`), never raw integers. Build them with `encode_chain_id`.
- **`@ethernauta/chain` exposes 500+ chain definitions** as subpaths (`eip155-1`, `eip155-10`, `eip155-137`, `eip155-8453`, `eip155-11155111`, …). Import only the ones you need.
- **Multiple `http(url)` transports per chain** — fallback uses `Promise.any()`; the first to succeed wins. Add a private RPC alongside a public one for resilience.
- **The signer is not built from `CHAINS`.** It comes from an EIP-1193 provider acquired at runtime — see §6.

Full version: `examples/chain-wiring/example.ts`.

---

## §4 Reading native chain state

Use the methods from `@ethernauta/eth`. Each is a `Readable<T>`.

```ts
import { eth_blockNumber, eth_getBalance } from "@ethernauta/eth"
import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

const block = await eth_blockNumber()(reader({ chain_id: MAINNET_CHAIN_ID }))

const vitalik = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045")
const balance = await eth_getBalance([vitalik, "latest"])(
  reader({ chain_id: MAINNET_CHAIN_ID }),
)
```

Available: `eth_blockNumber`, `eth_chainId`, `eth_getBalance`, `eth_getTransactionCount`, `eth_getCode`, `eth_getStorageAt`, `eth_getBlockByNumber`, `eth_getBlockByHash`, `eth_getTransactionByHash`, `eth_getTransactionReceipt`, `eth_getLogs`, `eth_estimateGas`, `eth_feeHistory`, `eth_call`, `eth_gasPrice`. Parameter shapes follow the JSON-RPC spec.

For contract reads with ABI decoding go to §5 — calling `eth_call` directly only when no binding exists.

Full version: `examples/reading-state/example.ts`.

---

## §5 Reading a contract (view / pure)

The ERC bindings handle ABI encode/decode for you. Build a `Callable<T>`, pass it through `eth_call`, then call `.decode` on the returned bytes.

```ts
import { contract } from "@ethernauta/transport"
import { balanceOf } from "@ethernauta/erc/20"
import { eth_call } from "@ethernauta/eth"
import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8")

const callable = balanceOf([holder])(
  contract({ chain_id: MAINNET_CHAIN_ID, to: usdc }),
)
const bytes = await eth_call([{ to: callable.to, input: callable.data }])(
  reader({ chain_id: MAINNET_CHAIN_ID }),
)
const balance = callable.decode(bytes)
```

Knobs:

- **Bind the address at `contract({ chain_id, to })`**, the method at `balanceOf(...)`. The two are intentionally separate — one `contract(...)` can host many method calls.
- **Multiple reads in parallel** — build the `Callable`s, run the `eth_call`s through `Promise.all`, then decode each.
- **No matching binding?** Use `encode_function_call` from `@ethernauta/abi` to build calldata yourself:

```ts
import { address, encode_function_call, uint256 } from "@ethernauta/abi"
import { BytesSchema, Uint256Schema } from "@ethernauta/core"
import { bytes_to_hex } from "@ethernauta/utils"

const calldata = encode_function_call({
  name: "myView",
  args: [address(), uint256()],
  values: [some_address, parse(Uint256Schema, "0x64")],
})
const result = await eth_call([{ to: contract_addr, input: parse(BytesSchema, bytes_to_hex(calldata)) }])(
  reader({ chain_id: MAINNET_CHAIN_ID }),
)
```

Full version: `examples/reading-state/contract-read.ts`.

---

## §6 Connecting a wallet (EIP-6963 discovery)

Every signable flow starts from an EIP-1193 provider discovered via EIP-6963. There is **no chain-config-driven signer factory** — the signer is always built from a discovered provider.

### Manual discovery

Listen for `eip6963:announceProvider` and dispatch `eip6963:requestProvider`. Wallets that match respond synchronously:

```ts
import {
  ANNOUNCE_EVENT,
  type EIP6963AnnounceProviderEvent,
  type EIP6963ProviderDetail,
  REQUEST_EVENT,
} from "@ethernauta/eip/6963"
import type { Provider } from "@ethernauta/eip/1193"
import { create_provider } from "@ethernauta/transport"
import { eth_requestAccounts } from "@ethernauta/eip/1102"

const providers: EIP6963ProviderDetail[] = []

window.addEventListener(ANNOUNCE_EVENT, (event) => {
  const detail = (event as EIP6963AnnounceProviderEvent).detail
  if (!providers.some((p) => p.info.rdns === detail.info.rdns)) {
    providers.push(detail)
  }
})
window.dispatchEvent(new Event(REQUEST_EVENT))

const picked = providers[0]
const { reader: walletReader, signer } = create_provider(picked.provider as Provider)

const [account] = await eth_requestAccounts()(signer({ chain_id: MAINNET_CHAIN_ID }))
```

### Persisted selection across reloads

`@ethernauta/eip/6963` ships storage helpers keyed by an app-owned key. Persist by `rdns`, rehydrate on next load by re-running discovery and matching:

```ts
import {
  set_provider_detail,
  get_provider_detail,
  clear_provider_detail,
  web_storage,
} from "@ethernauta/eip/6963"

const store = web_storage(localStorage)
const key = "wallet"

set_provider_detail({ store, key, provider_detail: picked })

// next page load:
const persisted = await get_provider_detail({ store, key })
// → EIP6963ProviderDetail | null (null = first visit or previously-picked wallet uninstalled)

clear_provider_detail({ store, key }) // "disconnect"
```

### React shortcut

`@ethernauta/react` collapses the whole flow:

```tsx
import { useProvider } from "@ethernauta/react"

const provider = useProvider({ key: "wallet" })
// → { reader, signer } | null
```

Knobs:

- **`rdns` is the persistent identity** (`io.ethernauta`, `io.metamask`, …). `name` / `uuid` can drift.
- **`get_provider_detail` is async** — it re-runs discovery internally to match the persisted rdns against currently-announcing wallets.
- **The cached `Provider` is not persistable** — only `rdns` is stored; the provider object is reacquired on each load.

Full versions: `examples/wallet-connect/example.tsx` (React, manual discovery), `examples/provider-discovery/example.ts` (storage helpers).

---

## §7 Sending a native transaction

Two paths. Both ship. Both are first-class. Pick per call.

### Path 1 — wallet signs + broadcasts

One round trip. The wallet fills `nonce` / `gas` / `maxFeePerGas` / `maxPriorityFeePerGas`, prompts the user, signs, broadcasts.

```ts
import { eth_sendTransaction } from "@ethernauta/eth"
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core"
import { number_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const to = parse(AddressSchema, recipient_address)
const value = parse(UintSchema, number_to_hex(1_000_000_000_000_000n)) // 0.001 ETH in wei
const input = parse(BytesSchema, "0x")

const hash = await eth_sendTransaction([{ to, value, input }])(
  signer({ chain_id: MAINNET_CHAIN_ID }),
)
```

### Path 2 — wallet signs, dapp broadcasts

Two round trips. The dapp gets the signed bytes and owns the broadcast — can inspect, log, retry against a different RPC, route through a private bundler, sign-now-broadcast-later.

```ts
import { eth_signTransaction, eth_sendRawTransaction } from "@ethernauta/eth"

const signed = await eth_signTransaction([{ to, value, input }])(
  signer({ chain_id: MAINNET_CHAIN_ID }),
)

// inspect / persist / re-route `signed` here

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: MAINNET_CHAIN_ID }),
)
```

Rules:

- **Never set `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`.** The wallet fills them. Leaving them unset is the contract.
- **`value` and `input` are hex strings.** Use `number_to_hex(amount)` from `@ethernauta/utils` for amounts in wei.
- **Pick path 2 when the dapp needs control of the broadcast** — bridges, MEV-sensitive flows, audit-heavy systems, idempotency under reorgs. Otherwise path 1.

Full versions: `examples/sending-transactions/example.tsx` (path 2), `examples/end-to-end-transfer/example.tsx` (end-to-end, includes a tracker for §10).

---

## §8 Calling a contract (state-changing)

Same two paths. The ERC binding builds calldata and attaches an `_ethernauta.function` sidecar so the wallet can render a human-readable approval (instead of raw hex).

### Path 1 — via a generated binding

```ts
import { approve } from "@ethernauta/erc/20"
import { AddressSchema, Uint256Schema } from "@ethernauta/core"
import { bigint_to_hex, parse_unit } from "@ethernauta/utils"
import { parse } from "valibot"

const usdc = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
const router = parse(AddressSchema, "0xE592427A0AEce92De3Edee1F18E0157C05861564")
const amount = parse(Uint256Schema, bigint_to_hex(parse_unit("100", 6))) // 100 USDC (6 decimals)

const hash = await approve({ spender: router, value: amount })(
  signer({ chain_id: MAINNET_CHAIN_ID, to: usdc }),
)
```

### Path 2 — wallet signs, dapp broadcasts

Use `eth_signTransaction` with the calldata, then `eth_sendRawTransaction`. The binding's `Signable<Bytes>` form is the path-2 variant (`approve(...)(signer({...}))` returns signed bytes when used that way — full pattern in `examples/smart-contract-call/example.tsx`).

Knobs:

- **The resolver is the `signer`, not `contract({...})`.** Pass the contract address as `to` on the signer's context: `signer({ chain_id, to })`.
- **For an unsupported method**, build calldata with `encode_function_call` from `@ethernauta/abi`, then call `eth_signTransaction` with `{ to, value, input, _ethernauta: { function: <SIGNATURE> } }`. The `_ethernauta.function` sidecar is what lets the wallet render the human-readable approval — without it the wallet shows raw calldata.

### What ERC bindings exist

`@ethernauta/erc` ships bindings as importable subpaths — `@ethernauta/erc/20`, `@ethernauta/erc/721`, `@ethernauta/erc/1155`, `@ethernauta/erc/4626` (ERC-4626 vaults), `@ethernauta/erc/2612` (permit), `@ethernauta/erc/2981` (royalties), `@ethernauta/erc/5805` (voting), `@ethernauta/erc/165` (interface detection), `@ethernauta/erc/137` (ENS — see §12), and more. Each subpath exports its method bindings (`balanceOf`, `transfer`, `approve`, …) as camelCase functions matching the ABI.

Full version: `examples/smart-contract-call/example.tsx`.

---

## §9 Batched calls (EIP-5792)

For "approve + swap", "permit + transfer", any multi-step user action that should be one prompt. The wallet owns the batch lifecycle.

```ts
import { wallet_sendCalls, wallet_getCallsStatus, wallet_getCapabilities } from "@ethernauta/eip/5792"
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core"
import { parse } from "valibot"

const account = parse(AddressSchema, user_address)
const usdc = parse(AddressSchema, usdc_address)
const router = parse(AddressSchema, router_address)
const approve_calldata = parse(BytesSchema, "0x...") // built via @ethernauta/abi
const swap_calldata = parse(BytesSchema, "0x...")

const { id } = await wallet_sendCalls([{
  version: "1.0",
  chainId: parse(UintSchema, "0x1"),
  from: account,
  calls: [
    { to: usdc, data: approve_calldata },
    { to: router, data: swap_calldata },
  ],
}])(signer({ chain_id: MAINNET_CHAIN_ID }))

// poll until done:
const status = await wallet_getCallsStatus([id])(signer({ chain_id: MAINNET_CHAIN_ID }))
// status.status === "PENDING" | "CONFIRMED"
// status.receipts is populated once all calls have mined
```

Rules:

- **Dapps do not track underlying tx hashes themselves** for batched calls — the wallet does. Render UI off `wallet_getCallsStatus(id)`.
- **Branch on `wallet_getCapabilities`** if you care whether the chain supports atomic execution (EIP-7702) vs sequential. Dapps that branch degrade gracefully across wallets.

---

## §10 Tracking a single transaction

For non-batched flows where the dapp needs `pending → mined / reverted` in its UI. No wallet required — reads receipts off any `Readable`.

```ts
import {
  create_tracker,
  register_transaction,
  watch_transaction,
  wait_for_receipt,
  window_store,
} from "@ethernauta/transaction"
import { Hash32Schema } from "@ethernauta/core"
import { parse } from "valibot"

const tracker = create_tracker(CHAINS, { store: window_store })

const hash = parse(Hash32Schema, broadcast_hash)
await register_transaction(hash)(tracker({ chain_id: MAINNET_CHAIN_ID }))

// react to lifecycle transitions:
const unsubscribe = watch_transaction(hash, (tx) => {
  if (tx.status === "mined") { /* … */ }
  if (tx.status === "reverted") { /* … */ }
})(tracker({ chain_id: MAINNET_CHAIN_ID }))

// or await synchronously:
const receipt = await wait_for_receipt([hash])(tracker({ chain_id: MAINNET_CHAIN_ID }))
```

Knobs:

- **`Transaction` is a Valibot-backed discriminated union** (`pending` | `mined` | `reverted`) exported from `@ethernauta/transaction`. Import the type; do not redefine it.
- **`store` dependency-injects persistence.** `window_store` wraps `window.transactions` (a `Map`); pass any `{ get, set }` to back it with `localStorage`, `chrome.storage`, IndexedDB, in-memory for tests.
- **`watch_transaction` returns an unsubscribe**. Wire it into your component's cleanup so unmounted components don't fire state updates after the receipt arrives.
- **`wait_for_receipt` accepts options**: `[hash, { poll_interval_ms, confirmations, timeout_ms }]`.
- **Surviving reloads**: keep the dapp's own list of in-flight hashes in the same `Store`; on next mount, re-attach `watch_transaction` to each.

Full version: `examples/transaction-tracking/example.tsx`.

---

## §11 Signing or verifying a message

| Standard | Signing | Verification |
|---|---|---|
| **EIP-191** personal_sign | `personal_sign([message, account])` from `@ethernauta/eip/191` → `Signable<Bytes>` | `verify_message` from `@ethernauta/crypto` |
| **EIP-712** typed data | `eth_signTypedData_v4([account, typed_data])` from `@ethernauta/eip/712` → `Signable<Bytes>` | `verify_typed_data` from `@ethernauta/crypto` |
| **EIP-1271** contract signatures | (the contract responds to `isValidSignature(hash, sig)`) | `verify_hash` from `@ethernauta/eip/1271` (auto-falls-back to EOA `ecrecover` if `to` is an EOA) |
| **EIP-6492** counterfactual signatures (smart account not yet deployed) | wrap with `wrap_signature` from `@ethernauta/eip/6492` | `verify_hash` (auto-unwraps 6492-wrapped signatures) |

Personal-sign example:

```ts
import { personal_sign } from "@ethernauta/eip/191"

const signature = await personal_sign(["Hello, world", account])(
  signer({ chain_id: MAINNET_CHAIN_ID }),
)
```

Universal verification (works across all four standards):

```ts
import { verify_message } from "@ethernauta/crypto"

const ok = await verify_message({
  address: claimed_signer,
  message: "Hello, world",
  signature,
})(reader({ chain_id: MAINNET_CHAIN_ID }))
```

`@ethernauta/crypto`'s `verify_*` operations are the universal entry point — they pick the right verification path (EOA vs 1271 contract call vs 6492 counterfactual) automatically. Use them whenever the dapp consumes a signature it didn't itself produce.

---

## §12 ENS

ENS lives at `@ethernauta/erc/137` (ENS = ERC-137). ENSIP-15 normalization is split into `@ethernauta/ens`.

```ts
import {
  get_ens_name,
  get_ens_address,
  get_ens_avatar,
  get_ens_text,
} from "@ethernauta/erc/137"
import { AddressSchema } from "@ethernauta/core"
import { parse } from "valibot"

const vitalik = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045")

const name = await get_ens_name({ address: vitalik })(reader({ chain_id: MAINNET_CHAIN_ID }))
// → "vitalik.eth" | null

const address = await get_ens_address({ name: "vitalik.eth" })(reader({ chain_id: MAINNET_CHAIN_ID }))
const avatar = await get_ens_avatar({ name: "vitalik.eth" })(reader({ chain_id: MAINNET_CHAIN_ID }))
const url = await get_ens_text({ name: "vitalik.eth", key: "url" })(reader({ chain_id: MAINNET_CHAIN_ID }))
```

Knobs:

- **Pass user-typed names through `normalize` from `@ethernauta/ens`** before resolving — emoji, casing, and confusable characters need ENSIP-15 normalization to produce the right namehash.
- **Reverse resolution (`get_ens_name`) returns `null`** if no reverse record is set; this is normal — most addresses don't have a primary name.
- **Resolution uses the chain's public RPC.** ENS lives on mainnet; pass the mainnet chain id to the reader even if the dapp's primary chain is something else.

---

## §13 Errors

Three sources, three distinct shapes:

| Source | Shape | When |
|---|---|---|
| User rejected in wallet | `{ code: 4001, message: "User rejected request" }` | Any signer flow |
| RPC error response | `Error(response.error.message)` | Reader / Writer / Contract flows |
| No provider connected | `Error("Connect a wallet first.")` (raise yourself) | Signer flow reached before EIP-6963 selection |

Rules:

- **Wrap every entry-point call in try/catch.** Don't let the page-level error boundary catch a 4001 — render an inline soft message ("connect again to continue") instead of a stack trace.
- **Never use `safeParse` to swallow validation errors.** `parse` throws by design — surface the error or let it bubble.
- **Never log private keys, mnemonics, or signed-but-unsent transactions.** The signed bytes are not secret in the cryptographic sense, but logging them creates an idempotency hazard (the same tx broadcast twice through two paths).
- **Distinguish 4001 from other errors** in UI copy. 4001 is expected user behavior; the rest are usually misconfiguration or chain state.

Full version: `examples/errors/example.tsx`.

---

## §14 Where things live (imports)

| Package | Symbols you reach for |
|---|---|
| `@ethernauta/chain` | `eip155_1`, `eip155_10`, `eip155_137`, `eip155_8453`, `eip155_11155111`, … (one subpath per chain) |
| `@ethernauta/transport` | `create_reader`, `create_writer`, `create_provider`, `contract`, `http`, `encode_chain_id`; types `Readable<T>`, `Writable<T>`, `Signable<T>`, `Callable<T>`, `ProviderResolver` |
| `@ethernauta/eth` | Every `eth_*` method; `RECEIPT_STATUS`, `is_post_byzantium` |
| `@ethernauta/transaction` | `create_tracker`, `register_transaction`, `watch_transaction`, `wait_for_receipt`, `set_transaction`, `window_store`; types `Transaction`, `Store`, `PendingTransaction`, `MinedTransaction`, `RevertedTransaction` |
| `@ethernauta/eip/1102` | `eth_requestAccounts` |
| `@ethernauta/eip/1193` | `Provider` type |
| `@ethernauta/eip/6963` | `ANNOUNCE_EVENT`, `REQUEST_EVENT`, `set_provider_detail`, `get_provider_detail`, `clear_provider_detail`, `web_storage`; types `EIP6963ProviderDetail`, `EIP6963AnnounceProviderEvent` |
| `@ethernauta/eip/5792` | `wallet_sendCalls`, `wallet_getCallsStatus`, `wallet_getCapabilities` |
| `@ethernauta/eip/191` | `personal_sign` |
| `@ethernauta/eip/712` | `eth_signTypedData_v4`, typed-data schemas |
| `@ethernauta/eip/1271` | `verify_hash`, `verify_message`, `verify_typed_data`, `MAGIC_VALUE` |
| `@ethernauta/eip/6492` | `wrap_signature`, `unwrap_signature`, `is_6492_signature` |
| `@ethernauta/eip/7702` | `wallet_signAuthorization`, `wallet_sendSetCodeTransaction` |
| `@ethernauta/eip/1014` | `get_create2_address`, `get_contract_address`, `deploy_contract` |
| `@ethernauta/erc/20` | `transfer`, `approve`, `balanceOf`, `totalSupply`, `allowance`, `transferFrom`; metadata extension `decimals`, `symbol`, `name` |
| `@ethernauta/erc/721` | `ownerOf`, `tokenURI`, `safeTransferFrom`, `approve`, … |
| `@ethernauta/erc/1155` | `balanceOf`, `balanceOfBatch`, `safeTransferFrom`, … |
| `@ethernauta/erc/4626` | `deposit`, `mint`, `withdraw`, `redeem`, `previewDeposit`, … |
| `@ethernauta/erc/2612` | EIP-2612 permit (gasless approvals) |
| `@ethernauta/erc/137` | `get_ens_name`, `get_ens_address`, `get_ens_avatar`, `get_ens_text`, `namehash`, `ENS_REGISTRY` |
| `@ethernauta/ens` | `normalize` (ENSIP-15) |
| `@ethernauta/crypto` | `verify_message`, `verify_typed_data`, `verify_hash` (universal across 191/712/1271/6492); BIP-32/39/44 key derivation |
| `@ethernauta/abi` | `encode_function_call`, `decode_function_result`; codecs `address`, `uint256`, `bytes32`, `bool`, `string`, … |
| `@ethernauta/react` | `useProvider`, `useProviderDetail`; types `Provider` |
| `@ethernauta/utils` | `number_to_hex`, `hex_to_number`, `bigint_to_hex`, `bytes_to_hex`, `hex_to_bytes`, `parse_unit`, `format_unit`, `deadline_in`, `now_to_big`, `rlp_encode` |
| `@ethernauta/core` | Valibot primitives — `AddressSchema`, `BytesSchema`, `Bytes4Schema`, `Bytes32Schema`, `Hash32Schema`, `UintSchema`, `Uint8Schema`, `Uint256Schema` |

---

## §15 Always-on rules

These bind every dapp call regardless of section.

1. **`method(args)(resolver({...}))` never collapses.** Two calls in order; first binds parameters, second binds transport.
2. **Validate at boundaries with `parse(schema, raw)` — never `safeParse`.** Throws are the contract.
3. **Never set `nonce` / `gas` / `maxFeePerGas` / `maxPriorityFeePerGas`.** The wallet fills them.
4. **Module-scope factories, per-call resolvers.** Build `create_reader` / `create_writer` / `create_provider` once; call `reader({ chain_id })` / `signer({ chain_id })` per call.
5. **Hex literals go through `parse` before flowing into typed positions.** Core primitives are nominally branded — a raw `"0x..."` is not assignable to an `Address` slot. The fix is always `parse(AddressSchema, raw)`, never an `as` cast.
6. **For value-bearing types, write a Valibot schema first and derive the type via `InferOutput`.** Never hand-roll `interface` / `type X = { ... }` for shapes that cross boundaries.

---

## How to use this skill

1. Read §0, pick the matching section.
2. Read that section. If the inline snippet is enough — use it.
3. If the user needs the full runnable form (React component, full setup, error wiring), open `examples/<name>/example.ts` in this skill folder.
4. Adapt the chain id, addresses, amounts. Keep the **call shape** exactly as shown — module-scope factories, per-call resolvers, two-step curried invocation.
5. If the dapp needs something not in this skill, the gap is real — flag it to the user. Do not invent patterns.
