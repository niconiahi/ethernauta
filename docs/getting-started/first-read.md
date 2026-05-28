---
title: First read
section: Getting Started
section_order: 1
order: 3
---

# First read

A chain read. No wallet required. Ten lines.

```ts
import { create_reader } from "@ethernauta/transport";
import { eth_blockNumber, eth_getBalance } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111";

const reader = create_reader([eip155_1, eip155_11155111]);

const number = await eth_blockNumber()(
  reader({ chain_id: eip155_1.chain_id }),
);

const balance = await eth_getBalance({
  address: "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
  block: "latest",
})(reader({ chain_id: eip155_1.chain_id }));
```

## What just happened

**`create_reader([chains])`** — built a `Reader` factory that knows how to dial public RPC endpoints for any chain you pass in. The `chain` objects carry their own RPC URL list.

**`eth_blockNumber()`** — first call. Binds the method's parameters (none, in this case). Returns a curried function with the shape `(_resolved: ResolvedReader) => Promise<Uint>`.

**`reader({ chain_id: eip155_1.chain_id })`** — built a `ResolvedReader` for mainnet by picking the chain out of the registry.

**The outer call** — passes the resolved reader into the curried method. The HTTP request happens here.

The two-call shape — `method(args)(resolver(...))` — is **never collapsed.** The first call binds parameters; the second binds the transport. That separation is what lets the same `eth_blockNumber` run against a public RPC reader, an EIP-1193 provider, or a test mock with zero changes at the call site.

## Different chains, same call shape

```ts
const mainnet_block = await eth_blockNumber()(
  reader({ chain_id: eip155_1.chain_id }),
);

const sepolia_block = await eth_blockNumber()(
  reader({ chain_id: eip155_11155111.chain_id }),
);
```

One reader, many chains. The `chain_id` argument picks the RPC at call time.

## Where the URLs come from

The reader doesn't hard-code endpoints. Each chain definition in `@ethernauta/chain` carries an `rpc` array of public endpoints. The HTTP transport rotates through them on failure. You can pass your own list if you want to point at a private RPC.

## Next

- [First signature](/getting-started/first-signature) — sign and broadcast.
- [Reading from the chain](/guides/reading-chain) — the full `eth_*` read surface.
- [Concepts → resolver shapes](/concepts/resolver-shapes) — why `Reader` exists at all.
