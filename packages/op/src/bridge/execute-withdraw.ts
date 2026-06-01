// L2→L1 withdrawal finalization through the OP-stack
// OptimismPortal.
//
// Composes:
//   - the thin
//     `finalizeWithdrawalTransaction(WithdrawalTransaction)`
//     Signable binding from `optimism-portal/methods`, which
//     encodes calldata + signs via `eth_signTransaction`
//   - OptimismPortalProxy address lookup by destination
//     L1 chain id (destination = L1 for L2→L1)
//   - destination-side (L1) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value = 0 — the proof was already
// recorded by `prove_withdraw`; this call replays the message
// on L1 and releases the locked ETH / executes the calldata.
//
// Typed error decoding for the portal's known reverts
// (ProofNotMature, GameUnresolved, GameInvalidated) lands in
// `errors.ts` later in slice 2; this verb surfaces raw RPC
// errors until then.
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
import { WithdrawalTransactionSchema } from "./op-message-proof"
import { finalizeWithdrawalTransaction } from "./optimism-portal"

const ParametersSchema = object({
  message: WithdrawalTransactionSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function execute_withdraw(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    destination,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!destination.signer) {
      throw new Error(
        "execute_withdraw requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const portal_address = require_deploy_addresses(
      destination.chain_id,
    ).contracts.OptimismPortalProxy
    const signed_transaction =
      await finalizeWithdrawalTransaction([
        parameters.message,
      ])([
        destination.signer,
        {
          chain_id: destination.chain_id,
          to: portal_address,
        },
      ])
    return eth_sendRawTransaction([signed_transaction])([
      destination.reader,
      { chain_id: destination.chain_id },
    ])
  }
}
