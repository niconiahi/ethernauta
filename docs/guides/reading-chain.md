---
title: Reading from the chain
section: Guides
section_order: 3
order: 1
---

# Reading from the chain

Chain reads do not require a wallet. They go through a `Readable<T>` resolver built from a list of chain definitions.

```ts
import { create_reader } from "@ethernauta/transport";
import { eth_block_number, eth_get_balance, eth_call } from "@ethernauta/eth";
import { eip155_1, eip155_11155111 } from "@ethernauta/chain";

const reader = create_reader([eip155_1, eip155_11155111]);

const block_number = await eth_block_number()(
  reader({ chain_id: eip155_1.chain_id }),
);

const balance = await eth_get_balance({
  address: holder,
  block: "latest",
})(reader({ chain_id: eip155_1.chain_id }));
```

The two-call shape — `method(args)(resolver(...))` — is **never collapsed**. The first call binds parameters; the second binds the transport. That separation is what lets the same method run against a public RPC reader, an EIP-1193 provider, or a test mock without changing the call site.

## Reading across multiple chains

```ts
const mainnet_block = await eth_block_number()(
  reader({ chain_id: eip155_1.chain_id }),
);

const sepolia_block = await eth_block_number()(
  reader({ chain_id: eip155_11155111.chain_id }),
);
```

One reader, many chains. The `chain_id` picks the RPC at call time.

## Batching reads with multicall

```ts
import { create_multicall } from "@ethernauta/transport";

const multicall = create_multicall([eip155_1]);

const [block, balance, code] = await multicall({
  chain_id: eip155_1.chain_id,
}).all([
  eth_block_number(),
  eth_get_balance({ address, block: "latest" }),
  eth_get_code({ address, block: "latest" }),
]);
```

Three reads, one HTTP request. The transport packs them into a JSON-RPC batch.

## Pointing at a custom RPC

The chain definitions in `@ethernauta/chain` carry public RPC URLs. Override the `rpc` field for a private endpoint:

```ts
import { eip155_1 } from "@ethernauta/chain";

const reader = create_reader([
  { ...eip155_1, rpc: ["https://my-private-rpc.example.com"] },
]);
```

## Reading through a wallet's provider

If your dapp already has a 1193 provider (the wallet, an injected wallet, an EIP-6963 announcement), you can read through it instead of dialing public RPC directly:

```ts
import { create_provider } from "@ethernauta/transport";

const provider = create_provider(window.ethereum);

const block = await eth_block_number()(
  provider.reader({ chain_id: eip155_1.chain_id }),
);
```

The call shape is identical to the public-RPC reader. Only the transport-construction line differs.

## See also

- [@ethernauta/eth](/eth/overview) — every read method.
- [@ethernauta/transport](/transport/overview) — factories, HTTP, WebSocket, multicall.
- [Concepts → resolver shapes](/concepts/resolver-shapes).
