// L2→L1 withdrawal proof bundle — schema + builder.
//
// `MessageProofSchema` shapes the bundle a dapp hands to
// `execute_withdraw`; `fetch_message_proof` is the read-only
// verb that builds one from chain state. Both live here because
// the bundle and its construction are the same concern.
//
// Canonical sources:
//   - Solidity: `L1Nullifier.finalizeDeposit(FinalizeL1DepositParams)`
//     (the post-v26 entrypoint that L2→L1 unlocks flow through —
//     "Deposit" by name because the asset-router treats every
//     L2→L1 unlock as the L1-side completion of a prior deposit/
//     withdrawal pair):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol
//   - L2→L1 log proof RPC (`zks_getL2ToL1LogProof`):
//     https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl2tol1logproof
//   - L2→L1 log shape (carries `txNumberInBatch` per log):
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/common/Messaging.sol
//
// Bundle shape (mirror of `FinalizeL1DepositParams` minus the
// `l2Sender` field, which `execute_withdraw` accepts as a
// separate parameter — the L2 sender depends on which initiation
// verb produced the burn and is not encoded in the proof tree):
//
//   - `chainIdNumeric` — L2 chain id as uint256; matches the
//     `chainId` field of the L1Nullifier struct.
//   - `l2BatchNumber` — L2 batch containing the withdrawal burn;
//     from `zks_getL2ToL1LogProof.batchNumber`.
//   - `l2MessageIndex` — position of the message in the batch's
//     merkle tree of L2→L1 logs; from
//     `zks_getL2ToL1LogProof.id`.
//   - `l2TxNumberInBatch` — position of the originating L2 tx
//     within its batch; the dapp reads it from the L2 receipt's
//     zkSync-extended `l1BatchTxIndex` field and supplies it
//     here. Not derivable from `zks_getL2ToL1LogProof` alone.
//   - `message` — the bytes `L1Messenger.sendToL1` emitted (for
//     `start_withdraw_message`) or the asset-bridge-encoded
//     payload (for `start_withdraw_eth` / `start_withdraw_erc20`).
//     The dapp extracts it from the L2 receipt's L1Messenger
//     event log.
//   - `merkleProof` — the merkle siblings produced by
//     `zks_getL2ToL1LogProof.proof`. Passes straight into
//     `L1Nullifier.finalizeDeposit`'s `merkleProof` field.
//
// `fetch_message_proof` composes:
//   - L2 read: `zks_getL2ToL1LogProof(l2_tx_hash,
//     l2_to_l1_log_index)`. Returns `null` when the originating
//     batch has not yet been committed + verified — the verb
//     throws in that case; `get_status` reports `batch_pending`
//     for the same condition so the dapp can poll until
//     `ready_to_finalize`.
//
// Path-2 composition (per M3): pure RPC reads; no signer
// touched. The bundle is the dapp's hand-off to
// `execute_withdraw`, which then asks the wallet to sign the L1
// Nullifier call.
//
// Naming distinction from slice 4b's `FailedDepositProof`. Both
// bundles compose `zks_getL2ToL1LogProof`, but the failed-
// deposit case extends with `(depositSender, l1Token, amount)`
// for the Nullifier's `claimFailedDeposit` shape. Keeping the
// schemas shape-distinct (separate files, separate schemas)
// lets dapps `parse` against the right shape at the dispatch
// boundary instead of conflating two protocols.
//
// Slice 4c of phase 05 — see tmp/plans/05_bridge_package/.

import {
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  Uint16Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import { decode_chain_id } from "@ethernauta/transport"
import { bigint_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { array, number, object, parse } from "valibot"

import { zks_getL2ToL1LogProof } from "../methods/zks-get-l2-to-l1-log-proof"

export const MessageProofSchema = object({
  chainIdNumeric: Uint256Schema,
  l2BatchNumber: Uint256Schema,
  l2MessageIndex: Uint256Schema,
  l2TxNumberInBatch: Uint16Schema,
  message: BytesSchema,
  merkleProof: array(Bytes32Schema),
})
export type MessageProof = InferOutput<
  typeof MessageProofSchema
>

const ParametersSchema = object({
  l2_tx_hash: Hash32Schema,
  l2_to_l1_log_index: number(),
  l2_tx_number_in_batch: Uint16Schema,
  message: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function fetch_message_proof(
  _parameters: Parameters,
): Bridgeable<MessageProof> {
  return async ({
    l2,
  }: ResolvedBridge): Promise<MessageProof> => {
    const parameters = parse(ParametersSchema, _parameters)
    const log_proof = await zks_getL2ToL1LogProof([
      parameters.l2_tx_hash,
      parameters.l2_to_l1_log_index,
    ])([l2.reader, { chain_id: l2.chain_id }])
    if (log_proof === null) {
      throw new Error(
        "fetch_message_proof: no proof available — withdrawal not yet in a committed batch",
      )
    }
    const chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(decode_chain_id(l2.chain_id).reference),
      ),
    )
    return parse(MessageProofSchema, {
      chainIdNumeric: chain_id_numeric,
      l2BatchNumber: parse(
        Uint256Schema,
        log_proof.batchNumber,
      ),
      l2MessageIndex: parse(Uint256Schema, log_proof.id),
      l2TxNumberInBatch: parameters.l2_tx_number_in_batch,
      message: parameters.message,
      merkleProof: log_proof.proof.map((node) =>
        parse(Bytes32Schema, node),
      ),
    })
  }
}
