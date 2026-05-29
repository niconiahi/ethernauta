---
title: "@ethernauta/eth"
section: Overview
section_order: 7
order: 6
---

# @ethernauta/eth

Every `eth_*` JSON-RPC method as a curried primitive. Plus a handful of `net_*` / `web3_*` clients. Plus the transaction-encoding helpers (post-Byzantium signing, RLP packing).

```bash
pnpm add @ethernauta/eth
```

Each method returns a resolver-shaped curried function. The first call binds the method's parameters; the second call binds the transport ([Concepts → resolver shapes](/concepts/resolver-shapes)).

## Method index

### Block (Readable)

- `eth_getBlockByHash` — block by hash, with optional full-tx hydration.
- `eth_getBlockByNumber` — block by number/tag (`"latest"`, `"earliest"`, `"pending"`, `"safe"`, `"finalized"`, or hex).
- `eth_getBlockReceipts` — all receipts in a block.
- `eth_getBlockTransactionCountByHash`
- `eth_getBlockTransactionCountByNumber`
- `eth_getUncleCountByBlockHash`
- `eth_getUncleCountByBlockNumber`

### State (Readable)

- `eth_getBalance` — native-token balance at a block.
- `eth_getCode` — deployed bytecode at an address.
- `eth_getStorageAt` — raw storage slot.
- `eth_getTransactionCount` — nonce.
- `eth_getProof` — Merkle proof.

### Transaction lookup (Readable)

- `eth_getTransactionByHash`
- `eth_getTransactionByBlockHashAndIndex`
- `eth_getTransactionByBlockNumberAndIndex`
- `eth_getTransactionReceipt`

### Chain / client (Readable)

- `eth_blockNumber`
- `eth_chainId`
- `eth_coinbase`
- `eth_gasPrice`
- `eth_maxPriorityFeePerGas`
- `eth_syncing`
- `eth_accounts`

### Execution (Readable)

- `eth_call` — execute against a snapshot.
- `eth_estimateGas` — gas estimation.
- `eth_createAccessList` — EIP-2930 access list builder.
- `eth_feeHistory` — historical base fees / priority fees.

### Submit

- `eth_sendTransaction` → `Signable<Hash32>` (path 1).
- `eth_sendRawTransaction` → `Writable<Hash32>` (path 2 broadcast).

### Sign (Signable)

- `eth_sign` — legacy raw signing. Gated behind explicit user opt-in.
- `eth_signTransaction` — signs and returns bytes (path 2).

### Filter / logs (Readable)

- `eth_newFilter`
- `eth_newBlockFilter`
- `eth_newPendingTransactionFilter`
- `eth_getFilterLogs`
- `eth_getFilterChanges`
- `eth_uninstallFilter`
- `eth_getLogs` — one-shot log query (no filter object).
- `eth_get_contract_events` — convenience wrapper that decodes via an ABI.
- `logs` — internal helper composed by the above.

### Subscribe (WebSocket)

- `eth_subscribeNewHeads` — push new block headers.
- `eth_subscribeNewPendingTransactions` — push pending tx hashes.

### Debug tracers (Readable)

Geth-namespace tracer methods. Sibling to `eth_*` because they ride the same transport — not a numbered standard, so they don't live under `@ethernauta/eip`. Supported by reth, erigon, anvil, and Alchemy / Tenderly gateways.

- `debug_traceCall` — replay an `eth_call` at a historical block, return the configured tracer's payload.
- `debug_traceTransaction` — replay a mined tx by hash with the configured tracer.
- `debug_traceBlockByNumber` — trace every tx in a block; returns a tagged `BlockTraceEntry[]`.

```ts
import { parse } from "valibot";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import {
  debug_traceCall,
  TRACER_TYPE,
  type TraceResult,
} from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://… (must expose debug_*)")] },
]);

const result: TraceResult = await debug_traceCall({
  transaction: {
    from: parse(AddressSchema, "0x0000000000000000000000000000000000000000"),
    to: parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"),
    input: parse(BytesSchema, "0x70a08231000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa96045"),
  },
  blockNumberOrTagOrHash: "latest",
  tracerConfig: { tracer: TRACER_TYPE.CALL },
})(reader({ chain_id: CHAIN_ID }));

// `result` is a discriminated TraceResult; switch on `result.tracer`.
void result;
```

The bindings parse the wire payload against the schema matching the request's tracer and tag the result with the tracer name, so consumers `switch` on a discriminated `TraceResult` instead of inspecting opaque JSON.

| Tracer | Discriminator | Result shape | When to use |
|---|---|---|---|
| `callTracer` | `TRACER_TYPE.CALL` | Recursive `CallFrame` tree | Control flow, finding failing inner calls, surfacing revert reasons. |
| `prestateTracer` | `TRACER_TYPE.PRESTATE` | `PreStateMap` or pre/post `PreStateDiff` (with `diffMode`) | Pre-flight checks, ERC-5189 / ERC-7562 bundler validation. |
| `4byteTracer` | `TRACER_TYPE.FOURBYTE` | `FourByteTrace` — `record(selector, count)` | Cheap intent inference, surfacing unknown selectors. |
| Default (struct) | `STRUCT_TYPE.literal` | `StructLogResult` — per-opcode log | Step-by-step EVM debugging. Largest payload. |

Recursive shapes (`CallFrameSchema`) follow Valibot's canonical pattern — `lazy()` on the self-reference only, anchor type tagged with `R4-recursive-schema`. See [Concepts → folder-shaped standards](/concepts/folder-shaped-standards) for the placement reasoning.

## Quick examples

### Read

```ts
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import {
  eth_blockNumber,
  eth_getBalance,
  eth_getCode,
} from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);
const ctx = reader({ chain_id: CHAIN_ID });

const address = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");

const block = await eth_blockNumber()(ctx);
const balance = await eth_getBalance([address, "latest"])(ctx);
const code = await eth_getCode([address, "latest"])(ctx);
```

### Call

```ts
import { eth_call } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const contract_address = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const calldata = parse(BytesSchema, "0x");

const result_bytes = await eth_call([{ to: contract_address, input: calldata }])(
  reader({ chain_id: CHAIN_ID }),
);
```

For typed contract calls, use `@ethernauta/erc/<n>/methods/*` — the ERC bindings wrap `eth_call` with a decoder.

### Call with state overrides

`eth_call` accepts an optional second function argument: a per-address override applied for the duration of the call. The chain itself is untouched. Pin a balance, swap in a code stub, replace a single storage slot — same shape as geth's `eth_call` third RPC parameter.

```ts
import { eth_call } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const contract_address = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const calldata = parse(BytesSchema, "0x18160ddd"); // totalSupply()

// 10-byte stub: returns 0x000…02a (decimal 42) for any selector.
const stub = parse(BytesSchema, "0x602a60005260206000f3");

const overridden = await eth_call(
  [{ to: contract_address, input: calldata }],
  { [contract_address]: { code: stub } },
)(reader({ chain_id: CHAIN_ID }));
void overridden;
```

The override schema rejects per-entry `state` and `stateDiff` together (the geth spec says they are mutually exclusive). Omitting the second argument keeps the JSON-RPC params array two-element for backwards compatibility.

### Submit (path 2)

```ts
import type { Provider } from "@ethernauta/eip/1193";
import {
  create_provider,
  create_writer,
  encode_chain_id,
  http,
} from "@ethernauta/transport";
import { eth_signTransaction, eth_sendRawTransaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import { AddressSchema, BytesSchema, UintSchema } from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
declare const provider: Provider; // see /eips/6963 for discovery
const { signer } = create_provider(provider);
const writer = create_writer([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const to = parse(AddressSchema, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8");
const value = parse(UintSchema, "0x0");

const signed = await eth_signTransaction([{ to, value, input: parse(BytesSchema, "0x") }])(
  signer({ chain_id: CHAIN_ID }),
);

const hash = await eth_sendRawTransaction([signed])(
  writer({ chain_id: CHAIN_ID }),
);
```

### Logs

```ts
import { eth_getLogs } from "@ethernauta/eth";
import { create_reader, encode_chain_id, http } from "@ethernauta/transport";
import { eip155_1 } from "@ethernauta/chain/eip155-1";
import {
  AddressSchema,
  Bytes32Schema,
  UintSchema,
} from "@ethernauta/core";
import { parse } from "valibot";

const CHAIN_ID = encode_chain_id({ namespace: "eip155", reference: eip155_1.chainId });
const reader = create_reader([
  { chainId: CHAIN_ID, transports: [http("https://ethereum-rpc.publicnode.com")] },
]);

const token = parse(AddressSchema, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");
const transfer_event_topic = parse(
  Bytes32Schema,
  "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
);

const logs = await eth_getLogs({
  filter: {
    address: token,
    topics: [transfer_event_topic],
    fromBlock: parse(UintSchema, "0x0"),
    toBlock: parse(UintSchema, "0x1000000"),
  },
})(reader({ chain_id: CHAIN_ID }));
```

## Core types

Block-related: `BlockTag`, `BlockNumberOrTag`.

Other types and Valibot schemas for receipts, filters, withdrawals, and call payloads live under `@ethernauta/eth`'s `core/` subpath.

## Lib

| Helper | Purpose |
|---|---|
| `post_byzantium` | Sign hashing helpers for EIP-155 / 1559 / 2930 / 4844 transactions. |
| `rlp` | RLP encoding specialized for transaction tuples. |

These are the building blocks the wallet's `eth_sendTransaction` handler composes; the same primitives are reachable here for off-wallet signing flows.

## See also

- [Concepts → resolver shapes](/concepts/resolver-shapes) — what `Readable`, `Writable`, `Signable` mean.
- [Concepts → two paths](/concepts/two-paths) — when to use `eth_sendTransaction` vs `eth_signTransaction`.
- [@ethernauta/transaction](/transaction/overview) — lifecycle on top of these methods.
- [@ethernauta/transport](/transport/overview) — `create_reader`, `create_writer`, `create_provider(provider).signer`.
