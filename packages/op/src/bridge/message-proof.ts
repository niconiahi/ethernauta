// L2→L1 withdrawal proof bundle — schema + builder.
//
// `MessageProofSchema` shapes the bundle a dapp needs to redeem a
// withdrawal on L1; `fetch_message_proof` is the read-only verb
// that builds one from chain state. Both live here because the
// bundle and its construction are the same concern.
//
// Bundle shape:
//   - `withdrawalTransaction` — the `MessagePassed`-shaped struct
//     the L2ToL1MessagePasser emitted at withdraw-initiation time;
//     replayed verbatim on L1 by `prove_withdraw` and
//     `execute_withdraw`.
//   - `disputeGameIndex` — points at the `DisputeGameFactory`
//     entry whose `rootClaim` covers `withdrawalTransaction`'s L2
//     block. Under OP fault proofs (op-contracts/v3.0.0 on
//     Sepolia, v6.0.0 on Mainnet), the portal validates the proof
//     against the game referenced by this index — there is no
//     `L2OutputOracle` anymore.
//   - `outputRootProof` — the four-field struct that lets L1
//     re-derive the output root from `(stateRoot,
//     messagePasserStorageRoot, latestBlockhash)` at version
//     `0x000…0`.
//   - `withdrawalProof` — the RLP-encoded MPT branch from
//     `eth_getProof` proving the withdrawal hash is recorded in
//     `L2ToL1MessagePasser.sentMessages`.
//
// `fetch_message_proof` composes:
//   - L1 read pass to pick a usable dispute game:
//     `OptimismPortal.respectedGameType()` →
//     `DisputeGameFactory.gameCount()` →
//     `gameAtIndex(i)` scan (newest first) for the latest
//     game whose `gameType` matches the portal's currently
//     respected type, whose
//     `wasRespectedGameTypeWhenCreated()` is true, whose
//     `status()` is `DEFENDER_WINS` (2), whose
//     `l2BlockNumber()` ≥ the withdrawal's L2 block, and
//     that is not blacklisted by
//     `AnchorStateRegistry.isGameBlacklisted(proxy)`.
//   - L2 reads at the picked game's L2 block number:
//     `eth_getBlockByNumber` for state root + block hash,
//     `eth_getProof` against `L2ToL1MessagePasser` for the
//     `sentMessages[withdrawal_hash]` storage slot.
//
// Path-2 composition (per M3): pure JS + RPC reads; no signer
// touched. The bundle is the dapp's hand-off to `prove_withdraw`,
// which then asks the wallet to sign the L1 prove call.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  type Address,
  AddressSchema,
  Bytes32Schema,
  BytesMax32Schema,
  BytesSchema,
  type Uint,
  type Uint256,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  eth_getBlockByNumber,
  eth_getProof,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  Callable,
  ChainId,
  Reader,
  ResolvedBridge,
} from "@ethernauta/transport"
import { CallSchema } from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { array, object, parse } from "valibot"

import { require_deploy_addresses } from "../lib/deploy"
import { isGameBlacklisted } from "./anchor-state-registry/methods/is-game-blacklisted"
import { gameAtIndex } from "./dispute-game-factory/methods/game-at-index"
import { gameCount } from "./dispute-game-factory/methods/game-count"
import {
  compute_sent_messages_storage_slot,
  compute_withdrawal_hash,
  OUTPUT_ROOT_VERSION_V0,
} from "./encode-withdrawal-proof"
import { l2BlockNumber } from "./fault-dispute-game/methods/l2-block-number"
import { status as fault_game_status } from "./fault-dispute-game/methods/status"
import { wasRespectedGameTypeWhenCreated } from "./fault-dispute-game/methods/was-respected-game-type-when-created"
import { L2_TO_L1_MESSAGE_PASSER_ADDRESS } from "./l2-to-l1-message-passer"
import { respectedGameType } from "./optimism-portal/methods/respected-game-type"

export const WithdrawalTransactionSchema = object({
  nonce: Uint256Schema,
  sender: AddressSchema,
  target: AddressSchema,
  value: Uint256Schema,
  gasLimit: Uint256Schema,
  data: BytesSchema,
})
export type WithdrawalTransaction = InferOutput<
  typeof WithdrawalTransactionSchema
>

export const OutputRootProofSchema = object({
  version: Bytes32Schema,
  stateRoot: Bytes32Schema,
  messagePasserStorageRoot: Bytes32Schema,
  latestBlockhash: Bytes32Schema,
})
export type OutputRootProof = InferOutput<
  typeof OutputRootProofSchema
>

export const MessageProofSchema = object({
  withdrawalTransaction: WithdrawalTransactionSchema,
  disputeGameIndex: Uint256Schema,
  outputRootProof: OutputRootProofSchema,
  withdrawalProof: array(BytesSchema),
})
export type MessageProof = InferOutput<
  typeof MessageProofSchema
>

const ParametersSchema = object({
  withdrawal_transaction: WithdrawalTransactionSchema,
  withdrawal_l2_block_number: Uint256Schema,
})
type Parameters = InferOutput<typeof ParametersSchema>

// DEFENDER_WINS in op-contracts' `GameStatus` enum.
const GAME_STATUS_DEFENDER_WINS = 2

// Bound on how many games to walk back during the L1
// scan. Op-stack chains create roughly one game per hour,
// so 256 covers ~10 days — well past the maturity window.
const MAX_GAMES_SCAN = 256n

export function fetch_message_proof(
  _parameters: Parameters,
): Bridgeable<MessageProof> {
  return async ({
    l1,
    l2,
  }: ResolvedBridge): Promise<MessageProof> => {
    const parameters = parse(ParametersSchema, _parameters)
    const withdrawal_hash = compute_withdrawal_hash(
      parameters.withdrawal_transaction,
    )
    const storage_slot =
      compute_sent_messages_storage_slot(withdrawal_hash)
    const deploys = require_deploy_addresses(
      l2.chain_id,
    ).contracts
    const expected_game_type = await dispatch_call(
      l1.reader,
      respectedGameType()({
        chain_id: l1.chain_id,
        to: deploys.OptimismPortalProxy,
      }),
    )
    const game_count_value = await dispatch_call(
      l1.reader,
      gameCount()({
        chain_id: l1.chain_id,
        to: deploys.DisputeGameFactoryProxy,
      }),
    )
    const picked = await pick_dispute_game({
      reader: l1.reader,
      chain_id: l1.chain_id,
      factory: deploys.DisputeGameFactoryProxy,
      anchor_registry: deploys.AnchorStateRegistryProxy,
      expected_game_type: hex_to_bigint(expected_game_type),
      total_games: hex_to_bigint(game_count_value),
      min_l2_block: hex_to_bigint(
        parameters.withdrawal_l2_block_number,
      ),
    })
    const block_number_uint = uint256_to_uint(
      picked.l2_block_number,
    )
    const block = await eth_getBlockByNumber([
      block_number_uint,
      false,
    ])([l2.reader, { chain_id: l2.chain_id }])
    if (block === null) {
      throw new Error(
        `fetch_message_proof: L2 block ${block_number_uint} not found on l2 reader`,
      )
    }
    const account_proof = await eth_getProof([
      L2_TO_L1_MESSAGE_PASSER_ADDRESS,
      [parse(BytesMax32Schema, storage_slot)],
      block_number_uint,
    ])([l2.reader, { chain_id: l2.chain_id }])
    const slot_proof = account_proof.storageProof[0]
    if (!slot_proof) {
      throw new Error(
        "fetch_message_proof: eth_getProof returned no storage proof for the withdrawal slot",
      )
    }
    return parse(MessageProofSchema, {
      withdrawalTransaction:
        parameters.withdrawal_transaction,
      disputeGameIndex: picked.index,
      outputRootProof: {
        version: OUTPUT_ROOT_VERSION_V0,
        stateRoot: parse(Bytes32Schema, block.stateRoot),
        messagePasserStorageRoot: parse(
          Bytes32Schema,
          account_proof.storageHash,
        ),
        latestBlockhash: parse(Bytes32Schema, block.hash),
      },
      withdrawalProof: slot_proof.proof,
    })
  }
}

async function pick_dispute_game(input: {
  reader: Reader
  chain_id: ChainId
  factory: Address
  anchor_registry: Address
  expected_game_type: bigint
  total_games: bigint
  min_l2_block: bigint
}): Promise<{ index: Uint256; l2_block_number: Uint256 }> {
  const scan_until =
    input.total_games > MAX_GAMES_SCAN
      ? input.total_games - MAX_GAMES_SCAN
      : 0n
  for (
    let cursor = input.total_games;
    cursor > scan_until;
    cursor -= 1n
  ) {
    const index = parse(
      Uint256Schema,
      bigint_to_hex(cursor - 1n),
    )
    const [game_type, , proxy] = await dispatch_call(
      input.reader,
      gameAtIndex([index])({
        chain_id: input.chain_id,
        to: input.factory,
      }),
    )
    if (
      hex_to_bigint(game_type) !== input.expected_game_type
    )
      continue
    const [
      was_respected,
      game_status,
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
    if (
      hex_to_bigint(game_status) !==
      BigInt(GAME_STATUS_DEFENDER_WINS)
    )
      continue
    if (blacklisted) continue
    if (hex_to_bigint(proxy_l2_block) < input.min_l2_block)
      continue
    return { index, l2_block_number: proxy_l2_block }
  }
  throw new Error(
    "fetch_message_proof: no resolved dispute game covers the withdrawal's L2 block",
  )
}

async function dispatch_call<T>(
  dispatcher: Reader,
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

function uint256_to_uint(value: Uint256): Uint {
  return parse(
    UintSchema,
    bigint_to_hex(hex_to_bigint(value)),
  )
}
