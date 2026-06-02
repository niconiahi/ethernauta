// L2→L1 / L1→L2 lifecycle status read for OP-stack bridges
// under fault proofs.
//
// Read-only verb (no signer). Direction-discriminated input:
//
//   - direction: "deposit" — L1→L2. Caller supplies the L1
//     deposit tx hash. The verb reads the L1 receipt; if the
//     receipt is missing it reports `submitted_l1`; if the
//     receipt reverted it reports `included_l1`. On a
//     successful receipt it scans the logs for
//     `OptimismPortal2.TransactionDeposited` and recovers the
//     L2 user-deposit hash via `compute_l2_deposit_tx_hash`
//     (source hash from L1 block hash + log index, RLP of the
//     type-0x7e deposit tx). It then reads the L2 receipt of
//     the derived deposit via the destination reader and
//     reports `succeeded_l2` / `failed_l2` from its status, or
//     `in_progress_l2` if the L2 receipt isn't available yet
//     (or no TransactionDeposited log was emitted, e.g. the
//     L1 tx didn't go through the portal).
//
//   - direction: "withdraw" — L2→L1. Caller supplies the
//     L2 `MessagePassed` payload (already known to the dapp
//     because it was returned by `start_withdraw_*`), its
//     L2 block number, and the address that proved (or will
//     prove) on L1. The verb reads
//     `OptimismPortal.provenWithdrawals(hash, prover)`,
//     `finalizedWithdrawals(hash)`,
//     `proofMaturityDelaySeconds()`,
//     `disputeGameFinalityDelaySeconds()`, the picked dispute
//     game's `status()` / `resolvedAt()`, and
//     `AnchorStateRegistry.disputeGameBlacklist(addr)`, plus
//     a `DisputeGameFactory.gameAtIndex` scan to know whether
//     a usable resolved game covers the withdrawal block.
//
// Path-2 composition (per M3): pure RPC reads, no signer. The
// dapp polls this verb between user actions; FSM / observable
// land in a follow-up plan once all three rollups have a
// stable `get_status` shape.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  bytes as bytes_codec,
  decode_event_log,
  event_topic_hash,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  type Address,
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  type Hash32,
  Hash32Schema,
  type Uint256,
  Uint256Schema,
} from "@ethernauta/core"
import type { Log } from "@ethernauta/eth"
import {
  eth_getBlockByNumber,
  eth_getTransactionReceipt,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  Callable,
  ChainId,
  Dispatcher,
  ResolvedBridge,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { literal, object, parse, variant } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import { isGameBlacklisted } from "./anchor-state-registry/methods/is-game-blacklisted"
import { gameAtIndex } from "./dispute-game-factory/methods/game-at-index"
import { gameCount } from "./dispute-game-factory/methods/game-count"
import {
  compute_l2_deposit_tx_hash,
  type DepositLog,
  DepositLogSchema,
} from "./encode-deposit-tx"
import { compute_withdrawal_hash } from "./encode-withdrawal-proof"
import { l2BlockNumber } from "./fault-dispute-game/methods/l2-block-number"
import { resolvedAt } from "./fault-dispute-game/methods/resolved-at"
import { status as fault_game_status } from "./fault-dispute-game/methods/status"
import { wasRespectedGameTypeWhenCreated } from "./fault-dispute-game/methods/was-respected-game-type-when-created"
import {
  type WithdrawalTransaction,
  WithdrawalTransactionSchema,
} from "./op-message-proof"
import { disputeGameFinalityDelaySeconds } from "./optimism-portal/methods/dispute-game-finality-delay-seconds"
import { finalizedWithdrawals } from "./optimism-portal/methods/finalized-withdrawals"
import { proofMaturityDelaySeconds } from "./optimism-portal/methods/proof-maturity-delay-seconds"
import { provenWithdrawals } from "./optimism-portal/methods/proven-withdrawals"
import { respectedGameType } from "./optimism-portal/methods/respected-game-type"

const DepositInputSchema = object({
  direction: literal("deposit"),
  l1_tx_hash: Hash32Schema,
})
const WithdrawInputSchema = object({
  direction: literal("withdraw"),
  withdrawal_transaction: WithdrawalTransactionSchema,
  withdrawal_l2_block_number: Uint256Schema,
  prover: AddressSchema,
})
const ParametersSchema = variant("direction", [
  DepositInputSchema,
  WithdrawInputSchema,
])
type Parameters = InferOutput<typeof ParametersSchema>

export const OpBridgeStatusSchema = variant("state", [
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
  object({
    state: literal("initiated_l2"),
    withdrawal_hash: Hash32Schema,
  }),
  object({
    state: literal("awaiting_game_proposal"),
    withdrawal_hash: Hash32Schema,
  }),
  object({
    state: literal("game_in_progress"),
    withdrawal_hash: Hash32Schema,
    game_proxy: AddressSchema,
  }),
  object({
    state: literal("ready_to_prove"),
    withdrawal_hash: Hash32Schema,
  }),
  object({
    state: literal("proof_pending_maturity"),
    withdrawal_hash: Hash32Schema,
    mature_at_seconds: Uint256Schema,
  }),
  object({
    state: literal("ready_to_finalize"),
    withdrawal_hash: Hash32Schema,
  }),
  object({
    state: literal("finalized"),
    withdrawal_hash: Hash32Schema,
  }),
  object({
    state: literal("game_invalidated"),
    withdrawal_hash: Hash32Schema,
  }),
])
export type OpBridgeStatus = InferOutput<
  typeof OpBridgeStatusSchema
>

// DEFENDER_WINS in op-contracts' `GameStatus` enum.
const GAME_STATUS_DEFENDER_WINS = 2n

// Bound on how many games to walk back during the L1 scan.
const MAX_GAMES_SCAN = 256n

// OptimismPortal2.TransactionDeposited(address indexed from,
// address indexed to, uint256 indexed version, bytes opaqueData).
// Used to recover the L2 deposit hash from the L1 receipt so
// `succeeded_l2` / `failed_l2` can be derived from the L2
// receipt of the derived deposit.
const TRANSACTION_DEPOSITED_CODECS = [
  address_codec(),
  address_codec(),
  uint256_codec(),
  bytes_codec(),
] as const
const TRANSACTION_DEPOSITED_INDEXED = [
  true,
  true,
  true,
  false,
]

export function get_status(
  _parameters: Parameters,
): Bridgeable<OpBridgeStatus> {
  return async ({
    origin,
    destination,
  }: ResolvedBridge): Promise<OpBridgeStatus> => {
    const parameters = parse(ParametersSchema, _parameters)
    if (parameters.direction === "deposit") {
      return read_deposit_status({
        l1_reader: origin.reader,
        l1_chain_id: origin.chain_id,
        l2_reader: destination.reader,
        l2_chain_id: destination.chain_id,
        l1_tx_hash: parameters.l1_tx_hash,
      })
    }
    return read_withdraw_status({
      l1_reader: destination.reader,
      l1_chain_id: destination.chain_id,
      l2_chain_id: origin.chain_id,
      withdrawal_transaction:
        parameters.withdrawal_transaction,
      withdrawal_l2_block_number:
        parameters.withdrawal_l2_block_number,
      prover: parameters.prover,
    })
  }
}

async function read_deposit_status(input: {
  l1_reader: Dispatcher
  l1_chain_id: ChainId
  l2_reader: Dispatcher
  l2_chain_id: ChainId
  l1_tx_hash: Hash32
}): Promise<OpBridgeStatus> {
  const receipt = await eth_getTransactionReceipt([
    input.l1_tx_hash,
  ])([input.l1_reader, { chain_id: input.l1_chain_id }])
  if (receipt === null) {
    return parse(OpBridgeStatusSchema, {
      state: "submitted_l1",
    })
  }
  const status_hex = receipt.status
  if (
    status_hex !== undefined &&
    hex_to_bigint(status_hex) === 0n
  ) {
    return parse(OpBridgeStatusSchema, {
      state: "included_l1",
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const portal_address = require_deploy_addresses(
    input.l2_chain_id,
  ).contracts.OptimismPortalProxy
  const deposit_log_event = find_deposit_log({
    portal_address,
    receipt_logs: receipt.logs,
    l1_block_hash: receipt.blockHash,
  })
  if (!deposit_log_event) {
    return parse(OpBridgeStatusSchema, {
      state: "in_progress_l2",
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const l2_deposit_hash = compute_l2_deposit_tx_hash(
    deposit_log_event,
  )
  const l2_receipt = await eth_getTransactionReceipt([
    l2_deposit_hash,
  ])([input.l2_reader, { chain_id: input.l2_chain_id }])
  if (l2_receipt === null) {
    return parse(OpBridgeStatusSchema, {
      state: "in_progress_l2",
      l1_tx_hash: input.l1_tx_hash,
    })
  }
  const l2_status_hex = l2_receipt.status
  if (
    l2_status_hex !== undefined &&
    hex_to_bigint(l2_status_hex) === 0n
  ) {
    return parse(OpBridgeStatusSchema, {
      state: "failed_l2",
      l1_tx_hash: input.l1_tx_hash,
      l2_tx_hash: l2_deposit_hash,
    })
  }
  return parse(OpBridgeStatusSchema, {
    state: "succeeded_l2",
    l1_tx_hash: input.l1_tx_hash,
    l2_tx_hash: l2_deposit_hash,
  })
}

function find_deposit_log(input: {
  portal_address: Address
  receipt_logs: readonly Log[]
  l1_block_hash: Hash32
}): DepositLog | null {
  const portal_lower = input.portal_address.toLowerCase()
  const topic0 = event_topic_hash(
    "TransactionDeposited",
    TRANSACTION_DEPOSITED_CODECS,
  )
  for (const log of input.receipt_logs) {
    if (log.address.toLowerCase() !== portal_lower) continue
    if (log.topics[0] !== topic0) continue
    const decoded = decode_event_log({
      name: "TransactionDeposited",
      args: TRANSACTION_DEPOSITED_CODECS,
      indexed: TRANSACTION_DEPOSITED_INDEXED,
      topics: log.topics,
      data: log.data,
    })
    const [from, to, , opaque_data] = decoded.args
    return parse(DepositLogSchema, {
      from,
      to,
      opaque_data,
      l1_block_hash: input.l1_block_hash,
      log_index: log.logIndex,
    })
  }
  return null
}

async function read_withdraw_status(input: {
  l1_reader: Dispatcher
  l1_chain_id: ChainId
  l2_chain_id: ChainId
  withdrawal_transaction: WithdrawalTransaction
  withdrawal_l2_block_number: Uint256
  prover: Address
}): Promise<OpBridgeStatus> {
  const withdrawal_hash = compute_withdrawal_hash(
    input.withdrawal_transaction,
  )
  const deploys = require_deploy_addresses(
    input.l2_chain_id,
  ).contracts
  const portal = deploys.OptimismPortalProxy
  const factory = deploys.DisputeGameFactoryProxy
  const anchor_registry = deploys.AnchorStateRegistryProxy
  const finalized = await dispatch_call(
    input.l1_reader,
    finalizedWithdrawals([
      parse(Bytes32Schema, withdrawal_hash),
    ])({
      chain_id: input.l1_chain_id,
      to: portal,
    }),
  )
  if (finalized) {
    return parse(OpBridgeStatusSchema, {
      state: "finalized",
      withdrawal_hash,
    })
  }
  const [proven_game, proven_timestamp] =
    await dispatch_call(
      input.l1_reader,
      provenWithdrawals([
        parse(Bytes32Schema, withdrawal_hash),
        input.prover,
      ])({
        chain_id: input.l1_chain_id,
        to: portal,
      }),
    )
  if (hex_to_bigint(proven_timestamp) === 0n) {
    return read_pre_prove_status({
      l1_reader: input.l1_reader,
      l1_chain_id: input.l1_chain_id,
      factory,
      anchor_registry,
      portal,
      withdrawal_l2_block_number:
        input.withdrawal_l2_block_number,
      withdrawal_hash,
    })
  }
  return read_post_prove_status({
    l1_reader: input.l1_reader,
    l1_chain_id: input.l1_chain_id,
    portal,
    anchor_registry,
    proven_game,
    proven_at: hex_to_bigint(proven_timestamp),
    withdrawal_hash,
  })
}

async function read_pre_prove_status(input: {
  l1_reader: Dispatcher
  l1_chain_id: ChainId
  factory: Address
  anchor_registry: Address
  portal: Address
  withdrawal_l2_block_number: Uint256
  withdrawal_hash: Hash32
}): Promise<OpBridgeStatus> {
  const [expected_game_type_hex, game_count_hex] =
    await Promise.all([
      dispatch_call(
        input.l1_reader,
        respectedGameType()({
          chain_id: input.l1_chain_id,
          to: input.portal,
        }),
      ),
      dispatch_call(
        input.l1_reader,
        gameCount()({
          chain_id: input.l1_chain_id,
          to: input.factory,
        }),
      ),
    ])
  const expected_game_type = hex_to_bigint(
    expected_game_type_hex,
  )
  const total_games = hex_to_bigint(game_count_hex)
  const min_l2_block = hex_to_bigint(
    input.withdrawal_l2_block_number,
  )
  const candidate = await find_candidate_game({
    reader: input.l1_reader,
    chain_id: input.l1_chain_id,
    factory: input.factory,
    anchor_registry: input.anchor_registry,
    expected_game_type,
    total_games,
    min_l2_block,
  })
  if (candidate.kind === "ready") {
    return parse(OpBridgeStatusSchema, {
      state: "ready_to_prove",
      withdrawal_hash: input.withdrawal_hash,
    })
  }
  if (candidate.kind === "in_progress") {
    return parse(OpBridgeStatusSchema, {
      state: "game_in_progress",
      withdrawal_hash: input.withdrawal_hash,
      game_proxy: candidate.proxy,
    })
  }
  return parse(OpBridgeStatusSchema, {
    state: "awaiting_game_proposal",
    withdrawal_hash: input.withdrawal_hash,
  })
}

async function read_post_prove_status(input: {
  l1_reader: Dispatcher
  l1_chain_id: ChainId
  portal: Address
  anchor_registry: Address
  proven_game: Address
  proven_at: bigint
  withdrawal_hash: Hash32
}): Promise<OpBridgeStatus> {
  const [
    blacklisted,
    game_status_hex,
    game_resolved_at_hex,
    proof_maturity_hex,
    finality_delay_hex,
    now_seconds,
  ] = await Promise.all([
    dispatch_call(
      input.l1_reader,
      isGameBlacklisted([input.proven_game])({
        chain_id: input.l1_chain_id,
        to: input.anchor_registry,
      }),
    ),
    dispatch_call(
      input.l1_reader,
      fault_game_status()({
        chain_id: input.l1_chain_id,
        to: input.proven_game,
      }),
    ),
    dispatch_call(
      input.l1_reader,
      resolvedAt()({
        chain_id: input.l1_chain_id,
        to: input.proven_game,
      }),
    ),
    dispatch_call(
      input.l1_reader,
      proofMaturityDelaySeconds()({
        chain_id: input.l1_chain_id,
        to: input.portal,
      }),
    ),
    dispatch_call(
      input.l1_reader,
      disputeGameFinalityDelaySeconds()({
        chain_id: input.l1_chain_id,
        to: input.portal,
      }),
    ),
    read_latest_l1_timestamp({
      reader: input.l1_reader,
      chain_id: input.l1_chain_id,
    }),
  ])
  if (blacklisted) {
    return parse(OpBridgeStatusSchema, {
      state: "game_invalidated",
      withdrawal_hash: input.withdrawal_hash,
    })
  }
  const game_status = hex_to_bigint(game_status_hex)
  if (game_status !== GAME_STATUS_DEFENDER_WINS) {
    return parse(OpBridgeStatusSchema, {
      state: "game_invalidated",
      withdrawal_hash: input.withdrawal_hash,
    })
  }
  const resolved_at = hex_to_bigint(game_resolved_at_hex)
  const proof_maturity = hex_to_bigint(proof_maturity_hex)
  const finality_delay = hex_to_bigint(finality_delay_hex)
  const mature_at_proof = input.proven_at + proof_maturity
  const mature_at_game = resolved_at + finality_delay
  const mature_at =
    mature_at_proof > mature_at_game
      ? mature_at_proof
      : mature_at_game
  if (now_seconds < mature_at) {
    return parse(OpBridgeStatusSchema, {
      state: "proof_pending_maturity",
      withdrawal_hash: input.withdrawal_hash,
      mature_at_seconds: parse(
        Uint256Schema,
        bigint_to_hex(mature_at),
      ),
    })
  }
  return parse(OpBridgeStatusSchema, {
    state: "ready_to_finalize",
    withdrawal_hash: input.withdrawal_hash,
  })
}

type Candidate =
  | { kind: "none" }
  | { kind: "ready"; proxy: Address }
  | { kind: "in_progress"; proxy: Address }

async function find_candidate_game(input: {
  reader: Dispatcher
  chain_id: ChainId
  factory: Address
  anchor_registry: Address
  expected_game_type: bigint
  total_games: bigint
  min_l2_block: bigint
}): Promise<Candidate> {
  const scan_until =
    input.total_games > MAX_GAMES_SCAN
      ? input.total_games - MAX_GAMES_SCAN
      : 0n
  let pending: Candidate = { kind: "none" }
  for (
    let cursor = input.total_games;
    cursor > scan_until;
    cursor -= 1n
  ) {
    const index = parse(
      Uint256Schema,
      bigint_to_hex(cursor - 1n),
    )
    const [game_type_hex, , proxy] = await dispatch_call(
      input.reader,
      gameAtIndex([index])({
        chain_id: input.chain_id,
        to: input.factory,
      }),
    )
    if (
      hex_to_bigint(game_type_hex) !==
      input.expected_game_type
    )
      continue
    const [
      was_respected,
      game_status_hex,
      proxy_l2_block,
      blacklisted,
    ] = await Promise.all([
      dispatch_call(
        input.reader,
        wasRespectedGameTypeWhenCreated()({
          chain_id: input.chain_id,
          to: proxy,
        }),
      ),
      dispatch_call(
        input.reader,
        fault_game_status()({
          chain_id: input.chain_id,
          to: proxy,
        }),
      ),
      dispatch_call(
        input.reader,
        l2BlockNumber()({
          chain_id: input.chain_id,
          to: proxy,
        }),
      ),
      dispatch_call(
        input.reader,
        isGameBlacklisted([proxy])({
          chain_id: input.chain_id,
          to: input.anchor_registry,
        }),
      ),
    ])
    if (!was_respected) continue
    if (blacklisted) continue
    if (hex_to_bigint(proxy_l2_block) < input.min_l2_block)
      continue
    const game_status = hex_to_bigint(game_status_hex)
    if (game_status === GAME_STATUS_DEFENDER_WINS) {
      return { kind: "ready", proxy }
    }
    if (game_status === 0n) {
      pending = { kind: "in_progress", proxy }
    }
  }
  return pending
}

async function read_latest_l1_timestamp(input: {
  reader: Dispatcher
  chain_id: ChainId
}): Promise<bigint> {
  const block = await eth_getBlockByNumber([
    "latest",
    false,
  ])([input.reader, { chain_id: input.chain_id }])
  if (block === null) {
    throw new Error(
      "get_status: L1 `latest` block returned null",
    )
  }
  return hex_to_bigint(block.timestamp)
}

async function dispatch_call<T>(
  dispatcher: Dispatcher,
  callable: Callable<T>,
): Promise<T> {
  const call = parse(CallSchema, [
    "eth_call",
    [{ to: callable.to, input: callable.data }, "latest"],
  ])
  const response = await dispatcher(call)
  if ("error" in response) {
    throw new Error(response.error.message)
  }
  return callable.decode(
    parse(BytesSchema, response.result),
  )
}
