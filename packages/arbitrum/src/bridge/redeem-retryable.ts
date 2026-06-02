// Manually redeem a retryable ticket on L2 after its
// auto-redeem failed (or was never attempted because
// `gasLimit * maxFeePerGas` was sized too low at ticket
// creation). Lives within the ticket's lifetime —
// `RetryableExpired` once `ArbRetryableTx.getTimeout` passes.
//
// Canonical sources:
//   - Solidity: `ArbRetryableTx.redeem(bytes32 ticketId)`
//     (selector `0x1b3ce63f`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/precompiles/ArbRetryableTx.sol
//   - Docs (retryable lifecycle + redeem semantics):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//
// Composes:
//   - the thin `redeem(bytes32)` Signable from
//     `precompiles/arb-retryable-tx/methods`, which encodes
//     calldata + signs via `eth_signTransaction`
//   - the `ArbRetryableTx` precompile address constant
//     (`0x000000000000000000000000000000000000006E`) — no
//     registry lookup since it's an L2 predeploy
//   - L2-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
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
  redeem,
} from "../precompiles/arb-retryable-tx"

const ParametersSchema = object({
  ticket_id: Bytes32Schema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function redeem_retryable(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "redeem_retryable requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const signed_transaction = await redeem([
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
