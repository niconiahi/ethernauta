// Failed-deposit proof bundle consumed by
// `L1Nullifier.claimFailedDeposit` (the `claim_failed_deposit`
// verb).
//
// Canonical sources:
//   - Solidity: `L1Nullifier.claimFailedDeposit(uint256
//     _chainId, address _depositSender, address _l1Token,
//     uint256 _amount, bytes32 _l2TxHash, uint256
//     _l2BatchNumber, uint256 _l2MessageIndex, uint16
//     _l2TxNumberInBatch, bytes32[] _merkleProof)`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol
//   - L2→L1 log proof RPC (`zks_getL2ToL1LogProof`):
//     https://docs.zksync.io/zksync-protocol/api/zks-rpc#zks-getl2tol1logproof
//
// Naming distinction from `MessageProof`. Both bundles compose
// `zks_getL2ToL1LogProof`, but the failed-deposit case also
// carries the `(depositSender, l1Token, amount)` trio the
// L1Nullifier needs to credit the L1 refund. Keeping the
// schemas shape-distinct (separate files, separate schemas)
// lets dapps `parse` against the right shape at the dispatch
// boundary instead of conflating two protocols.
//
// `fetch_failed_deposit_proof` is the read-only builder that
// assembles a `FailedDepositProof` from chain state. Option A:
// the dapp supplies the deposit facts as explicit parameters,
// mirroring `fetch_message_proof`. The canonical L2 tx's
// `data` field carries an NTV `assetId` hash (not the
// `l1Token` address) and the L2 sender is aliased, so the
// deposit-fact triple cannot be recovered from the canonical
// tx alone — the dapp persists or re-reads them from its own
// state (or composes the slice 1 / 2 decoders manually if it
// wants to). A future "auto-extract" follow-up that scans the
// L1AssetRouter's `BridgehubDepositInitiated` /
// `LegacyDepositInitiated` events is tracked separately.

import {
  AddressSchema,
  Bytes32Schema,
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

export const FailedDepositProofSchema = object({
  chainIdNumeric: Uint256Schema,
  depositSender: AddressSchema,
  l1Token: AddressSchema,
  amount: Uint256Schema,
  l2TxHash: Bytes32Schema,
  l2BatchNumber: Uint256Schema,
  l2MessageIndex: Uint256Schema,
  l2TxNumberInBatch: Uint16Schema,
  merkleProof: array(Bytes32Schema),
})
export type FailedDepositProof = InferOutput<
  typeof FailedDepositProofSchema
>

const ParametersSchema = object({
  deposit_sender: AddressSchema,
  l1_token: AddressSchema,
  amount: Uint256Schema,
  l2_tx_hash: Hash32Schema,
  l2_tx_number_in_batch: Uint16Schema,
  l2_to_l1_log_index: number(),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function fetch_failed_deposit_proof(
  _parameters: Parameters,
): Bridgeable<FailedDepositProof> {
  return async ({
    l2,
  }: ResolvedBridge): Promise<FailedDepositProof> => {
    const parameters = parse(ParametersSchema, _parameters)
    const log_proof = await zks_getL2ToL1LogProof([
      parameters.l2_tx_hash,
      parameters.l2_to_l1_log_index,
    ])([l2.reader, { chain_id: l2.chain_id }])
    if (log_proof === null) {
      throw new Error(
        "fetch_failed_deposit_proof: no proof available — failure not yet in a committed batch",
      )
    }
    const chain_id_numeric = parse(
      Uint256Schema,
      bigint_to_hex(
        BigInt(decode_chain_id(l2.chain_id).reference),
      ),
    )
    return parse(FailedDepositProofSchema, {
      chainIdNumeric: chain_id_numeric,
      depositSender: parameters.deposit_sender,
      l1Token: parameters.l1_token,
      amount: parameters.amount,
      l2TxHash: parameters.l2_tx_hash,
      l2BatchNumber: parse(
        Uint256Schema,
        log_proof.batchNumber,
      ),
      l2MessageIndex: parse(Uint256Schema, log_proof.id),
      l2TxNumberInBatch: parameters.l2_tx_number_in_batch,
      merkleProof: log_proof.proof.map((node) =>
        parse(Bytes32Schema, node),
      ),
    })
  }
}
