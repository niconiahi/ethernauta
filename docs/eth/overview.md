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

- `eth_get_block_by_hash` — block by hash, with optional full-tx hydration.
- `eth_get_block_by_number` — block by number/tag (`"latest"`, `"earliest"`, `"pending"`, `"safe"`, `"finalized"`, or hex).
- `eth_get_block_receipts` — all receipts in a block.
- `eth_get_block_transaction_count_by_hash`
- `eth_get_block_transaction_count_by_number`
- `eth_get_uncle_count_by_block_hash`
- `eth_get_uncle_count_by_block_number`

### State (Readable)

- `eth_get_balance` — native-token balance at a block.
- `eth_get_code` — deployed bytecode at an address.
- `eth_get_storage_at` — raw storage slot.
- `eth_get_transaction_count` — nonce.
- `eth_get_proof` — Merkle proof.

### Transaction lookup (Readable)

- `eth_get_transaction_by_hash`
- `eth_get_transaction_by_block_hash_and_index`
- `eth_get_transaction_by_block_number_and_index`
- `eth_get_transaction_receipt`

### Chain / client (Readable)

- `eth_block_number`
- `eth_chain_id`
- `eth_coinbase`
- `eth_gas_price`
- `eth_max_priority_fee_per_gas`
- `eth_syncing`
- `eth_accounts`

### Execution (Readable)

- `eth_call` — execute against a snapshot.
- `eth_estimate_gas` — gas estimation.
- `eth_create_access_list` — EIP-2930 access list builder.
- `eth_fee_history` — historical base fees / priority fees.

### Submit

- `eth_send_transaction` → `Signable<Hash32>` (path 1).
- `eth_send_raw_transaction` → `Writable<Hash32>` (path 2 broadcast).

### Sign (Signable)

- `eth_sign` — legacy raw signing. Gated behind explicit user opt-in.
- `eth_sign_transaction` — signs and returns bytes (path 2).

### Filter / logs (Readable)

- `eth_new_filter`
- `eth_new_block_filter`
- `eth_new_pending_transaction_filter`
- `eth_get_filter_logs`
- `eth_get_filter_changes`
- `eth_uninstall_filter`
- `eth_get_logs` — one-shot log query (no filter object).
- `eth_get_contract_events` — convenience wrapper that decodes via an ABI.
- `logs` — internal helper composed by the above.

### Subscribe (WebSocket)

- `eth_subscribe_new_heads` — push new block headers.
- `eth_subscribe_new_pending_transactions` — push pending tx hashes.

## Quick examples

### Read

```ts
import { create_reader } from "@ethernauta/transport";
import {
  eth_block_number,
  eth_get_balance,
  eth_get_code,
} from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain";

const reader = create_reader([eip155_1]);
const ctx = reader({ chain_id: eip155_1.chain_id });

const block = await eth_block_number()(ctx);
const balance = await eth_get_balance({ address, block: "latest" })(ctx);
const code = await eth_get_code({ address, block: "latest" })(ctx);
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
import { eth_sign_transaction, eth_send_raw_transaction } from "@ethernauta/eth";

const signer = create_signer([eip155_1]);
const writer = create_writer([eip155_1]);

const signed = await eth_sign_transaction({ to, value, input: "0x" })(
  signer({ chain_id: eip155_1.chain_id }),
);

const hash = await eth_send_raw_transaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

### Logs

```ts
import { eth_get_logs } from "@ethernauta/eth";

const logs = await eth_get_logs({
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
