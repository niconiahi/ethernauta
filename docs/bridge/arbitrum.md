---
title: Arbitrum — worked example
section: Bridge
section_order: 11
order: 3
---

# Arbitrum — deposit, retryable lifecycle, withdraw round trip

End-to-end: bridge ETH and ERC-20s from Sepolia to Arbitrum Sepolia, drive the retryable-ticket lifecycle, then withdraw back through Arbitrum's outbox.

```bash
pnpm add @ethernauta/arbitrum @ethernauta/transport @ethernauta/core @ethernauta/utils
```

Every verb in this page is exported from `@ethernauta/arbitrum`. See [`/bridge/overview`](/bridge/overview) for the `Bridgeable<T>` shape and verb-naming philosophy.

## Wire up the resolver

```ts
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_421614 } from "@ethernauta/chain/eip155-421614"
import { encode_chain_id, http } from "@ethernauta/transport"
import { create_bridge } from "@ethernauta/arbitrum"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const ARB_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_421614.chainId,
})

const bridge = create_bridge([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
  {
    chainId: ARB_SEPOLIA_CHAIN_ID,
    transports: [http("https://sepolia-rollup.arbitrum.io/rpc")],
  },
])
```

## 1 — Deposit ETH (L1 → L2)

`send_eth` calls `Inbox.depositEth()` as a payable transaction on Sepolia. The Nitro sequencer picks up the L1 deposit log and credits ETH on Arbitrum Sepolia. No `to` param — Arbitrum's `depositEth` credits the L2 address that mirrors the L1 sender via aliasing.

```ts
import { UintSchema } from "@ethernauta/core"
import { send_eth } from "@ethernauta/arbitrum"
import { parse } from "valibot"

const amount = parse(UintSchema, "0x38d7ea4c68000") // 0.001 ETH

const l1_tx_hash = await send_eth({ amount })(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

## 2 — Deposit an ERC-20

`send_erc20` calls `L1GatewayRouter.outboundTransfer`, which dispatches to the right gateway (standard ERC-20, custom, WETH) per the router's `getGateway(l1Token)` mapping. The verb resolves the gateway same-side via the `L1GatewayRouter.getGateway` read before signing.

```ts
import { AddressSchema, Uint256Schema, UintSchema } from "@ethernauta/core"
import { send_erc20 } from "@ethernauta/arbitrum"

const l1_tx_hash = await send_erc20({
  l1_token: parse(AddressSchema, "0xL1TokenAddress"),
  to: parse(AddressSchema, "0xL2Recipient"),
  amount: parse(Uint256Schema, "0xDE0B6B3A7640000"),  // 1 token
  max_gas: parse(Uint256Schema, "0x186A0"),           // 100_000
  gas_price_bid: parse(Uint256Schema, "0x3B9ACA00"),  // 1 gwei
  max_submission_cost: parse(Uint256Schema, "0x16345785D8A0000"), // 0.1 ETH
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

Approve the gateway against the L1 token first using a standard ERC-20 `approve` call — Ethernauta doesn't bake the approval into the verb, since one-shot vs infinite approval is a dapp policy decision.

## 3 — Create a retryable ticket (arbitrary L1 → L2 message)

`send_message` calls `Inbox.createRetryableTicket`. Auto-redeem fires when the user funds `gas_limit × max_fee_per_gas + l2_call_value + max_submission_cost` on the L1 transaction. If auto-redeem succeeds, the L2 call executes immediately and the ticket is consumed.

```ts
import { BytesSchema } from "@ethernauta/core"
import { send_message } from "@ethernauta/arbitrum"

const l1_tx_hash = await send_message({
  to: parse(AddressSchema, "0xL2Target"),
  l2_call_value: parse(Uint256Schema, "0x0"),
  max_submission_cost: parse(Uint256Schema, "0x16345785D8A0000"),
  excess_fee_refund_address: signer_address,
  call_value_refund_address: signer_address,
  gas_limit: parse(Uint256Schema, "0x186A0"),
  max_fee_per_gas: parse(Uint256Schema, "0x59682F00"),
  data: parse(BytesSchema, "0x"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

`send_eth` and `send_erc20` are special-case wrappers around the same retryable-ticket machinery; `send_message` is the raw form when the dapp needs full control.

## 4 — Drive the retryable lifecycle

If the auto-redeem failed (L2 gas under-bid, contract reverted), the ticket sits in the L2 retryable buffer for ~7 days. The dapp can:

```ts
import { Bytes32Schema } from "@ethernauta/core"
import { cancel_retryable, redeem_retryable } from "@ethernauta/arbitrum"

// Manually retry with fresh L2 gas:
const redeem_l2_tx_hash = await redeem_retryable({
  ticket_id: parse(Bytes32Schema, "0x..."),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: ARB_SEPOLIA_CHAIN_ID }),
  }),
)

// Or abandon and refund the L1-locked value via standard withdraw:
const cancel_l2_tx_hash = await cancel_retryable({
  ticket_id: parse(Bytes32Schema, "0x..."),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: ARB_SEPOLIA_CHAIN_ID }),
  }),
)
```

Both sign on L2 — they call the `ArbRetryableTx` precompile at `0x6e`. The `ticket_id` is the retryable ID emitted by `createRetryableTicket` on L1; the dapp extracts it from the `Inbox`'s `InboxMessageDelivered` log.

`cancel_retryable` refunds the L1 value via the standard L2 → L1 withdrawal path, so the funds reappear on L1 after the ~7-day Arbitrum confirmation window — same flow as a fresh `start_withdraw_eth`.

## 5 — Start a withdrawal (L2 → L1)

`start_withdraw_eth` calls `ArbSys.withdrawEth` on Arbitrum Sepolia. The L2 burn emits an `L2ToL1Tx` event on the `ArbSys` precompile; the proof bundle is built later via `fetch_message_proof`.

```ts
import { start_withdraw_eth } from "@ethernauta/arbitrum"

const l2_tx_hash = await start_withdraw_eth({
  to: parse(AddressSchema, "0xL1Recipient"),
  amount: parse(UintSchema, "0x38d7ea4c68000"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: ARB_SEPOLIA_CHAIN_ID }),
  }),
)
```

Persist `l2_tx_hash` plus the parsed `L2ToL1Tx` event payload — the latter is the `WithdrawalTransaction` that `get_status`, `fetch_message_proof`, and `execute_withdraw` consume. Use `decode_logs` against the L2 receipt to extract the event; the schema is `WithdrawalTransactionSchema` from `@ethernauta/arbitrum`.

## 6 — Poll withdraw status

`get_status` walks Arbitrum's four-state withdraw union by reading the `Outbox.isSpent` mapping and the merkle root posted by Nitro.

```ts
import { get_status } from "@ethernauta/arbitrum"

const status = await get_status({
  direction: "withdraw",
  message: withdrawal_transaction, // the parsed L2ToL1Tx event
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: ARB_SEPOLIA_CHAIN_ID }))

switch (status.state) {
  case "initiated_l2":  // burn included, no Nitro assertion yet
  case "confirming":    // assertion posted, in 6.4-day challenge window
  case "executable":    // → call execute_withdraw
  case "executed":      // L1 outbox claim landed
}
```

`confirming` and `executable` carry the `send_root` so the dapp can show the matched assertion.

## 7 — Build the proof + finalize on L1

When `get_status` reports `executable`, `fetch_message_proof` queries `NodeInterface.constructOutboxProof` and `execute_withdraw` calls `Outbox.executeTransaction` atomically.

```ts
import { execute_withdraw, fetch_message_proof } from "@ethernauta/arbitrum"

const transport_for_proof = bridge({
  l1: SEPOLIA_CHAIN_ID,
  l2: ARB_SEPOLIA_CHAIN_ID,
})

const proof = await fetch_message_proof({
  message: withdrawal_transaction,
})(transport_for_proof)

const execute_l1_tx_hash = await execute_withdraw({ proof })(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ARB_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

Arbitrum and zkSync both validate-and-release in one shot — there's no separate `prove_withdraw` step. The `Outbox` contract verifies the merkle proof against the posted `sendRoot` and releases funds in the same transaction.

## Errors

Arbitrum-side bridge reverts decode to a typed `ArbitrumBridgeFailure` thrown from underneath `eth_sendRawTransaction`:

- **`ProofUnavailable`** — the L2 batch backing the withdrawal hasn't been confirmed by a Nitro assertion yet. Retry later.
- **`RetryableExpired`** — `redeem_retryable` called past the 7-day redemption window. The ticket is gone; the L1 value is unrecoverable.
- **`AlreadyExecuted`** — `execute_withdraw` called twice on the same message. `Outbox.isSpent` already returns true.

```ts
import { ArbitrumBridgeFailure } from "@ethernauta/arbitrum"

try {
  await execute_withdraw({ proof })(transport)
} catch (e) {
  if (e instanceof ArbitrumBridgeFailure) {
    switch (e.data.kind) {
      case "ProofUnavailable": /* retry */ break
      case "RetryableExpired": /* unrecoverable */ break
      case "AlreadyExecuted":  /* idempotent — treat as success */ break
    }
  }
}
```

## What ships from `@ethernauta/arbitrum`

| Verb | Shape |
|---|---|
| `send_eth` | `Bridgeable<Hash32>` |
| `send_erc20` | `Bridgeable<Hash32>` |
| `send_message` | `Bridgeable<Hash32>` |
| `redeem_retryable` | `Bridgeable<Hash32>` |
| `cancel_retryable` | `Bridgeable<Hash32>` |
| `start_withdraw_eth` | `Bridgeable<Hash32>` |
| `start_withdraw_erc20` | `Bridgeable<Hash32>` |
| `start_withdraw_message` | `Bridgeable<Hash32>` |
| `fetch_message_proof` | `Bridgeable<MessageProof>` |
| `execute_withdraw` | `Bridgeable<Hash32>` |
| `get_status` | `Bridgeable<ArbitrumBridgeStatus>` |

Plus `create_bridge`, `ArbitrumBridgeFailure`, `ArbitrumBridgeErrorSchema`, `with_arbitrum_errors`, `ArbitrumBridgeStatusSchema`, `MessageProofSchema`, `WithdrawalTransactionSchema`. Thin per-contract bindings (`createRetryableTicket`, `outboundTransfer`, `executeTransaction`, …) sit under subpath imports like `@ethernauta/arbitrum/bridge/inbox`.

## See also

- [`/bridge/overview`](/bridge/overview) — `Bridgeable<T>` shape + verb-naming philosophy.
- [`/bridge/op`](/bridge/op) — OP Stack worked example.
- [`/bridge/zksync`](/bridge/zksync) — zkSync Era worked example.
- [`/arbitrum/overview`](/arbitrum/overview) — Arbitrum package surface beyond the bridge.
- [`packages/arbitrum/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/arbitrum/COMPARISON.md) — feature-by-feature comparison vs `@arbitrum/sdk` + `viem`.
- [Arbitrum bridging docs](https://docs.arbitrum.io/build-decentralized-apps/token-bridging/overview) — protocol authority for the L1 ↔ L2 messaging model.
- [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) — author-notes on the retryable-ticket protocol.
