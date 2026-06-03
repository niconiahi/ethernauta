// L1-side recovery of a failed L1→L2 deposit through the zkSync
// L1Nullifier.
//
// Canonical sources:
//   - Solidity: `L1Nullifier.claimFailedDeposit(uint256
//     _chainId, address _depositSender, address _l1Token,
//     uint256 _amount, bytes32 _l2TxHash, uint256
//     _l2BatchNumber, uint256 _l2MessageIndex, uint16
//     _l2TxNumberInBatch, bytes32[] _merkleProof)`:
//     https://github.com/matter-labs/era-contracts/blob/v0.29.2/l1-contracts/contracts/bridge/L1Nullifier.sol
//   - Failed-deposit lifecycle (when a priority L1→L2 tx
//     reverts on L2, the L1Nullifier replays the proof of
//     failure and credits the depositor):
//     https://docs.zksync.io/zksync-protocol/contracts/handling-l1-l2-ops
//
// Composes:
//   - the thin `claimFailedDeposit(...)` Signable from
//     `l1-nullifier/methods`, which ABI-encodes the 9 params +
//     signs via `eth_signTransaction`
//   - `L1Nullifier` proxy address lookup by destination L2 chain
//     id via `require_deploy_addresses(l2.chain_id).l1.l1Nullifier`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 4b). `{ proof: FailedDepositProof }`.
// The 9-field proof is constructed off-band by the dapp from
// `zks_getL2ToL1LogProof` (see `failed-deposit-proof.ts` +
// `packages/zksync/src/methods/zks-get-l2-to-l1-log-proof.ts`).
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally not
// used.
//
// Slice 4b of phase 05 — see tmp/plans/05_bridge_package/.

import { type Hash32, UintSchema } from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { FailedDepositProofSchema } from "./failed-deposit-proof"
import { claimFailedDeposit } from "./l1-nullifier"

const ParametersSchema = object({
  proof: FailedDepositProofSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function claim_failed_deposit(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "claim_failed_deposit requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    const nullifier = deploys.l1.l1Nullifier
    const proof = parameters.proof
    const signed_transaction = await claimFailedDeposit([
      proof.chainIdNumeric,
      proof.depositSender,
      proof.l1Token,
      proof.amount,
      proof.l2TxHash,
      proof.l2BatchNumber,
      proof.l2MessageIndex,
      proof.l2TxNumberInBatch,
      proof.merkleProof,
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: nullifier,
        value: parse(UintSchema, "0x0"),
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
