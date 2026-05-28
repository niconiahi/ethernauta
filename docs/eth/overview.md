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

## Quick examples

### Read

```ts
import { create_reader } from "@ethernauta/transport";
import {
  eth_blockNumber,
  eth_getBalance,
  eth_getCode,
} from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain/eip155-1";

const reader = create_reader([eip155_1]);
const ctx = reader({ chain_id: eip155_1.chain_id });

const block = await eth_blockNumber()(ctx);
const balance = await eth_getBalance({ address, block: "latest" })(ctx);
const code = await eth_getCode({ address, block: "latest" })(ctx);
```

### Call

```ts
import { eth_call } from "@ethernauta/eth";

const result_bytes = await eth_call({
  to: contract_address,
  input: calldata,
  block: "latest",
})(reader({ chain_id: eip155_1.chain_id }));
```

For typed contract calls, use `@ethernauta/erc/<n>/methods/*` — the ERC bindings wrap `eth_call` with a decoder.

### Submit (path 2)

```ts
import { create_signer, create_writer } from "@ethernauta/transport";
import { eth_signTransaction, eth_sendRawTransaction } from "@ethernauta/eth";

const signer = create_signer([eip155_1]);
const writer = create_writer([eip155_1]);

const signed = await eth_signTransaction({ to, value, input: "0x" })(
  signer({ chain_id: eip155_1.chain_id }),
);

const hash = await eth_sendRawTransaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

### Logs

```ts
import { eth_getLogs } from "@ethernauta/eth";

const logs = await eth_getLogs({
  address: token,
  topics: [transfer_event_topic],
  from_block: "0x0",
  to_block: "latest",
})(reader({ chain_id: eip155_1.chain_id }));
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
- [@ethernauta/transport](/transport/overview) — `create_reader`, `create_writer`, `create_signer`.
