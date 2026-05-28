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
import { parse } from "valibot";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import type { Provider } from "@ethernauta/eip/1193";
import { create_provider, encode_chain_id } from "@ethernauta/transport";
import { eth_sendTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

// Acquire `provider` via EIP-6963 discovery — see /eips/6963.
declare const provider: Provider;
const { signer } = create_provider(provider);

const to = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045");
const value = parse(UintSchema, "0x16345785D8A0000");
const input = parse(BytesSchema, "0x");

const hash = await eth_sendTransaction([{ to, value, input }])(
  signer({ chain_id: CHAIN_ID }),
);
void hash;
```

The wallet fills in `nonce`, `gas`, `maxFeePerGas`, `maxPriorityFeePerGas`. The dapp never sets them. The popup confirms with the user. The wallet broadcasts.

## Path 2 — wallet signs, dapp broadcasts

The wallet returns signed bytes; the dapp owns the broadcast.

```ts
import { parse } from "valibot";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import type { Provider } from "@ethernauta/eip/1193";
import { create_provider, create_writer, encode_chain_id, http } from "@ethernauta/transport";
import { eth_signTransaction, eth_sendRawTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

declare const provider: Provider; // see /eips/6963 for discovery
const { signer } = create_provider(provider);

const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const to = parse(AddressSchema, "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045");
const value = parse(UintSchema, "0x16345785D8A0000");
const input = parse(BytesSchema, "0x");

const signed = await eth_signTransaction([{ to, value, input }])(
  signer({ chain_id: CHAIN_ID }),
);

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: CHAIN_ID }),
);
void hash;
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
