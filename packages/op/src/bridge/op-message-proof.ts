// The bundle a dapp needs to redeem a withdrawal on L1.
//
// `withdrawalTransaction` is the `MessagePassed`-shaped struct
// the L2ToL1MessagePasser emitted at withdraw-initiation time;
// it is replayed verbatim on L1 by `prove_withdraw` and
// `execute_withdraw`.
//
// `disputeGameIndex` points at the `DisputeGameFactory` entry
// whose `rootClaim` covers `withdrawalTransaction`'s L2 block.
// Under OP fault proofs (op-contracts/v3.0.0 on Sepolia,
// v6.0.0 on Mainnet), the portal validates the proof against
// the game referenced by this index — there is no
// `L2OutputOracle` anymore.
//
// `outputRootProof` is the four-field struct that lets L1
// re-derive the output root from `(stateRoot,
// messagePasserStorageRoot, latestBlockhash)` at version
// `0x000…0`.
//
// `withdrawalProof` is the RLP-encoded MPT branch from
// `eth_getProof` proving the withdrawal hash is recorded in
// `L2ToL1MessagePasser.sentMessages`.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { array, object } from "valibot"

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

export const OpMessageProofSchema = object({
  withdrawalTransaction: WithdrawalTransactionSchema,
  disputeGameIndex: Uint256Schema,
  outputRootProof: OutputRootProofSchema,
  withdrawalProof: array(BytesSchema),
})
export type OpMessageProof = InferOutput<
  typeof OpMessageProofSchema
>
