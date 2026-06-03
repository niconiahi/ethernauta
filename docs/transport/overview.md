---
title: "@ethernauta/transport"
section: Overview
section_order: 7
order: 5
---

# @ethernauta/transport

The transport layer. Four resolver factories, HTTP and WebSocket transports, multicall batching, contract address binding, and 1193-provider adaptation.

```bash
pnpm add @ethernauta/transport
```

This package defines the **shapes** that every method binding in the monorepo speaks: `Readable<T>`, `Writable<T>`, `Signable<T>`, `Callable<T>`. See [Concepts → resolver shapes](/concepts/resolver-shapes) for the philosophy.

## The four factories

```ts
import type { Provider } from "@ethernauta/eip/1193";
import {
  create_provider,
  create_reader,
  create_writer,
  contract,
  encode_chain_id,
  http,
} from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { eip155_8453 } from "@ethernauta/chain/eip155-8453";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID_1 = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const CHAIN_ID_8453 = encode_chain_id({ namespace: "eip155", reference: eip155_8453.chainId });

const reader = create_reader([
  { chainId: CHAIN_ID_1, transports: [http("https://ethereum-rpc.publicnode.com")] },
  { chainId: CHAIN_ID_8453, transports: [http("https://base-rpc.publicnode.com")] },
]);
const writer = create_writer([
  { chainId: CHAIN_ID_1, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
declare const provider: Provider; // see /eips/6963 for discovery
const { signer } = create_provider(provider);
const token = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const ctx = contract({ chain_id: CHAIN_ID_1, to: token });
```

Each factory accepts a `Chain[]` and returns a function `({ chain_id, ... }) => ResolvedX`. Pass the resolved object as the second curried argument to any method.

A `ChainEntry` may also declare an explicit `strategy` to control how multiple transports for one chain are coordinated (race vs primary+fallback). See [Per-chain transport strategy](/concepts/transport-strategy). Omit it and you get the default `{ type: "parallel" }`.

## HTTP transport

```ts
import { http } from "@ethernauta/transport";

const transport = http("https://eth.llamarpc.com", {
  retry: { attempts: 3 },
  batch: { window_ms: 50, max_size: 100 },
});
```

Used internally by `create_reader` / `create_writer` / `create_contract`. Exposed if you want to construct a transport directly without going through the resolver factories.

**Options:**

- `urls` — list of RPC endpoints. The transport rotates on failure.
- `retry: HttpRetryOptions` — `{ attempts: number, backoff: "linear" | "exponential" }`.
- `batch: HttpBatchOptions` — enable JSON-RPC batch requests within a time window.

## WebSocket transport

```ts
import { websocket } from "@ethernauta/transport";

const transport = websocket("wss://eth.llamarpc.com/ws");
```

For subscription-based methods (`eth_newHeads`, `eth_newPendingTransactions`). HTTP can't carry subscriptions; switch to WebSocket when you need long-lived push updates.

## Multicall

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

Aggregates multiple reads into a single JSON-RPC batch. Backed by the same HTTP transport; the batching is at the JSON-RPC layer (`[{ id: 1, ... }, { id: 2, ... }]`).

For on-chain `Multicall3`-style aggregation (where the contract aggregates calls), use the matching ERC binding in `@ethernauta/erc`.

## Contract binding

```ts
import {
  contract,
  create_reader,
  encode_chain_id,
  http,
} from "@ethernauta/transport";
import { balanceOf } from "@ethernauta/erc/20";
import { eth_call } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, type Bytes } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const token_address = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const holder = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const callable = balanceOf([holder])(contract({ chain_id: CHAIN_ID, to: token_address }));
const result_bytes: Bytes = await eth_call([{ to: callable.to, input: callable.data }])(
  reader({ chain_id: CHAIN_ID }),
);
const balance = callable.decode(result_bytes);
```

`contract({ chain_id, to })` builds a `ContractContext`. ERC method bindings consume it and return a `Callable<T>` — execute by passing the callable's `.data` through `eth_call` and decoding the response with `.decode`.

## EIP-1193 provider adapter

```ts
import { create_provider } from "@ethernauta/transport";
import { eth_blockNumber, eth_sendTransaction } from "@ethernauta/eth";
import type { Provider } from "@ethernauta/eip/1193";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

declare const injected: Provider;
const provider = create_provider(injected);

// reads through the provider
const block = await eth_blockNumber()(provider.reader({ chain_id: "eip155:1" }));

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x0");
const input = parse(BytesSchema, "0x");

// signing through the provider
const hash = await eth_sendTransaction([{ to, value, input }])(
  provider.signer({ chain_id: "eip155:1" }),
);
```

`create_provider(provider)` adapts any 1193-compliant source into Ethernauta's `{ reader, signer }` resolver pair. `create_injected_transport` is also exported for callers that want only the reader-side adapter.

## JSON-RPC schemas

The wire schemas for JSON-RPC requests and responses:

| Schema | Type |
|---|---|
| `MethodSchema` | the method name |
| `ParametersSchema` | the params array |
| `RequestSchema` | full `{ jsonrpc, id, method, params }` |
| `ResponseSchema` | full `{ jsonrpc, id, result } \| { ..., error }` |
| `IdSchema` | request ID |

Use these if you're building a custom transport (e.g. an in-memory mock for tests) and need to validate the wire shape.

## Types

| Type | Description |
|---|---|
| `Readable<T>` | `(_resolved: ResolvedReader) => Promise<T>` |
| `Writable<T>` | `(_resolved: ResolvedWriter) => Promise<T>` |
| `Callable<T>` | composable read against a contract |
| `Bridgeable<T>` | `(_resolved: ResolvedBridge) => Promise<T>` — pairs of (L1, L2) chain transports, consumed by per-rollup bridge verbs in `@ethernauta/op`, `@ethernauta/arbitrum`, `@ethernauta/zksync`. Produced by `create_bridge(CHAINS)({ l1_chain_id, l2_chain_id })`. |
| `Http`, `HttpOptions`, `HttpRetryOptions`, `HttpBatchOptions` | HTTP transport types |
| `Reader`, `Writer`, `Multicall` | factory return shapes |
| `Call`, `ContractContext` | for `Callable<T>` builders |
| `RequestArguments`, `Request`, `Response` | JSON-RPC wire types |
| `ProviderRpcError` | EIP-1193 error type |
| `Dispatcher`, `ReaderStrategy` | per-chain transport strategy — see [strategy page](/concepts/transport-strategy) |

## See also

- [Concepts → resolver shapes](/concepts/resolver-shapes) — the philosophy behind the four shapes.
- [Concepts → per-chain transport strategy](/concepts/transport-strategy) — race vs primary+fallback over multiple RPC endpoints.
- [@ethernauta/eth](/eth/overview) — methods that return these shapes.
- [@ethernauta/chain](/chain/overview) — `Chain[]` consumers.
- [EIP-1193](/eips/1193) — the provider envelope.
