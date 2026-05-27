---
title: Tracking a transaction lifecycle
section: Guides
section_order: 3
order: 3
---

# Tracking a transaction lifecycle

Once a transaction is broadcast, you need to know when it mines, whether it reverts, or whether it gets dropped. `@ethernauta/transaction` is the layer that handles this — receipt polling on top of `Readable<T>`, with a `Store` so pending state survives page reloads.

```ts
import {
  create_tracker,
  create_store,
  register_transaction,
  wait_for_receipt,
  watch_transaction,
} from "@ethernauta/transaction";
import { eip155_1 } from "@ethernauta/chain";

const store = create_store({ namespace: "my-dapp", backend: localStorage });
const tracker = create_tracker([eip155_1], { store });
```

## After broadcasting

```ts
import { eth_send_raw_transaction } from "@ethernauta/eth";

const hash = await eth_send_raw_transaction(signed)(writer);

await register_transaction({
  hash,
  chain_id: eip155_1.chain_id,
  meta: { intent: "swap 100 USDC for ETH" },
})(tracker({ chain_id: eip155_1.chain_id }));
```

The tracker now owns the hash. The metadata is whatever you want to remember about it.

## Awaiting the receipt

```ts
const receipt = await wait_for_receipt({ hash })(
  tracker({ chain_id: eip155_1.chain_id }),
);

if (receipt.status === "success") {
  // mined and didn't revert
} else {
  // mined but reverted
}
```

`wait_for_receipt` polls at the tracker's interval (default 2s; configurable). Resolves when the receipt is available.

## Watching with a callback

```ts
const unsubscribe = watch_transaction({
  hash,
  on_receipt: (receipt) => {
    if (receipt.status === "success") {
      show_success();
    } else {
      show_reverted(receipt);
    }
  },
  on_error: (err) => {
    // dropped, replaced, network error
  },
})(tracker({ chain_id: eip155_1.chain_id }));
```

Returns an unsubscribe function. Use when you want side effects on receipt arrival rather than awaiting.

## Surviving reloads

The store is the key. If the page reloads while a tx is pending, the tracker rehydrates its registry from the store on construction, and you can pick up where you left off:

```ts
const tracker = create_tracker([eip155_1], { store });

// query pending txs for the current chain
const pending = Array.from(registry.values()).filter((tx) => tx.status === "pending");

for (const tx of pending) {
  watch_transaction({ hash: tx.hash, on_receipt, on_error })(
    tracker({ chain_id: tx.chain_id }),
  );
}
```

The `registry` export is the in-memory mirror; the `Store` is the persistent backing.

## See also

- [@ethernauta/transaction](/transaction/overview) — full surface.
- [@ethernauta/eth → eth_get_transaction_receipt](/eth/overview) — the underlying read.
