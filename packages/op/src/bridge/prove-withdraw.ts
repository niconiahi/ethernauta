// L2→L1 withdrawal proof submission through the OP-stack
// OptimismPortal.
//
// Composes:
//   - the thin
//     `proveWithdrawalTransaction(WithdrawalTransaction,uint256,
//     OutputRootProof,bytes[])` Signable binding from
//     `optimism-portal/methods`, which encodes calldata +
//     signs via `eth_signTransaction`
//   - OptimismPortalProxy address lookup by destination
//     L1 chain id (destination = L1 for L2→L1)
//   - destination-side (L1) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value = 0 — no L1 ETH movement at
// prove time; the proof maturity + game finality delays start
// here, and `execute_withdraw` releases the funds later.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import type { Hash32 } from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { MessageProofSchema } from "./message-proof"
import { proveWithdrawalTransaction } from "./optimism-portal"

const ParametersSchema = object({
  proof: MessageProofSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function prove_withdraw(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "prove_withdraw requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const portal_address = require_deploy_addresses(
      l2.chain_id,
    ).contracts.OptimismPortalProxy
    const signed_transaction =
      await proveWithdrawalTransaction([
        parameters.proof.withdrawalTransaction,
        parameters.proof.disputeGameIndex,
        parameters.proof.outputRootProof,
        parameters.proof.withdrawalProof,
      ])([
        signer,
        {
          chain_id: l1.chain_id,
          to: portal_address,
        },
      ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
