// L1→L2 / L2→L1 lifecycle status read for Arbitrum bridges.
//
// Read-only verb (no signer). Direction-discriminated input:
//
//   - direction: "deposit" — L1→L2. Caller supplies the L1
//     deposit / retryable-creation tx hash. The verb reads the
//     L1 receipt; if missing it reports `submitted_l1`; if it
//     reverted it reports `included_l1`. On a successful
//     receipt it fetches the L1 block (for its `baseFeePerGas`)
//     and scans the receipt's logs for
//     `Inbox.InboxMessageDelivered`. If a matching log is
//     present it recovers the L2 retryable hash via
//     `compute_l2_retryable_tx_hash` (raw L1 sender +
//     parentBaseFee from the block + the packed payload), then
//     reads the L2 receipt of the derived retryable via the
//     destination reader and reports `succeeded_l2` /
//     `failed_l2` from its status — or `in_progress_l2` if the
//     L2 receipt isn't available yet (or no Inbox log was
//     emitted, e.g. the L1 tx didn't go through the Inbox).
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
  bytes as bytes_codec,
  decode_event_log,
  event_topic_hash,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  type Address,
  type Bytes32,
  Bytes32Schema,
  type BytesSchema,
  type Hash32,
  Hash32Schema,
  type Uint64,
  Uint64Schema,
  type Uint256,
  Uint256Schema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import {
  eth_call,
  eth_getBlockByHash,
  eth_getTransactionReceipt,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ChainId,
  Reader,
  ResolvedBridge,
} from "@ethernauta/transport"
import { decode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
  type ObjectValues,
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
import {
  compute_l2_retryable_tx_hash,
  type RetryableLog,
  RetryableLogSchema,
} from "./encode-retryable-tx"
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

export const ARBITRUM_BRIDGE_STATE = {
  SUBMITTED_L1: "submitted_l1",
  INCLUDED_L1: "included_l1",
  IN_PROGRESS_L2: "in_progress_l2",
  SUCCEEDED_L2: "succeeded_l2",
  FAILED_L2: "failed_l2",
  INITIATED_L2: "initiated_l2",
  CONFIRMING: "confirming",
  EXECUTABLE: "executable",
  EXECUTED: "executed",
} as const
export type ArbitrumBridgeState = ObjectValues<
  typeof ARBITRUM_BRIDGE_STATE
>

export const ArbitrumBridgeStatusSchema = variant("state", [
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.SUBMITTED_L1),
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.INCLUDED_L1),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.SUCCEEDED_L2),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.FAILED_L2),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.INITIATED_L2),
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.CONFIRMING),
    send_root: Bytes32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.EXECUTABLE),
    send_root: Bytes32Schema,
  }),
  object({
    state: literal(ARBITRUM_BRIDGE_STATE.EXECUTED),
  }),
])
export type ArbitrumBridgeStatus = InferOutput<
  typeof ArbitrumBridgeStatusSchema
>

const ZERO_BYTES32 = parse(
  Bytes32Schema,
  `0x${"0".repeat(64)}`,
)

// Inbox.InboxMessageDelivered(uint256 indexed messageNum,
// bytes data). Used to recover the L2 retryable hash from the
// L1 receipt so `succeeded_l2` / `failed_l2` can be derived
// from the L2 receipt of the derived retryable.
const INBOX_MESSAGE_DELIVERED_CODECS = [
  uint256_codec(),
  bytes_codec(),
] as const
const INBOX_MESSAGE_DELIVERED_INDEXED = [true, false]

export function get_status(
  _parameters: Parameters,
): Bridgeable<ArbitrumBridgeStatus> {
  return async ({
    l1,
    l2,
  }: ResolvedBridge): Promise<ArbitrumBridgeStatus> => {
    const parameters = parse(ParametersSchema, _parameters)
    if (parameters.direction === "deposit") {
      const deploys = require_deploy_addresses(l2.chain_id)
      if (deploys.contracts === undefined) {
        throw new Error(
          `get_status: arbitrum chain_id=${l2.chain_id} missing contracts.inbox in deploy registry`,
        )
      }
      return read_deposit_status({
        l1_reader: l1.reader,
        l1_chain_id: l1.chain_id,
        l2_reader: l2.reader,
        l2_chain_id: l2.chain_id,
        inbox_address: deploys.contracts.inbox,
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
  l2_reader: Reader
  l2_chain_id: ChainId
  inbox_address: Address
  l1_tx_hash: Hash32
}): Promise<ArbitrumBridgeStatus> {
  const receipt = await eth_getTransactionReceipt([
    input.l1_tx_hash,
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  if (receipt === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.SUBMITTED_L1,
    })
  }
  if (
    receipt.status !== undefined &&
    hex_to_bigint(receipt.status) === 0n
  ) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.INCLUDED_L1,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const l1_block = await eth_getBlockByHash([
    receipt.blockHash,
    false,
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  if (
    l1_block === null ||
    l1_block.baseFeePerGas === undefined
  ) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const destination_chain_id = parse(
    Uint256Schema,
    bigint_to_hex(
      BigInt(decode_chain_id(input.l2_chain_id).reference),
    ),
  )
  const l1_base_fee = parse(
    Uint256Schema,
    l1_block.baseFeePerGas,
  )
  const deposit_log = find_retryable_log({
    inbox_address: input.inbox_address,
    receipt_logs: receipt.logs,
    sender: receipt.from,
    destination_chain_id,
    l1_base_fee,
  })
  if (deposit_log === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const l2_tx_hash =
    compute_l2_retryable_tx_hash(deposit_log)
  const l2_receipt = await eth_getTransactionReceipt([
    l2_tx_hash,
  ])([input.l2_reader, { chain_id: input.l2_chain_id }])
  if (l2_receipt === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  if (
    l2_receipt.status !== undefined &&
    hex_to_bigint(l2_receipt.status) === 0n
  ) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.FAILED_L2,
      l1_tx_hash: input.l1_tx_hash,
      l2_tx_hash,
    })
  }
  return parse(ArbitrumBridgeStatusSchema, {
    state: ARBITRUM_BRIDGE_STATE.SUCCEEDED_L2,
    l1_tx_hash: input.l1_tx_hash,
    l2_tx_hash,
  })
}

function find_retryable_log(input: {
  inbox_address: Address
  receipt_logs: readonly Log[]
  sender: Address
  destination_chain_id: Uint256
  l1_base_fee: Uint256
}): RetryableLog | null {
  const inbox_lower = input.inbox_address.toLowerCase()
  const topic0 = event_topic_hash(
    "InboxMessageDelivered",
    INBOX_MESSAGE_DELIVERED_CODECS,
  )
  for (const log of input.receipt_logs) {
    if (log.address.toLowerCase() !== inbox_lower) continue
    if (log.topics[0] !== topic0) continue
    const decoded = decode_event_log({
      name: "InboxMessageDelivered",
      args: INBOX_MESSAGE_DELIVERED_CODECS,
      indexed: INBOX_MESSAGE_DELIVERED_INDEXED,
      topics: log.topics,
      data: log.data,
    })
    const [message_num, data] = decoded.args
    return parse(RetryableLogSchema, {
      sender: input.sender,
      message_num,
      data,
      destination_chain_id: input.destination_chain_id,
      l1_base_fee: input.l1_base_fee,
    })
  }
  return null
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
      state: ARBITRUM_BRIDGE_STATE.EXECUTED,
    })
  }
  const send_root = await derive_send_root({
    l2_reader: input.l2_reader,
    l2_chain_id: input.l2_chain_id,
    position: input.position,
  })
  if (send_root === null) {
    return parse(ArbitrumBridgeStatusSchema, {
      state: ARBITRUM_BRIDGE_STATE.INITIATED_L2,
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
      state: ARBITRUM_BRIDGE_STATE.CONFIRMING,
      send_root,
    })
  }
  return parse(ArbitrumBridgeStatusSchema, {
    state: ARBITRUM_BRIDGE_STATE.EXECUTABLE,
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
