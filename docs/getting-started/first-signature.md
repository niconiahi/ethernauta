---
title: First signature
section: Getting Started
section_order: 1
order: 4
---

# First signature

Sign a transaction and broadcast it. There are two ways. **Both ship.**

## Path 1 — wallet does it all

The wallet signs and broadcasts; you get back a hash. One round trip.

```ts
import { create_signer } from "@ethernauta/transport";
import { eth_sendTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const signer = create_signer([eip155_1]);

const hash = await eth_sendTransaction({
  to: "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
  value: "0x16345785D8A0000",
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));
```

The wallet fills in `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. The dapp never sets them. The popup confirms with the user. The wallet broadcasts.

## Path 2 — wallet signs, dapp broadcasts

The wallet returns signed bytes; the dapp owns the broadcast.

```ts
import { create_signer, create_writer } from "@ethernauta/transport";
import { eth_signTransaction, eth_sendRawTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const signer = create_signer([eip155_1]);
const writer = create_writer([eip155_1]);

const signed = await eth_signTransaction({
  to: "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
  value: "0x16345785D8A0000",
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));

const hash = await eth_sendRawTransaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

Two round trips, but you can inspect, log, retry, or even broadcast through a different RPC endpoint than the one the wallet would have used. The signing and the broadcasting are now separately owned.

## Why both exist

This is the **primitives-first** position: the wallet is one strategy, primitive composition is another, and the library refuses to pick. Most dapps want path 1 because it's shorter. Some dapps — bridges, MEV-sensitive flows, anything that wants control of the broadcast — want path 2. Collapsing the choice would force the second category through an awkward workaround.

The reverse holds too: every primitive operation the wallet uses internally is the same one exposed on the dapp side. The wallet's `eth_sendTransaction` handler composes `encode_eip155_transaction_unsigned`, signs it, and broadcasts via `eth_sendRawTransaction` — the same primitives an off-wallet dapp would call.

## Resolvers, recap

- `Reader` — chain reads, no wallet.
- `Writer` — broadcast pre-signed bytes, no wallet.
- `Signer` — anything that needs the wallet (signing, account access, chain switching).
- `Callable` — `eth_call`-shaped contract reads, no wallet.

[Concepts → resolver shapes](/concepts/resolver-shapes) goes deeper. [Concepts → two paths](/concepts/two-paths) makes the trade-off concrete.
