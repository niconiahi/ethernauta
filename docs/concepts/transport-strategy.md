---
title: Per-chain transport strategy
section: Concepts
section_order: 2
order: 8
---

# Per-chain transport strategy

A `ChainEntry` can list multiple RPC endpoints. **Strategy** declares how the four resolver factories (`create_reader`, `create_writer`, `create_contract`, `create_tracker`) coordinate those endpoints when a method fires.

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });

const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://eth.llamarpc.com"),
      http("https://ethereum-rpc.publicnode.com"),
      http("https://rpc.ankr.com/eth"),
    ],
    strategy: { type: "parallel" }, // default — race, fastest wins
  },
]);
```

`strategy` is optional. Omit it and you get `{ type: "parallel" }` — the existing race-everything behavior, unchanged from before strategy existed.

## The two cells

| Type | Behavior |
|---|---|
| `parallel` | Fire every transport simultaneously. First successful response wins. If every transport rejects, throw `AggregateError`. |
| `sequential` | Walk transports in declaration order. On the first success, return. On rejection, try the next. If every transport rejects, throw `AggregateError`. |

Both raise the same failure shape, so callers' `catch` blocks don't change between them.

## When to choose which

**Parallel** (default) — every endpoint is equally trusted, latency matters more than RPC cost, you're racing two or three good public endpoints. Tail-latency is bounded by the *fastest* node.

```ts
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://eth.llamarpc.com"),
      http("https://ethereum-rpc.publicnode.com"),
    ],
    strategy: { type: "parallel" },
  },
]);
```

**Sequential** — primary + fallback. The first transport is the preferred endpoint (your paid provider, your in-house node), the rest are fallbacks. The fallback is only contacted when the primary fails. Avoids paying for, or rate-limiting against, every node on every request.

```ts
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http("https://my-paid-provider.example/eth"),
      http("https://eth.llamarpc.com"),
      http("https://ethereum-rpc.publicnode.com"),
    ],
    strategy: { type: "sequential" },
  },
]);
```

## Strategy is per-chain, not per-call

The decision is declared once on the `ChainEntry` and honored by every method that resolves through it — `eth_getBalance`, `eth_call`, `eth_sendRawTransaction`, multicall, tracker polling, ENS resolution, every primitive. Two chains can pick different strategies in the same factory call:

```ts
const reader = create_reader([
  {
    chainId: encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId }),
    transports: [http(PRIMARY_MAINNET), http(FALLBACK_MAINNET)],
    strategy: { type: "sequential" },
  },
  {
    chainId: encode_chain_id({ namespace: "eip155", reference: eip155_8453.chainId }),
    transports: [http(BASE_A), http(BASE_B)],
    strategy: { type: "parallel" },
  },
]);
```

## How it composes with per-endpoint retry

`http(url, { retry })` retries against the *same* endpoint with exponential backoff. Strategy is the *cross*-endpoint policy. They compose cleanly:

```ts
const reader = create_reader([
  {
    chainId: CHAIN_ID,
    transports: [
      http(PRIMARY, { retry: { attempts: 3 } }),
      http(FALLBACK_A),
      http(FALLBACK_B),
    ],
    strategy: { type: "sequential" },
  },
]);
```

Reads here go: primary (up to 3 attempts) → fallback A (1 attempt) → fallback B (1 attempt).

## Future: quorum

Cross-endpoint **agreement** (return only when N transports return the same result) is intentionally not part of strategy today. The shape will arrive as a coordinated change: schema field + canonicalizer + failure-mode policy. Until then `parallel` and `sequential` are the available cells.

## Types

| Type | Description |
|---|---|
| `ReaderStrategy` | `{ type: "parallel" \| "sequential" }` — the policy declaration |
| `Dispatcher` | `(_call: Call) => Promise<Response>` — what the factories produce internally from `transports` + `strategy` |
| `DEFAULT_STRATEGY` | `{ type: "parallel" }` — used when `ChainEntry.strategy` is omitted |
| `create_dispatcher` | `(transports: Http[], strategy: ReaderStrategy) => Dispatcher` — exposed for testing helpers and the 1193 provider adapter |
