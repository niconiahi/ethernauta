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
  window_store,
} from "@ethernauta/transaction";
import { encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
```

`window_store` is the default `Store` (wraps a `Map` on `window.transactions`). Pass any object satisfying the `Store` interface — `{ get, set }` — to back it with `localStorage`, `chrome.storage`, IndexedDB, etc.

## After broadcasting

```ts
import {
  create_tracker,
  register_transaction,
  window_store,
} from "@ethernauta/transaction";
import { eth_sendRawTransaction } from "@ethernauta/eth";
import { create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
const signed = parse(BytesSchema, "0x");

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: CHAIN_ID }),
);
const pending = await register_transaction(hash)(
  tracker({ chain_id: CHAIN_ID }),
);
```

The tracker now owns the hash. `register_transaction` returns the `PendingTransaction` record it wrote to the store.

## Awaiting the receipt

```ts
import { create_tracker, wait_for_receipt, window_store } from "@ethernauta/transaction";
import { RECEIPT_STATUS, is_post_byzantium } from "@ethernauta/eth";
import { encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { Hash32Schema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
const hash = parse(Hash32Schema, "0x" + "0".repeat(64));

const receipt = await wait_for_receipt([hash])(
  tracker({ chain_id: CHAIN_ID }),
);

if (is_post_byzantium(receipt) && receipt.status === RECEIPT_STATUS.SUCCESS) {
  // mined and didn't revert
} else {
  // mined but reverted (or pre-Byzantium — no `status` field)
}
```

`wait_for_receipt` polls at the tracker's interval (default 2s; configurable via `[hash, { poll_interval_ms, confirmations, timeout_ms }]`). Resolves when the receipt is available and the confirmation threshold is reached.

## Watching with a callback

```ts
import { create_tracker, watch_transaction, window_store } from "@ethernauta/transaction";
import { encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { Hash32Schema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
const hash = parse(Hash32Schema, "0x" + "0".repeat(64));

const unsubscribe = watch_transaction(hash, (transaction) => {
  if (transaction.status === "mined") {
    // mined and didn't revert
  } else if (transaction.status === "reverted") {
    // mined but reverted
  }
})(tracker({ chain_id: CHAIN_ID }));
```

Returns an unsubscribe function. Use when you want side effects on lifecycle transitions rather than awaiting.

## Surviving reloads

The store is the key. If the page reloads while a tx is pending, the tracker keeps reading from the same `Store`, and you can pick up the in-flight hash and re-attach a watcher:

```ts
import { create_tracker, watch_transaction, window_store } from "@ethernauta/transaction";
import { encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { Hash32Schema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const tracker = create_tracker(
  [{ chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] }],
  { store: window_store },
);
const pending_hash = parse(Hash32Schema, "0x" + "0".repeat(64));

watch_transaction(pending_hash, (_transaction) => {
  // re-attached after reload
})(tracker({ chain_id: CHAIN_ID }));
```

The dapp owns the bookkeeping of which hashes are in-flight — typically by keeping a list under its own key in the same `Store`.

## See also

- [@ethernauta/transaction](/transaction/overview) — full surface.
- [@ethernauta/eth → eth_getTransactionReceipt](/eth/overview) — the underlying read.
