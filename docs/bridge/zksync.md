---
title: zkSync Era — worked example
section: Bridge
section_order: 11
order: 4
---

# zkSync Era — deposit, withdraw round trip, failed-deposit recovery

End-to-end: bridge ETH and ERC-20s from Sepolia to Era Sepolia, withdraw back through the L2-asset-router → L1-nullifier flow, and recover L1 funds from a deposit whose L2 execution reverted.

```bash
pnpm add @ethernauta/zksync @ethernauta/transport @ethernauta/core @ethernauta/utils
```

Every verb in this page is exported from `@ethernauta/zksync`. See [`/bridge/overview`](/bridge/overview) for the `Bridgeable<T>` shape and verb-naming philosophy.

## Wire up the resolver

```ts
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_300 } from "@ethernauta/chain/eip155-300"
import { encode_chain_id, http } from "@ethernauta/transport"
import { create_bridge } from "@ethernauta/zksync"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const ERA_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_300.chainId,
})

const bridge = create_bridge([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [http("https://ethereum-sepolia-rpc.publicnode.com")],
  },
  {
    chainId: ERA_SEPOLIA_CHAIN_ID,
    transports: [http("https://sepolia.era.zksync.dev")],
  },
])
```

The L2 transport must point at a zkSync sequencer RPC — `fetch_message_proof` calls `zks_getL2ToL1LogProof`, which is a sequencer-only namespace.

## 1 — Deposit ETH (L1 → L2)

`send_eth` calls `Bridgehub.requestL2TransactionDirect` on Sepolia. The verb reads the L2 base cost from the `Bridgehub` first (the L2 gas portion of the L1 transaction value), so the L1 transaction always covers the correct amount.

```ts
import { AddressSchema, Uint256Schema } from "@ethernauta/core"
import { send_eth } from "@ethernauta/zksync"
import { parse } from "valibot"

const recipient = parse(AddressSchema, "0xL2Recipient")
const amount = parse(Uint256Schema, "0x38d7ea4c68000") // 0.001 ETH

const l1_tx_hash = await send_eth({ to: recipient, amount })(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

`l2_gas_limit` is optional — the default works for plain ETH transfers. Override when the L2 recipient is a contract whose receive function needs more gas.

## 2 — Deposit an ERC-20

`send_erc20` calls `L1AssetRouter.deposit` (which `Bridgehub` routes to under the hood). The verb derives the canonical `assetId` from the `(chainId, L1 token)` pair inline — no per-token registry lookup.

```ts
import { send_erc20 } from "@ethernauta/zksync"

const l1_tx_hash = await send_erc20({
  l1_token: parse(AddressSchema, "0xL1TokenAddress"),
  to: recipient,
  amount: parse(Uint256Schema, "0xDE0B6B3A7640000"), // 1 token
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

Approve the L1 asset router against the L1 token first using a standard ERC-20 `approve` call.

## 3 — Arbitrary L1 → L2 message

`send_message` is the raw form behind `send_eth` and `send_erc20`. Use it when the L2 target is a contract whose calldata isn't a simple credit.

```ts
import { BytesSchema } from "@ethernauta/core"
import { send_message } from "@ethernauta/zksync"

const l1_tx_hash = await send_message({
  to: parse(AddressSchema, "0xL2Target"),
  l2_value: parse(Uint256Schema, "0x0"),
  l2_calldata: parse(BytesSchema, "0xL2CalldataHex"),
  refund_recipient: parse(AddressSchema, "0xRefundAddress"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

## 4 — Track deposit status

`get_status` with `direction: "deposit"` exposes whether the L2 side credited successfully. zkSync's deposit lifecycle floors at `in_progress_l2` until the sequencer includes the L2 system transaction:

```ts
import { get_status } from "@ethernauta/zksync"

const status = await get_status({
  direction: "deposit",
  l1_tx_hash,
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: ERA_SEPOLIA_CHAIN_ID }))

switch (status.state) {
  case "submitted_l1":   // L1 tx broadcast
  case "included_l1":    // L1 tx included
  case "in_progress_l2": // waiting for the L2 system tx
  case "succeeded_l2":   // L2 credit landed
  case "failed_l2":      // L2 execution reverted — see step 8
}
```

## 5 — Start a withdrawal (L2 → L1)

For ETH, `start_withdraw_eth` calls `L2BaseToken.withdraw` at the L2 predeploy `0x800a` (a payable call carrying the burn amount).

```ts
import { UintSchema } from "@ethernauta/core"
import { start_withdraw_eth } from "@ethernauta/zksync"

const l2_tx_hash = await start_withdraw_eth({
  to: parse(AddressSchema, "0xL1Recipient"),
  amount: parse(UintSchema, "0x38d7ea4c68000"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: ERA_SEPOLIA_CHAIN_ID }),
  }),
)
```

For ERC-20s, `start_withdraw_erc20` calls `L2AssetRouter.withdraw` at predeploy `0x10003` with the inline-derived `assetId`. For arbitrary L2 → L1 messages, `start_withdraw_message` composes the `L1Messenger.sendToL1` precompile at `0x8008`.

Persist `l2_tx_hash` plus the L2 receipt's `L1MessageSent` log index — the rest of the flow needs both.

## 6 — Poll withdraw status

```ts
const status = await get_status({
  direction: "withdraw",
  l2_tx_hash,
  l2_to_l1_log_index: 0, // index of the L1MessageSent log in the L2 receipt
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: ERA_SEPOLIA_CHAIN_ID }))

switch (status.state) {
  case "initiated_l2":      // burn included on L2
  case "batch_pending":     // batch awaiting L1 commit / prove / execute
  case "ready_to_finalize": // → call execute_withdraw
  case "finalized":         // L1 release landed
}
```

`get_status` checks `L1Nullifier.isWithdrawalFinalized` plus the sequencer's `zks_getL2ToL1LogProof` availability to walk the state machine.

## 7 — Build the proof + finalize on L1

When `get_status` reports `ready_to_finalize`, `fetch_message_proof` composes the proof bundle from the sequencer RPC and `execute_withdraw` calls `L1Nullifier.finalizeDeposit` (the post-v26 entrypoint).

```ts
import {
  execute_withdraw,
  fetch_message_proof,
  L2_BASE_TOKEN_ADDRESS,
} from "@ethernauta/zksync"

const transport_for_proof = bridge({
  l1: SEPOLIA_CHAIN_ID,
  l2: ERA_SEPOLIA_CHAIN_ID,
})

const proof = await fetch_message_proof({
  l2_tx_hash,
  l2_to_l1_log_index: 0,
  l2_tx_number_in_batch,
  message, // the bytes payload of the L1MessageSent event
})(transport_for_proof)

const execute_l1_tx_hash = await execute_withdraw({
  proof,
  l2_sender: L2_BASE_TOKEN_ADDRESS, // or L2_ASSET_ROUTER_ADDRESS for ERC-20s
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

`l2_sender` is the predeploy that emitted the L1 message: `L2_BASE_TOKEN_ADDRESS` for ETH withdrawals, `L2_ASSET_ROUTER_ADDRESS` for ERC-20 withdrawals, the user's contract for arbitrary messages. The L1 nullifier verifies the merkle proof against the executed batch's L2-to-L1 log tree and releases funds atomically — no separate prove step.

## 8 — Recover a failed deposit

When `get_status` reports `failed_l2` for a deposit (L2 mint reverted, contract OOG'd, etc.), the L1 value is recoverable via `claim_failed_deposit`. The dapp builds a `FailedDepositProof` from the L2 failure log and submits it to the L1 nullifier.

```ts
import { claim_failed_deposit } from "@ethernauta/zksync"
import type { FailedDepositProof } from "@ethernauta/zksync"

const proof: FailedDepositProof = {
  chainIdNumeric,         // L2 chain id as uint256
  depositSender,          // L1 sender address
  l1Token,                // L1 token address (or 0x0000…1 for ETH)
  amount,                 // amount that was deposited
  l2TxHash,               // L2 tx hash that reverted
  l2BatchNumber,          // batch the failure landed in
  l2MessageIndex,         // L2-to-L1 log index
  l2TxNumberInBatch,
  merkleProof,            // merkle path against the L2-to-L1 log root
}

const claim_l1_tx_hash = await claim_failed_deposit({ proof })(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: ERA_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

The L1 nullifier verifies the proof, marks the deposit as claimed, and releases the L1-locked funds back to `depositSender`. No equivalent in the OP or Arbitrum families — those force-include deposits at the protocol level, so an L1-recoverable failure mode doesn't exist there.

## Errors

zkSync-side bridge reverts decode to a typed `ZksyncBridgeFailure` thrown from underneath `eth_sendRawTransaction`:

- **`ProofUnavailable`** — the L2 batch backing the withdrawal hasn't been executed on L1 yet (the proof bundle would be against a not-yet-committed batch).
- **`AlreadyExecuted`** — `execute_withdraw` called twice on the same message, mapped from `L1Nullifier.WithdrawalAlreadyFinalized`.

```ts
import { ZksyncBridgeFailure } from "@ethernauta/zksync"

try {
  await execute_withdraw({ proof, l2_sender: L2_BASE_TOKEN_ADDRESS })(transport)
} catch (e) {
  if (e instanceof ZksyncBridgeFailure) {
    switch (e.data.kind) {
      case "ProofUnavailable": /* retry */ break
      case "AlreadyExecuted":  /* idempotent — treat as success */ break
    }
  }
}
```

## What ships from `@ethernauta/zksync`

| Verb | Shape |
|---|---|
| `send_eth` | `Bridgeable<Hash32>` |
| `send_erc20` | `Bridgeable<Hash32>` |
| `send_message` | `Bridgeable<Hash32>` |
| `claim_failed_deposit` | `Bridgeable<Hash32>` |
| `start_withdraw_eth` | `Bridgeable<Hash32>` |
| `start_withdraw_erc20` | `Bridgeable<Hash32>` |
| `start_withdraw_message` | `Bridgeable<Hash32>` |
| `fetch_message_proof` | `Bridgeable<MessageProof>` |
| `execute_withdraw` | `Bridgeable<Hash32>` |
| `get_status` | `Bridgeable<ZksyncBridgeStatus>` |

Plus `create_bridge`, `ZksyncBridgeFailure`, `ZksyncBridgeErrorSchema`, `with_zksync_errors`, `ZksyncBridgeStatusSchema`, `MessageProofSchema`, `FailedDepositProofSchema`, and the L2 predeploy constants `L2_BASE_TOKEN_ADDRESS` + `L2_ASSET_ROUTER_ADDRESS`. Thin per-contract bindings (`requestL2TransactionDirect`, `withdraw`, `finalizeDeposit`, `sendToL1`, …) sit under subpath imports like `@ethernauta/zksync/bridge/bridgehub`.

## See also

- [`/bridge/overview`](/bridge/overview) — `Bridgeable<T>` shape + verb-naming philosophy.
- [`/bridge/op`](/bridge/op) — OP Stack worked example.
- [`/bridge/arbitrum`](/bridge/arbitrum) — Arbitrum worked example.
- [`packages/zksync/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/zksync/COMPARISON.md) — feature-by-feature comparison vs `zksync-ethers` + `viem/zksync`.
- [zkSync Era L1 ↔ L2 communication](https://docs.zksync.io/zk-stack/concepts/l1-l2-interoperability) — protocol authority for the L1 ↔ L2 messaging model.
- [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) — author-notes on how the L2-to-L1 log proof actually works.
