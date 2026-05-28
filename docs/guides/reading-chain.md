---
title: Reading from the chain
section: Guides
section_order: 3
order: 1
---

# Reading from the chain

Chain reads do not require a wallet. They go through a `Readable<T>` resolver built from a list of chain definitions.

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eth_blockNumber, eth_getBalance } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID_1 = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const CHAIN_ID_SEPOLIA = encode_chain_id({ namespace: "eip155", reference: eip155_11155111.chainId });

const reader = create_reader([
  { chainId: CHAIN_ID_1, transports: [http("https://ethereum-rpc.publicnode.com")] },
  { chainId: CHAIN_ID_SEPOLIA, transports: [http("https://ethereum-sepolia-rpc.publicnode.com")] },
]);

const block_number = await eth_blockNumber()(
  reader({ chain_id: CHAIN_ID_1 }),
);

const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const balance = await eth_getBalance([holder, "latest"])(reader({ chain_id: CHAIN_ID_1 }));
```

The two-call shape — `method(args)(resolver(...))` — is **never collapsed**. The first call binds parameters; the second binds the transport. That separation is what lets the same method run against a public RPC reader, an EIP-1193 provider, or a test mock without changing the call site.

## Reading across multiple chains

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eth_blockNumber } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111";

const CHAIN_ID_1 = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const CHAIN_ID_SEPOLIA = encode_chain_id({ namespace: "eip155", reference: eip155_11155111.chainId });

const reader = create_reader([
  { chainId: CHAIN_ID_1, transports: [http("https://ethereum-rpc.publicnode.com")] },
  { chainId: CHAIN_ID_SEPOLIA, transports: [http("https://ethereum-sepolia-rpc.publicnode.com")] },
]);

const mainnet_block = await eth_blockNumber()(
  reader({ chain_id: CHAIN_ID_1 }),
);

const sepolia_block = await eth_blockNumber()(
  reader({ chain_id: CHAIN_ID_SEPOLIA }),
);
```

One reader, many chains. The `chain_id` picks the RPC at call time.

## Batching reads with multicall

```ts
import {
  create_multicall,
  contract,
  encode_chain_id,
  http,
} from "@ethernauta/transport";
import { balanceOf } from "@ethernauta/erc/20";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

const multicall = create_multicall([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const token = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const tokenCtx = contract({ chain_id: CHAIN_ID, to: token });

const [balance] = await multicall([
  balanceOf([holder])(tokenCtx),
]);
```

Three reads, one HTTP request. The transport packs them into a JSON-RPC batch.

## Pointing at a custom RPC

The chain definitions in `@ethernauta/chain` carry public RPC URLs. Override the `rpc` field for a private endpoint:

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://my-private-rpc.example.com")] },
]);
```

## Reading through a wallet's provider

If your dapp already has a 1193 provider (the wallet, an injected wallet, an EIP-6963 announcement), you can read through it instead of dialing public RPC directly:

```ts
import { create_provider } from "@ethernauta/transport";
import { eth_blockNumber } from "@ethernauta/eth";
import type { Provider } from "@ethernauta/eip/1193";
import { encode_chain_id } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

declare const injected: Provider;
const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

const provider = create_provider(injected);

const block = await eth_blockNumber()(
  provider.reader({ chain_id: CHAIN_ID }),
);
```

The call shape is identical to the public-RPC reader. Only the transport-construction line differs.

## See also

- [@ethernauta/eth](/eth/overview) — every read method.
- [@ethernauta/transport](/transport/overview) — factories, HTTP, WebSocket, multicall.
- [Concepts → resolver shapes](/concepts/resolver-shapes).
