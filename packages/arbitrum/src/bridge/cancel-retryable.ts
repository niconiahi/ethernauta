// Cancel an unredeemed retryable ticket on L2 within its
// lifetime. The L1 callValueRefundAddress receives the ticket's
// callvalue back; the submission fee is forfeited (it paid for
// L1 inclusion regardless). After cancel, subsequent
// `redeem` / `getTimeout` reads revert because the ticket no
// longer exists in retryable storage.
//
// Canonical sources:
//   - Solidity: `ArbRetryableTx.cancel(bytes32 ticketId)`
//     (selector `0xc4d252f5`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbRetryableTx.sol
//   - Docs (retryable lifecycle):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//
// Composes:
//   - the thin `cancel(bytes32)` Signable from
//     `precompiles/arb-retryable-tx/methods`, which encodes
//     calldata + signs via `eth_signTransaction`
//   - the `ArbRetryableTx` precompile address constant — L2
//     predeploy, no registry lookup
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Authorization. Only the ticket's
// `callValueRefundAddress` may cancel; the precompile
// reverts `NotCallvalueRefundAddress` otherwise. The L1
// caller of `createRetryableTicket` set this address at
// creation time — typically their own L1-aliased L2 address.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally
// not used.
//
// Slice 3b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  Bytes32Schema,
  type Hash32,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import {
  ARB_RETRYABLE_TX_ADDRESS,
  cancel,
} from "../precompiles/arb-retryable-tx"

const ParametersSchema = object({
  ticket_id: Bytes32Schema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function cancel_retryable(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "cancel_retryable requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const signed_transaction = await cancel([
      parameters.ticket_id,
    ])([
      signer,
      {
        chain_id: l2.chain_id,
        to: ARB_RETRYABLE_TX_ADDRESS,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l2.reader,
      { chain_id: l2.chain_id },
    ])
  }
}
