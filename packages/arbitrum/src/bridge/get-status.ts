// L1→L2 / L2→L1 lifecycle status read for Arbitrum bridges.
//
// Read-only verb (no signer). Direction-discriminated input:
//
//   - direction: "deposit" — L1→L2. Caller supplies the L1
//     deposit / retryable-creation tx hash. The verb reads the
//     L1 receipt and reports `submitted_l1` (no receipt yet),
//     `included_l1` (receipt reverted), or `in_progress_l2`
//     (receipt succeeded). Deriving the L2-deposit tx hash from
//     the `InboxMessageDelivered` event so `succeeded_l2` /
//     `failed_l2` can be resolved is deferred to a follow-up;
//     the union ships those terminal states so a dapp's
//     `switch` is exhaustive against the locked spec.
//
//   - direction: "withdraw" — L2→L1. Caller supplies the
//     `WithdrawalTransaction` payload (the same shape consumed
//     by `fetch_message_proof` and `execute_withdraw`). The
//     verb derives the message's send-root via
//     `ArbSys.sendMerkleTreeState` + `NodeInterface.constructOutboxProof`
//     on L2, then reads on L1:
//       - `Outbox.isSpent(position)` — if true, `executed`.
//       - `Outbox.roots(sendRoot)` — non-zero means the
//         covering Rollup assertion is confirmed and the
//         message is `executable`; zero means it is still
//         `confirming` inside the ~6.4 day window (Sepolia is
//         accelerated to ~1 hour).
//     `initiated_l2` is reported when the proof-construction
//     read reverts (the message isn't reflected in the send
//     merkle tree yet — rare; covers the brief window before
//     ArbOS folds the L2→L1 message into the tree).
//
// Path-2 composition (per M3): pure RPC reads, no signer. The
// dapp polls this verb between user actions; FSM / observable
// land in a follow-up plan once all three rollups have a
// stable `get_status` shape.
//
// Slice 3c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Address,
  type Bytes32,
  Bytes32Schema,
  type BytesSchema,
  type Hash32,
  Hash32Schema,
  type Uint64,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import {
  eth_call,
  eth_getTransactionReceipt,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ChainId,
  Reader,
  ResolvedBridge,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { literal, object, parse, variant } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import {
  ARB_SYS_ADDRESS,
  sendMerkleTreeState,
} from "../precompiles/arb-sys"
import {
  constructOutboxProof,
  NODE_INTERFACE_ADDRESS,
} from "../precompiles/node-interface"
import { WithdrawalTransactionSchema } from "./message-proof"
import { isSpent } from "./outbox/methods/is-spent"
import { roots } from "./outbox/methods/roots"

const DepositInputSchema = object({
  direction: literal("deposit"),
  l1_tx_hash: Hash32Schema,
})
const WithdrawInputSchema = object({
  direction: literal("withdraw"),
  message: WithdrawalTransactionSchema,
})
const ParametersSchema = variant("direction", [
  DepositInputSchema,
  WithdrawInputSchema,
])
type Parameters = InferOutput<typeof ParametersSchema>

export const ArbitrumBridgeStatusSchema = variant("state", [
  object({ state: literal("submitted_l1") }),
  object({
    state: literal("included_l1"),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal("in_progress_l2"),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal("succeeded_l2"),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({
    state: literal("failed_l2"),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({ state: literal("initiated_l2") }),
  object({
    state: literal("confirming"),
    send_root: Bytes32Schema,
  }),
  object({
    state: literal("executable"),
    send_root: Bytes32Schema,
  }),
  object({ state: literal("executed") }),
])
export type ArbitrumBridgeStatus = InferOutput<
  typeof ArbitrumBridgeStatusSchema
>

const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)

export function get_status(
  _parameters: Parameters,
): Bridgeable<ArbitrumBridgeStatus> {
  return async ({
    l1,
    l2,
  }: ResolvedBridge): Promise<ArbitrumBridgeStatus> => {
    const parameters = parse(ParametersSchema, _parameters)
    if (parameters.direction === "deposit") {
      return read_deposit_status({
        l1_reader: l1.reader,
        l1_chain_id: l1.chain_id,
        l1_tx_hash: parameters.l1_tx_hash,
      })
    }
    return read_withdraw_status({
      l1_reader: l1.reader,
      l1_chain_id: l1.chain_id,
      l2_reader: l2.reader,
      l2_chain_id: l2.chain_id,
      outbox_address: require_deploy_addresses(l2.chain_id)
        .ethBridge.outbox,
      position: parameters.message.position,
    })
  }
}

async function read_deposit_status(input: {
  l1_reader: Reader
  l1_chain_id: ChainId
  l1_tx_hash: Hash32
}): Promise<ArbitrumBridgeStatus> {
  const receipt = await eth_getTransactionReceipt([
    input.l1_tx_hash,
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  if (receipt === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: "submitted_l1",
    })
  }
  if (
    receipt.status !== undefined &&
    hex_to_bigint(receipt.status) === 0n
  ) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: "included_l1",
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  return parse(ArbitrumBridgeStatusSchema, {
    state: "in_progress_l2",
    l1_tx_hash: input.l1_tx_hash,
  })
}

async function read_withdraw_status(input: {
  l1_reader: Reader
  l1_chain_id: ChainId
  l2_reader: Reader
  l2_chain_id: ChainId
  outbox_address: Address
  position: Uint64
}): Promise<ArbitrumBridgeStatus> {
  const index = parse(Uint256Schema, input.position)
  const spent = await read_call({
    reader: input.l1_reader,
    chain_id: input.l1_chain_id,
    to: input.outbox_address,
    callable: isSpent([index]),
  })
  if (spent) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: "executed",
    })
  }
  const send_root = await derive_send_root({
    l2_reader: input.l2_reader,
    l2_chain_id: input.l2_chain_id,
    position: input.position,
  })
  if (send_root === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: "initiated_l2",
    })
  }
  const roots_value = await read_call({
    reader: input.l1_reader,
    chain_id: input.l1_chain_id,
    to: input.outbox_address,
    callable: roots([send_root]),
  })
  if (roots_value === ZERO_BYTES32) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: "confirming",
      send_root,
    })
  }
  return parse(ArbitrumBridgeStatusSchema, {
    state: "executable",
    send_root,
  })
}

async function derive_send_root(input: {
  l2_reader: Reader
  l2_chain_id: ChainId
  position: Uint64
}): Promise<Bytes32 | null> {
  try {
    const size_call = sendMerkleTreeState()({
      chain_id: input.l2_chain_id,
      to: ARB_SYS_ADDRESS,
    })
    const size_bytes = await eth_call([
      { to: size_call.to, input: size_call.data },
    ])([input.l2_reader, { chain_id: input.l2_chain_id }])
    const [size_uint256] = size_call.decode(size_bytes)
    const size = parse(
      Uint64Schema,
      bigint_to_hex(hex_to_bigint(size_uint256)),
    )
    if (
      hex_to_bigint(input.position) >= hex_to_bigint(size)
    ) {
      return null
    }
    const proof_call = constructOutboxProof([
      size,
      input.position,
    ])({
      chain_id: input.l2_chain_id,
      to: NODE_INTERFACE_ADDRESS,
    })
    const proof_bytes = await eth_call([
      { to: proof_call.to, input: proof_call.data },
    ])([input.l2_reader, { chain_id: input.l2_chain_id }])
    const [, send_root] = proof_call.decode(proof_bytes)
    return send_root
  } catch {
    return null
  }
}

type CallableLike<T> = (context: {
  chain_id: ChainId
  to: Address
}) => {
  to: Address
  data: InferOutput<typeof BytesSchema>
  decode: (result: InferOutput<typeof BytesSchema>) => T
}

async function read_call<T>(input: {
  reader: Reader
  chain_id: ChainId
  to: Address
  callable: CallableLike<T>
}): Promise<T> {
  const built = input.callable({
    chain_id: input.chain_id,
    to: input.to,
  })
  const bytes = await eth_call([
    { to: built.to, input: built.data },
  ])([input.reader, { chain_id: input.chain_id }])
  return built.decode(bytes)
}
