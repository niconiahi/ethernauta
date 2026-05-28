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
import {
  create_reader,
  create_writer,
  create_signer,
  create_contract,
} from "@ethernauta/transport";

const reader = create_reader([eip155_1, eip155_8453]);
const writer = create_writer([eip155_1]);
const signer = create_signer([eip155_1]);
const contract = create_contract([eip155_1]);
```

Each factory accepts a `Chain[]` and returns a function `({ chain_id, ... }) => ResolvedX`. Pass the resolved object as the second curried argument to any method.

## HTTP transport

```ts
import { http } from "@ethernauta/transport";

const transport = http({
  urls: ["https://eth.llamarpc.com", "https://cloudflare-eth.com"],
  retry: { attempts: 3, backoff: "exponential" },
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

const transport = websocket({
  url: "wss://eth.llamarpc.com/ws",
});
```

For subscription-based methods (`eth_newHeads`, `eth_newPendingTransactions`). HTTP can't carry subscriptions; switch to WebSocket when you need long-lived push updates.

## Multicall

```ts
import { create_multicall } from "@ethernauta/transport";
import { eth_getBalance, eth_blockNumber } from "@ethernauta/eth";

const multicall = create_multicall([eip155_1]);

const [block, balance] = await multicall({ chain_id: eip155_1.chain_id }).all([
  eth_blockNumber(),
  eth_getBalance({ address, block: "latest" }),
]);
```

Aggregates multiple reads into a single JSON-RPC batch. Backed by the same HTTP transport; the batching is at the JSON-RPC layer (`[{ id: 1, ... }, { id: 2, ... }]`).

For on-chain `Multicall3`-style aggregation (where the contract aggregates calls), use the matching ERC binding in `@ethernauta/erc`.

## Contract binding

```ts
import { create_contract, contract } from "@ethernauta/transport";
import { balanceOf } from "@ethernauta/erc/20";

const c = create_contract([eip155_1]);

const balance = await balanceOf({ owner: holder })(
  c({ chain_id: eip155_1.chain_id, contract: token_address }),
);
```

`create_contract` produces a `Callable`-shaped resolver. The `contract` address is bound at resolver-construction time; ERC method bindings consume it implicitly via `eth_call`.

`contract` (lowercase) is the lower-level primitive that binds a callable to an address; `create_contract` is the factory.

## EIP-1193 provider adapter

```ts
import { create_provider, create_injected_transport, create_injected_signer } from "@ethernauta/transport";

const provider = create_provider(window.ethereum);

// reads through the provider
const block = await eth_blockNumber()(provider.reader({ chain_id: "eip155:1" }));

// signing through the provider
const hash = await eth_sendTransaction({ to, value })(
  provider.signer({ chain_id: "eip155:1" }),
);
```

`create_provider(provider)` adapts any 1193-compliant source into Ethernauta's resolver shapes. `create_injected_transport` and `create_injected_signer` are the lower-level building blocks.

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
| `Http`, `HttpOptions`, `HttpRetryOptions`, `HttpBatchOptions` | HTTP transport types |
| `Reader`, `Writer`, `Multicall` | factory return shapes |
| `Call`, `ContractContext` | for `Callable<T>` builders |
| `RequestArguments`, `Request`, `Response` | JSON-RPC wire types |
| `ProviderRpcError` | EIP-1193 error type |

## See also

- [Concepts → resolver shapes](/concepts/resolver-shapes) — the philosophy behind the four shapes.
- [@ethernauta/eth](/eth/overview) — methods that return these shapes.
- [@ethernauta/chain](/chain/overview) — `Chain[]` consumers.
- [EIP-1193](/eips/1193) — the provider envelope.
