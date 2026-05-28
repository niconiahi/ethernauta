[![bundlejs](https://deno.bundlejs.com/badge?q=@ethernauta/transaction&treeshake=[*])](https://deno.bundlejs.com/?q=@ethernauta/transaction&treeshake=[*])

## Philosophy

This module ships **client-side transaction lifecycle tracking** — pending → mined → reverted — backed by a pluggable store and powered by `eth_getTransactionReceipt` polling. It is the fifth resolver shape after `Readable<T>` / `Writable<T>` / `Signable<T>` / `Callable<T>`: `Trackable<T>` (and the subscription-shaped `Watchable`).

No coordinated server, no hosted indexer, no wallet release: the dapp persists what it submitted, polls receipts, and renders lifecycle in its UI. Tracking is opt-in — single-hash polls can stay inline (see the example in `@ethernauta/eth`); this package is for dapps that want a typed store and a subscription model.

## Modules

- [abi](https://github.com/niconiahi/ethernauta/tree/main/packages/abi) [[NPM](https://www.npmjs.com/package/@ethernauta/abi)]
- [chain](https://github.com/niconiahi/ethernauta/tree/main/packages/chain) [[NPM](https://www.npmjs.com/package/@ethernauta/chain)]
- [cli](https://github.com/niconiahi/ethernauta/tree/main/packages/cli) [[NPM](https://www.npmjs.com/package/@ethernauta/cli)]
- [core](https://github.com/niconiahi/ethernauta/tree/main/packages/core) [[NPM](https://www.npmjs.com/package/@ethernauta/core)]
- [crypto](https://github.com/niconiahi/ethernauta/tree/main/packages/crypto) [[NPM](https://www.npmjs.com/package/@ethernauta/crypto)]
- [eip](https://github.com/niconiahi/ethernauta/tree/main/packages/eip) [[NPM](https://www.npmjs.com/package/@ethernauta/eip)]
- [ens](https://github.com/niconiahi/ethernauta/tree/main/packages/ens) [[NPM](https://www.npmjs.com/package/@ethernauta/ens)]
- [erc](https://github.com/niconiahi/ethernauta/tree/main/packages/erc) [[NPM](https://www.npmjs.com/package/@ethernauta/erc)]
- [eth](https://github.com/niconiahi/ethernauta/tree/main/packages/eth) [[NPM](https://www.npmjs.com/package/@ethernauta/eth)]
- [react](https://github.com/niconiahi/ethernauta/tree/main/packages/react) [[NPM](https://www.npmjs.com/package/@ethernauta/react)]
- [transaction](https://github.com/niconiahi/ethernauta/tree/main/packages/transaction) [[NPM](https://www.npmjs.com/package/@ethernauta/transaction)]
- [transport](https://github.com/niconiahi/ethernauta/tree/main/packages/transport) [[NPM](https://www.npmjs.com/package/@ethernauta/transport)]
- [utils](https://github.com/niconiahi/ethernauta/tree/main/packages/utils) [[NPM](https://www.npmjs.com/package/@ethernauta/utils)]
- [wallet](https://github.com/niconiahi/ethernauta/tree/main/packages/wallet)

## API

### `create_tracker` — the factory

```ts
import { create_tracker, window_store } from "@ethernauta/transaction"
import { http } from "@ethernauta/transport"

const tracker = create_tracker(
  [{ chainId: SEPOLIA_CHAIN_ID, transports: [http(RPC_URL)] }],
  { store: window_store },
)
```

The exported `Tracker` type is `ReturnType<typeof create_tracker>`. The matching method shapes:

```ts
import type { Trackable, Watchable, TrackContext } from "@ethernauta/transaction"
```

### `register_transaction` — seed a pending record

Call right after `eth_sendRawTransaction` (or `eth_sendTransaction`) resolves, so the UI can render "pending" immediately.

```ts
import { register_transaction } from "@ethernauta/transaction"

const pending = await register_transaction(hash)(
  tracker({ chain_id: SEPOLIA_CHAIN_ID }),
)
// { hash, status: "pending" }
```

### `watch_transaction` — subscribe to transitions

Polls `eth_getTransactionReceipt`; on each transition (`pending → mined` / `reverted`) the new record is persisted to the store and `callback` is invoked. Returns an `unsubscribe` function — call it from `useEffect` cleanup so unmounted components don't fire `setState`.

```ts
import { watch_transaction } from "@ethernauta/transaction"

const unsubscribe = watch_transaction(hash, (transaction) => {
  // transaction.status: "pending" | "mined" | "reverted"
})(tracker({ chain_id: SEPOLIA_CHAIN_ID }))

// later (e.g. component unmount):
unsubscribe()
```

### `wait_for_receipt` — block until confirmed

```ts
import { wait_for_receipt } from "@ethernauta/transaction"

const receipt = await wait_for_receipt([hash, {
  confirmations: 3,
  poll_interval_ms: 1000,
  timeout_ms: 60_000,
}])(tracker({ chain_id: SEPOLIA_CHAIN_ID }))
// receipt: ConfirmedReceipt — the standard receipt fields plus
// a live `confirmations` count.
```

The `ConfirmedReceipt` type and matching `ConfirmedReceiptSchema` are exported alongside.

### `set_transaction` — write any record directly

Used internally by `watch_transaction`; exported so callers that hold a `Transaction` value from outside the watcher (a restored backup, a sync from another tab) can persist it.

```ts
import { set_transaction } from "@ethernauta/transaction"

await set_transaction(record)(tracker({ chain_id: SEPOLIA_CHAIN_ID }))
```

### Store — pluggable persistence

```ts
import { window_store, type Store } from "@ethernauta/transaction"

// `window_store` — default. Browser-only, lazily creates
// `window.transactions: Map<Hash32, Transaction>`.

// A custom backend implements:
//   get(hash): Promise<Transaction | undefined>
//   set(hash, transaction): Promise<void>
// — async-shaped so chrome.storage.session, IndexedDB, or a
// remote KV all drop in unchanged.
```

### Lifecycle schemas

```ts
import {
  type Transaction,
  type PendingTransaction,
  type MinedTransaction,
  type RevertedTransaction,
  TransactionSchema,
  PendingTransactionSchema,
  MinedTransactionSchema,
  RevertedTransactionSchema,
} from "@ethernauta/transaction"
```

`Transaction` is the discriminated union (`pending` | `mined` | `reverted`) used by every verb and stored in the `Store`.
