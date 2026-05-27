---
title: Signing transactions
section: Guides
section_order: 3
order: 2
---

# Signing transactions

There are **two first-class signing paths**, and the library does not force a choice between them — the dapp picks per call. See [Concepts → two paths](/concepts/two-paths) for the philosophy.

## Path 1 — wallet signs and broadcasts

The wallet implements `eth_sendTransaction`. One round trip, the wallet handles nonce / gas, the dapp gets back a transaction hash.

```ts
import { create_signer } from "@ethernauta/transport";
import { eth_send_transaction } from "@ethernauta/eth";
import { eip155_1 } from "@ethernauta/chain";

const signer = create_signer([eip155_1]);

const hash = await eth_send_transaction({
  to: "0xd8dA6BF26964aF9D7eED9e03E53415D37aA96045",
  value: "0x16345785D8A0000",
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));
```

What the wallet does in the background:

1. Fills in `nonce` (from `eth_getTransactionCount`).
2. Fills in `gas` (from `eth_estimateGas`).
3. Fills in EIP-1559 fee fields (from `eth_maxPriorityFeePerGas`, `eth_feeHistory`).
4. Opens the `send` view, shows the user the decoded tx, awaits confirmation.
5. Signs.
6. Broadcasts via `eth_sendRawTransaction`.
7. Returns the hash.

**The dapp never sets `nonce`, `gas`, `maxFeePerGas`, or `maxPriorityFeePerGas`.** That's hard rule 5 in CLAUDE.md.

## Path 2 — wallet signs, dapp broadcasts

The wallet implements `eth_signTransaction` and returns the signed bytes; the dapp broadcasts them via a `Writable<T>` against any public RPC.

```ts
import { create_signer, create_writer } from "@ethernauta/transport";
import { eth_sign_transaction, eth_send_raw_transaction } from "@ethernauta/eth";

const signer = create_signer([eip155_1]);
const writer = create_writer([eip155_1]);

const signed = await eth_sign_transaction({
  to: recipient,
  value,
  input: "0x",
})(signer({ chain_id: eip155_1.chain_id }));

// inspect, log, persist `signed` here if you want

const hash = await eth_send_raw_transaction(signed)(
  writer({ chain_id: eip155_1.chain_id }),
);
```

What you can do that path 1 can't:

- Inspect the exact signed bytes before broadcast.
- Broadcast through your own RPC endpoint (private mempool, MEV-protection service).
- Persist the bytes, retry later, re-broadcast after a reorg.

## Same wallet, different choice per call

```ts
// path 1 for low-risk
const quick_hash = await eth_send_transaction(...)(signer(...));

// path 2 for the bridge call
const signed_bytes = await eth_sign_transaction(...)(signer(...));
await log_to_audit(signed_bytes);
const broadcast_hash = await eth_send_raw_transaction(signed_bytes)(writer(...));
```

The two paths share the same signer; the only difference is which `eth_*` method gets called.

## Other signables, same split

| Path 1 (wallet does it all) | Path 2 (primitive composition) |
|---|---|
| `eth_sendTransaction` | `eth_signTransaction` + `eth_sendRawTransaction` |
| `wallet_sendCalls` | `wallet_sendCalls` (path-2 variant TBD) |
| `personal_sign` | `personal_sign` + dapp persists |
| `eth_signTypedData_v4` | `eth_signTypedData_v4` + dapp submits to off-chain venue |
| `wallet_sendSetCodeTransaction` (EIP-7702) | `wallet_signAuthorization` + `eth_sendRawTransaction` |

## See also

- [Concepts → two paths](/concepts/two-paths) — when each is the right pick.
- [@ethernauta/eth → submit + sign](/eth/overview).
- [Guide → tracking a transaction lifecycle](/guides/tracking-lifecycle) — after the broadcast.
