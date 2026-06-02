// L1→L2 ETH deposit through the Arbitrum Inbox.
//
// Canonical sources:
//   - Solidity: `Inbox.depositEth()` (selector `0x439370b1`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/bridge/Inbox.sol
//   - Docs (L1→L2 messaging + retryable lifecycle):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//
// Composes:
//   - the thin `depositEth()` Signable from
//     `inbox/methods`, which encodes calldata + signs via
//     `eth_signTransaction`
//   - `Inbox` proxy address lookup by destination L2 chain id
//     via `require_deploy_addresses(l2.chain_id).contracts.inbox`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Param-shape decision (slice 3a). `Inbox.depositEth()` is
// payable and takes no recipient — it always credits
// `aliasL1Address(msg.sender)` on L2. There is no `depositEthTo`
// variant. To credit an arbitrary L2 recipient the caller has
// to use `Inbox.createRetryableTicket` with an empty data
// field. `send_eth({ amount })` deliberately ships the simpler
// shape and forwards the arbitrary-recipient case to
// `send_message` (slice 3b), which composes
// `createRetryableTicket` and surfaces the additional
// retryable parameters (`maxSubmissionCost`, `gasLimit`,
// `maxFeePerGas`, `excessFeeRefundAddress`,
// `callValueRefundAddress`) the dapp must size for that path.
// See `tmp/plans/05_bridge_package/03-tracking.md` for the
// rationale + the locked verb-name spec the choice trades
// against.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally
// not used.
//
// Slice 3a of phase 05 — see tmp/plans/05_bridge_package/.

import { type Hash32, UintSchema } from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { depositEth_439370b1 } from "./inbox"

const ParametersSchema = object({
  amount: UintSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_eth(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_eth requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (!deploys.contracts) {
      throw new Error(
        `send_eth: chain ${l2.chain_id} is missing the bridge address registry — populate ArbitrumDeploys.contracts in packages/arbitrum/src/deploys/`,
      )
    }
    const inbox_address = deploys.contracts.inbox
    const signed_transaction = await depositEth_439370b1()([
      signer,
      {
        chain_id: l1.chain_id,
        to: inbox_address,
        value: parameters.amount,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
