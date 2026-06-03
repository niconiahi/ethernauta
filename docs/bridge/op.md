---
title: OP Stack — worked example
section: Bridge
section_order: 11
order: 2
---

# OP Stack — deposit + fault-proof withdraw round trip

End-to-end: bridge ETH from Sepolia to OP Sepolia, then withdraw it back through the fault-proof flow.

```bash
pnpm add @ethernauta/op @ethernauta/transport @ethernauta/core @ethernauta/eth @ethernauta/utils
```

Every verb in this page is exported from `@ethernauta/op` and tested against the OP-Sepolia ↔ Sepolia pair. See [`/bridge/overview`](/bridge/overview) for the `Bridgeable<T>` shape and verb-naming philosophy.

## Wire up the resolver

```ts
import { eip155_11155111 } from "@ethernauta/chain/eip155-11155111"
import { eip155_11155420 } from "@ethernauta/chain/eip155-11155420"
import { encode_chain_id, http } from "@ethernauta/transport"
import { create_bridge } from "@ethernauta/op"

const SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155111.chainId,
})
const OP_SEPOLIA_CHAIN_ID = encode_chain_id({
  namespace: "eip155",
  reference: eip155_11155420.chainId,
})

const bridge = create_bridge([
  {
    chainId: SEPOLIA_CHAIN_ID,
    transports: [
      http("https://ethereum-sepolia-rpc.publicnode.com"),
      http("https://sepolia.gateway.tenderly.co"),
    ],
  },
  {
    chainId: OP_SEPOLIA_CHAIN_ID,
    transports: [http("https://sepolia.optimism.io")],
  },
])
```

The same `bridge` instance serves every call in this page — deposits, withdrawals, reads. The signer is per-call; the resolver omits it for reads.

## 1 — Deposit ETH (L1 → L2)

`send_eth` calls `L1StandardBridge.bridgeETHTo` on Sepolia. The OP sequencer reads the L1 log and mints ETH on OP Sepolia ~1–3 minutes after L1 inclusion.

```ts
import { AddressSchema, Uint32Schema, UintSchema } from "@ethernauta/core"
import { send_eth } from "@ethernauta/op"
import { parse } from "valibot"

const recipient = parse(AddressSchema, "0xYourRecipient")
const amount = parse(UintSchema, "0x38d7ea4c68000") // 0.001 ETH

const l1_tx_hash = await send_eth({
  to: recipient,
  amount,
  min_gas_limit: parse(Uint32Schema, "0x30d40"), // 200_000
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: OP_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

The wallet only signs (path 2 per [M3](/concepts/two-paths)); the verb broadcasts via `eth_sendRawTransaction` on the L1 reader.

## 2 — Track deposit progress

`get_status` with `direction: "deposit"` returns where the op sits in its lifecycle. Polling once per ~15s is plenty.

```ts
import { get_status } from "@ethernauta/op"

const status = await get_status({
  direction: "deposit",
  l1_tx_hash,
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: OP_SEPOLIA_CHAIN_ID }))

switch (status.state) {
  case "submitted_l1":   // L1 tx broadcast, not yet included
  case "included_l1":    // L1 tx included
  case "in_progress_l2": // waiting for the L2 system tx
  case "succeeded_l2":   // L2 credit landed
  case "failed_l2":      // L2 mint reverted
}
```

No signer on the resolver — reads ignore it. The state union is exhaustive at compile time.

## 3 — Start a withdrawal (L2 → L1)

`start_withdraw_eth` calls `L2StandardBridge.withdrawTo` as a payable transaction on OP Sepolia. The transaction burns ETH on L2 and emits a `MessagePassed` log on the `L2ToL1MessagePasser` predeploy.

```ts
import { Uint256Schema } from "@ethernauta/core"
import { start_withdraw_eth } from "@ethernauta/op"

const l2_tx_hash = await start_withdraw_eth({
  to: recipient,
  amount: parse(Uint256Schema, "0x38d7ea4c68000"),
  min_gas_limit: parse(Uint32Schema, "0x30d40"),
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: OP_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: OP_SEPOLIA_CHAIN_ID }),
  }),
)
```

Persist `l2_tx_hash` — the rest of the flow needs it.

## 4 — Decode the `MessagePassed` event

The withdrawal handle is the parsed `MessagePassed` event from the L2 receipt + the L2 block the burn landed in. Both feed every subsequent verb.

```ts
import {
  address as address_codec,
  bytes as bytes_codec,
  bytes32 as bytes32_codec,
  decode_logs,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import { Hash32Schema } from "@ethernauta/core"
import { eth_getTransactionReceipt } from "@ethernauta/eth"
import { hex_to_bigint } from "@ethernauta/utils"
import {
  L2_TO_L1_MESSAGE_PASSER_ADDRESS,
  WithdrawalTransactionSchema,
} from "@ethernauta/op"

const transport = bridge({
  l1: SEPOLIA_CHAIN_ID,
  l2: OP_SEPOLIA_CHAIN_ID,
})

const receipt = await eth_getTransactionReceipt([l2_tx_hash])([
  transport.l2.reader,
  { chain_id: OP_SEPOLIA_CHAIN_ID },
])

if (receipt === null) throw new Error("L2 receipt not yet available")

const message_passer_logs = receipt.logs.filter(
  (log) =>
    log.address.toLowerCase() ===
    L2_TO_L1_MESSAGE_PASSER_ADDRESS.toLowerCase(),
)
const decoded = decode_logs(
  [
    {
      name: "MessagePassed",
      args: [
        uint256_codec(), // nonce
        address_codec(), // sender
        address_codec(), // target
        uint256_codec(), // value
        uint256_codec(), // gasLimit
        bytes_codec(),   // data
        bytes32_codec(), // withdrawalHash
      ],
      indexed: [true, true, true, false, false, false, false],
    },
  ],
  message_passer_logs,
)
const event = decoded[0]
if (!event) throw new Error("no MessagePassed event in L2 receipt")

const [nonce, sender, target, value, gas_limit, data, withdrawal_hash] = event.args

const withdrawal_transaction = parse(WithdrawalTransactionSchema, {
  nonce, sender, target, value, gasLimit: gas_limit, data,
})
const withdrawal_l2_block_number = parse(
  Uint256Schema,
  `0x${hex_to_bigint(receipt.blockNumber).toString(16)}`,
)
```

`WithdrawalTransactionSchema` is the shape `prove_withdraw` and `execute_withdraw` consume. Persist `withdrawal_transaction` + `withdrawal_l2_block_number` to localStorage so the dapp can resume after the ~7-day wait.

## 5 — Poll withdraw status

`get_status` with `direction: "withdraw"` walks the fault-proof state machine. The `prover` field is the address that will submit the prove transaction — usually the signed-in user.

```ts
const status = await get_status({
  direction: "withdraw",
  withdrawal_transaction,
  withdrawal_l2_block_number,
  prover: recipient, // the account that will call prove_withdraw
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: OP_SEPOLIA_CHAIN_ID }))

switch (status.state) {
  case "initiated_l2":           // burn included, no game proposed yet
  case "awaiting_game_proposal": // waiting for the dispute game factory
  case "game_in_progress":       // game is being played
  case "ready_to_prove":         // → call prove_withdraw
  case "proof_pending_maturity": // proof accepted; wait for delays
  case "ready_to_finalize":      // → call execute_withdraw
  case "finalized":              // L1 release landed
  case "game_invalidated":       // dispute game retired / blacklisted
}
```

`proof_pending_maturity` carries a `mature_at_seconds` field so the UI can render an ETA.

## 6 — Build the proof + prove on L1

When `get_status` reports `ready_to_prove`, `fetch_message_proof` composes the proof bundle and `prove_withdraw` submits it.

```ts
import { fetch_message_proof, prove_withdraw } from "@ethernauta/op"

const message_proof = await fetch_message_proof({
  withdrawal_transaction,
  withdrawal_l2_block_number,
})(bridge({ l1: SEPOLIA_CHAIN_ID, l2: OP_SEPOLIA_CHAIN_ID }))

const prove_l1_tx_hash = await prove_withdraw({
  proof: message_proof,
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: OP_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

`fetch_message_proof` picks a resolved dispute game from `DisputeGameFactory` and builds the output-root proof + Merkle-Patricia proof of the L2 storage slot. `prove_withdraw` registers it on `OptimismPortal2` with the resolved game index. No funds movement yet — this starts the `proofMaturityDelaySeconds` + `disputeGameFinalityDelaySeconds` windows.

## 7 — Finalize on L1

When `get_status` reports `ready_to_finalize`, `execute_withdraw` releases the L1 ETH.

```ts
import { execute_withdraw } from "@ethernauta/op"

const finalize_l1_tx_hash = await execute_withdraw({
  message: withdrawal_transaction,
})(
  bridge({
    l1: SEPOLIA_CHAIN_ID,
    l2: OP_SEPOLIA_CHAIN_ID,
    signer: provider.signer({ chain_id: SEPOLIA_CHAIN_ID }),
  }),
)
```

OP is the one rollup family where `execute_withdraw` takes only `{ message }` (no fresh proof) — the proof was already accepted in step 6 and is replayed from portal storage. Arbitrum and zkSync validate the proof inline on the finalize call, so they need `{ proof, ... }`.

## Errors

OP-side bridge reverts decode to a typed `OpBridgeFailure` thrown from underneath `eth_sendRawTransaction`. The reader-layer wrap (`with_op_errors`) catches recognized custom-error selectors in the RPC response:

- **`ProofUnavailable`** — the L2 batch backing the withdrawal hasn't been posted to L1 yet. Retry later.
- **`GameUnresolved`** — the dispute game backing the proof is still `IN_PROGRESS`. Status reports this as `game_in_progress`.
- **`GameInvalidated`** — the game resolved against the proposer, was blacklisted, or the respected game type changed under it. Treat as "pick a fresh game" — the proof bundle is dead.
- **`ProofNotMature`** — `prove_withdraw` succeeded but `proofMaturityDelaySeconds` hasn't elapsed. Wait.

```ts
import { OpBridgeFailure } from "@ethernauta/op"

try {
  await execute_withdraw({ message: withdrawal_transaction })(transport)
} catch (e) {
  if (e instanceof OpBridgeFailure) {
    switch (e.data.kind) {
      case "ProofUnavailable": /* retry later */ break
      case "GameUnresolved":   /* wait */ break
      case "GameInvalidated":  /* re-prove against a fresh game */ break
      case "ProofNotMature":   /* check mature_at_seconds */ break
    }
  }
}
```

## What ships from `@ethernauta/op`

| Verb | Shape |
|---|---|
| `send_eth` | `Bridgeable<Hash32>` |
| `send_erc20` | `Bridgeable<Hash32>` |
| `send_message` | `Bridgeable<Hash32>` |
| `start_withdraw_eth` | `Bridgeable<Hash32>` |
| `start_withdraw_erc20` | `Bridgeable<Hash32>` |
| `start_withdraw_message` | `Bridgeable<Hash32>` |
| `fetch_message_proof` | `Bridgeable<MessageProof>` |
| `prove_withdraw` | `Bridgeable<Hash32>` |
| `execute_withdraw` | `Bridgeable<Hash32>` |
| `get_status` | `Bridgeable<OpBridgeStatus>` |

Plus `create_bridge`, `OpBridgeFailure`, `OpBridgeErrorSchema`, `with_op_errors`, `OpBridgeStatusSchema`, `MessageProofSchema`, `WithdrawalTransactionSchema`, `OutputRootProofSchema`, and the `L2_TO_L1_MESSAGE_PASSER_ADDRESS` predeploy constant. Thin per-contract bindings (`bridgeETHTo`, `proveWithdrawalTransaction`, …) sit under subpath imports like `@ethernauta/op/bridge/optimism-portal`.

## See also

- [`/bridge/overview`](/bridge/overview) — `Bridgeable<T>` shape + verb-naming philosophy.
- [`/bridge/arbitrum`](/bridge/arbitrum) — Arbitrum worked example.
- [`/bridge/zksync`](/bridge/zksync) — zkSync Era worked example.
- [`/op/overview`](/op/overview) — OP Stack package surface beyond the bridge.
- [`packages/op/COMPARISON.md`](https://github.com/niconiahi/ethernauta/blob/main/packages/op/COMPARISON.md) — feature-by-feature comparison vs `viem/op-stack` + `@eth-optimism/sdk`.
- [OP Stack withdrawal spec](https://specs.optimism.io/protocol/withdrawals.html) — protocol authority for the prove + finalize flow.
- [`BRIDGE.md`](https://github.com/niconiahi/ethernauta/blob/main/BRIDGE.md) — author-notes on how the proof construction actually works.
