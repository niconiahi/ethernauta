// Failed-deposit proof bundle consumed by
// `L1Nullifier.claimFailedDeposit` (slice 4b's
// `claim_failed_deposit` verb).
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
// Naming distinction from slice 4c's `MessageProof`. Both
// bundles compose `zks_getL2ToL1LogProof`, but the failed-
// deposit case also carries the `(depositSender, l1Token,
// amount)` trio the L1Nullifier needs to credit the L1 refund.
// Keeping the schemas shape-distinct (separate files, separate
// schemas) lets dapps `parse` against the right shape at the
// dispatch boundary instead of conflating two protocols.
//
// No builder in this file. The proof is constructed off-band
// by the dapp from `zks_getL2ToL1LogProof` (4b's playground
// demo demonstrates the dance against the raw RPC binding at
// `packages/zksync/src/methods/zks-get-l2-to-l1-log-proof.ts`).
// A `fetch_failed_deposit_proof` helper can land in a follow-up
// — tracked in `03-tracking.md`.
//
// Slice 4b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  Bytes32Schema,
  Uint16Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

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
