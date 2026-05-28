---
title: "@ethernauta/transaction"
section: Overview
section_order: 7
order: 7
---

# @ethernauta/transaction

Transaction lifecycle tracking. Once a tx is broadcast, you need to know whether it's pending, mined, reverted, or replaced. This package layers `Trackable<T>` and `Watchable` over the `Readable<T>` primitives in `@ethernauta/eth`.

```bash
pnpm add @ethernauta/transaction
```

## Core idea

A `Tracker` is a `Reader` plus a `Store`. The store persists pending transaction metadata so a page reload doesn't lose track of an outstanding broadcast. Polling for the receipt happens against the reader; the store is what makes the polling survive.

## Setting up

```ts
import { create_tracker, create_store } from "@ethernauta/transaction";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const store = create_store({ namespace: "my-dapp", backend: localStorage });
const tracker = create_tracker([eip155_1], { store });
```

`create_store` accepts any `Storage`-like backend — `localStorage`, `sessionStorage`, or your own implementation of the `Store` interface.

## Registering a broadcast

```ts
import { register_transaction, set_transaction } from "@ethernauta/transaction";

// after broadcasting, register the hash with metadata
await register_transaction({
  hash,
  chain_id: eip155_1.chain_id,
  meta: { intent: "approve USDC" },
})(tracker({ chain_id: eip155_1.chain_id }));
```

Stored as a `PendingTransaction`. Re-running the dapp later will pick it up on tracker construction.

`set_transaction` is the lower-level setter; `register_transaction` is the typical entry point.

## Waiting for a receipt

```ts
import { wait_for_receipt } from "@ethernauta/transaction";

const receipt = await wait_for_receipt({ hash })(
  tracker({ chain_id: eip155_1.chain_id }),
);
// → ConfirmedReceipt
```

Polls `eth_getTransactionReceipt` at the tracker's interval, resolves when the receipt appears. Built on top of `Readable<T>` — no wallet needed.

## Watching with a callback

```ts
import { watch_transaction } from "@ethernauta/transaction";

const unsubscribe = watch_transaction({
  hash,
  on_receipt: (receipt) => {
    console.log("mined", receipt);
  },
  on_error: (err) => {
    console.log("dropped or replaced", err);
  },
})(tracker({ chain_id: eip155_1.chain_id }));
```

Returns a `Watchable` — an unsubscribe function. Use when you want side effects on receipt arrival rather than awaiting.

## Surface

| Export | Shape | Purpose |
|---|---|---|
| `create_tracker(CHAINS, { store })` | factory | Build a tracker bound to a list of chains. |
| `create_store({ namespace, backend })` | factory | Persistence layer. |
| `register_transaction(args)` | `Trackable<void>` | Add a broadcast to the registry. |
| `set_transaction(args)` | `Trackable<void>` | Lower-level setter. |
| `wait_for_receipt(args)` | `Trackable<ConfirmedReceipt>` | Resolve when mined. |
| `watch_transaction(args)` | `Trackable<Watchable>` | Subscribe to lifecycle events. |
| `registry` | `Map<Hash32, Transaction>` | In-memory mirror of the store. |

## Types

- `Tracker` — the factory return type.
- `TrackContext`, `ResolvedTracker` — the resolved shape passed to methods.
- `Trackable<T>` — `(_resolved: ResolvedTracker) => Promise<T>`.
- `Watchable` — `() => void` (unsubscribe).
- `Store` — `{ get, set, delete, keys }`.
- `PendingTransaction`, `ConfirmedReceipt`, `Transaction` — record shapes.

## Why a separate package

Tracking is read-only but stateful. `Readable<T>` is the shape of stateless reads; mixing in store-bound state would muddle the contract.

Splitting it out also lets dapps that don't need persistence (one-shot scripts, server-side flows) avoid pulling in the storage abstraction.

## See also

- [Guide → tracking a transaction lifecycle](/guides/tracking-lifecycle)
- [@ethernauta/eth → eth_getTransactionReceipt](/eth/overview) — the underlying read.
- [Concepts → resolver shapes](/concepts/resolver-shapes) — `Trackable<T>` in context.
