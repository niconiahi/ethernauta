// L1→L2 / L2→L1 lifecycle status read for zkSync-family bridges.
//
// Read-only verb (no signer). Direction-discriminated input:
//
//   - direction: "deposit" — L1→L2. Caller supplies the L1
//     priority-request tx hash (the `Bridgehub.requestL2Transaction*`
//     tx). The verb reads the L1 receipt and reports
//     `submitted_l1` (no receipt yet), `included_l1` (receipt
//     reverted), or `in_progress_l2` (receipt succeeded).
//     Deriving the L2 canonical hash from the L1 receipt's
//     `NewPriorityRequest` event so `succeeded_l2` / `failed_l2`
//     can be resolved is deferred to a follow-up; the union
//     ships those terminal states so a dapp's `switch` is
//     exhaustive against the locked spec.
//
//   - direction: "withdraw" — L2→L1. Caller supplies the L2
//     burn tx hash + the L2→L1 log index of the message the
//     dapp cares about (the same `(l2_tx_hash,
//     l2_to_l1_log_index)` pair `fetch_message_proof` accepts).
//     The verb composes:
//       - `zks_getL2ToL1LogProof(l2_tx_hash, log_index)` on
//         `l2.reader`, wrapped in a try/catch that surfaces
//         `initiated_l2` when the L2 tx is not yet visible to
//         the node (rare; covers the brief window before zkSync
//         indexes the tx into the L2→L1 log surface).
//       - A `null` return means the originating batch has not
//         yet been committed + verified — `batch_pending`.
//       - A non-null return is anchored to a committed batch;
//         the verb then reads
//         `L1Nullifier.isWithdrawalFinalized(chainId,
//         l2BatchNumber, l2MessageIndex)` on `l1.reader` —
//         `true` ⇒ `finalized`, `false` ⇒ `ready_to_finalize`.
//
// Path-2 composition (per M3): pure RPC reads, no signer. The
// dapp polls this verb between user actions; FSM / observable
// land in a follow-up plan once all three rollups have a stable
// `get_status` shape.
//
// Slice 4c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Address,
  type Hash32,
  Hash32Schema,
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
import { decode_chain_id } from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
  type ObjectValues,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  literal,
  number,
  object,
  parse,
  variant,
} from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import {
  type L2ToL1LogProof,
  zks_getL2ToL1LogProof,
} from "../methods/zks-get-l2-to-l1-log-proof"
import {
  decode_new_priority_request_from_receipt,
  l2_hash_of_priority_request,
} from "./decode-new-priority-request"
import { isWithdrawalFinalized } from "./l1-nullifier/methods/is-withdrawal-finalized"

const DepositInputSchema = object({
  direction: literal("deposit"),
  l1_tx_hash: Hash32Schema,
})
const WithdrawInputSchema = object({
  direction: literal("withdraw"),
  l2_tx_hash: Hash32Schema,
  l2_to_l1_log_index: number(),
})
const ParametersSchema = variant("direction", [
  DepositInputSchema,
  WithdrawInputSchema,
])
type Parameters = InferOutput<typeof ParametersSchema>

export const ZKSYNC_BRIDGE_STATE = {
  SUBMITTED_L1: "submitted_l1",
  INCLUDED_L1: "included_l1",
  IN_PROGRESS_L2: "in_progress_l2",
  SUCCEEDED_L2: "succeeded_l2",
  FAILED_L2: "failed_l2",
  INITIATED_L2: "initiated_l2",
  BATCH_PENDING: "batch_pending",
  READY_TO_FINALIZE: "ready_to_finalize",
  FINALIZED: "finalized",
} as const
export type ZksyncBridgeState = ObjectValues<
  typeof ZKSYNC_BRIDGE_STATE
>

export const ZksyncBridgeStatusSchema = variant("state", [
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.SUBMITTED_L1),
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.INCLUDED_L1),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.IN_PROGRESS_L2),
    l1_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.SUCCEEDED_L2),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.FAILED_L2),
    l1_tx_hash: Hash32Schema,
    l2_tx_hash: Hash32Schema,
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.INITIATED_L2),
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.BATCH_PENDING),
  }),
  object({
    state: literal(ZKSYNC_BRIDGE_STATE.READY_TO_FINALIZE),
  }),
  object({ state: literal(ZKSYNC_BRIDGE_STATE.FINALIZED) }),
])
export type ZksyncBridgeStatus = InferOutput<
  typeof ZksyncBridgeStatusSchema
>

export function get_status(
  _parameters: Parameters,
): Bridgeable<ZksyncBridgeStatus> {
  return async ({
    l1,
    l2,
  }: ResolvedBridge): Promise<ZksyncBridgeStatus> => {
    const parameters = parse(ParametersSchema, _parameters)
    if (parameters.direction === "deposit") {
      return read_deposit_status({
        l1_reader: l1.reader,
        l1_chain_id: l1.chain_id,
        l2_reader: l2.reader,
        l2_chain_id: l2.chain_id,
        l1_tx_hash: parameters.l1_tx_hash,
      })
    }
    const nullifier = require_deploy_addresses(l2.chain_id)
      .l1.l1Nullifier
    const l2_chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(decode_chain_id(l2.chain_id).reference),
      ),
    )
    return read_withdraw_status({
      l1_reader: l1.reader,
      l1_chain_id: l1.chain_id,
      l2_reader: l2.reader,
      l2_chain_id: l2.chain_id,
      nullifier,
      l2_chain_id_numeric,
      l2_tx_hash: parameters.l2_tx_hash,
      l2_to_l1_log_index: parameters.l2_to_l1_log_index,
    })
  }
}

async function read_deposit_status(input: {
  l1_reader: Reader
  l1_chain_id: ChainId
  l2_reader: Reader
  l2_chain_id: ChainId
  l1_tx_hash: Hash32
}): Promise<ZksyncBridgeStatus> {
  const receipt = await eth_getTransactionReceipt([
    input.l1_tx_hash,
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  if (receipt === null) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.SUBMITTED_L1,
    })
  }
  if (
    receipt.status !== undefined &&
    hex_to_bigint(receipt.status) === 0n
  ) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.INCLUDED_L1,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const priority_request =
    decode_new_priority_request_from_receipt({
      logs: receipt.logs,
    })
  if (priority_request === null) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const l2_tx_hash = l2_hash_of_priority_request(
    priority_request,
  )
  const l2_receipt = await eth_getTransactionReceipt([
    l2_tx_hash,
  ])([input.l2_reader, { chain_id: input.l2_chain_id }])
  if (l2_receipt === null) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.IN_PROGRESS_L2,
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  if (
    l2_receipt.status !== undefined &&
    hex_to_bigint(l2_receipt.status) === 0n
  ) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.FAILED_L2,
      l1_tx_hash: input.l1_tx_hash,
      l2_tx_hash,
    })
  }
  return parse(ZksyncBridgeStatusSchema, {
    state: ZKSYNC_BRIDGE_STATE.SUCCEEDED_L2,
    l1_tx_hash: input.l1_tx_hash,
    l2_tx_hash,
  })
}

async function read_withdraw_status(input: {
  l1_reader: Reader
  l1_chain_id: ChainId
  l2_reader: Reader
  l2_chain_id: ChainId
  nullifier: Address
  l2_chain_id_numeric: InferOutput<typeof Uint256Schema>
  l2_tx_hash: Hash32
  l2_to_l1_log_index: number
}): Promise<ZksyncBridgeStatus> {
  const log_proof = await read_log_proof_or_null({
    reader: input.l2_reader,
    chain_id: input.l2_chain_id,
    l2_tx_hash: input.l2_tx_hash,
    log_index: input.l2_to_l1_log_index,
  })
  if (log_proof === "no_tx") {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.INITIATED_L2,
    })
  }
  if (log_proof === null) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.BATCH_PENDING,
    })
  }
  const batch_number = parse(
    Uint256Schema,
    log_proof.batchNumber,
  )
  const message_index = parse(Uint256Schema, log_proof.id)
  const finalized_call = isWithdrawalFinalized([
    input.l2_chain_id_numeric,
    batch_number,
    message_index,
  ])({
    chain_id: input.l1_chain_id,
    to: input.nullifier,
  })
  const finalized_bytes = await eth_call([
    {
      to: finalized_call.to,
      input: finalized_call.data,
    },
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  const finalized = finalized_call.decode(finalized_bytes)
  if (finalized) {
    return parse(ZksyncBridgeStatusSchema, {
      state: ZKSYNC_BRIDGE_STATE.FINALIZED,
    })
  }
  return parse(ZksyncBridgeStatusSchema, {
    state: ZKSYNC_BRIDGE_STATE.READY_TO_FINALIZE,
  })
}

async function read_log_proof_or_null(input: {
  reader: Reader
  chain_id: ChainId
  l2_tx_hash: Hash32
  log_index: number
}): Promise<L2ToL1LogProof | null | "no_tx"> {
  try {
    return await zks_getL2ToL1LogProof([
      input.l2_tx_hash,
      input.log_index,
    ])([input.reader, { chain_id: input.chain_id }])
  } catch {
    return "no_tx"
  }
}
