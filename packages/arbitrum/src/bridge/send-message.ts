// L1→L2 arbitrary message through the Arbitrum Inbox via
// `createRetryableTicket`. General-purpose deposit primitive
// that credits an arbitrary L2 recipient (Inbox.depositEth
// only ever credits `aliasL1Address(msg.sender)`; this verb
// is the path for everything else).
//
// Canonical sources:
//   - Solidity: `Inbox.createRetryableTicket(
//       address to, uint256 l2CallValue,
//       uint256 maxSubmissionCost,
//       address excessFeeRefundAddress,
//       address callValueRefundAddress,
//       uint256 gasLimit, uint256 maxFeePerGas, bytes data
//     )` (selector `0x679b6ded`):
//     https://github.com/OffchainLabs/nitro-contracts/blob/v3.2.0/src/bridge/Inbox.sol
//   - Retryable lifecycle (auto-redeem on success;
//     manual redeem / cancel on failure within
//     `getLifetime()`):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//
// Composes:
//   - the thin `createRetryableTicket(...)` Signable from
//     `inbox/methods`, which encodes calldata + signs via
//     `eth_signTransaction`
//   - `Inbox` proxy address lookup by destination L2 chain
//     id via
//     `require_deploy_addresses(l2.chain_id).contracts.inbox`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// msg.value convention. `createRetryableTicket` is payable —
// `msg.value` must cover the L2-side call value plus the
// retryable's submission fee and gas budget:
// `value = l2_call_value + max_submission_cost +
// gas_limit * max_fee_per_gas`. The verb computes this from
// the caller's params.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally
// not used.
//
// Slice 3b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_sendRawTransaction } from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { createRetryableTicket } from "./inbox"

const ParametersSchema = object({
  to: AddressSchema,
  l2_call_value: Uint256Schema,
  max_submission_cost: Uint256Schema,
  excess_fee_refund_address: AddressSchema,
  call_value_refund_address: AddressSchema,
  gas_limit: Uint256Schema,
  max_fee_per_gas: Uint256Schema,
  data: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (!deploys.contracts) {
      throw new Error(
        `send_message: chain ${l2.chain_id} is missing the bridge address registry — populate ArbitrumDeploys.contracts in packages/arbitrum/src/deploys/`,
      )
    }
    const inbox_address = deploys.contracts.inbox
    const value = parse(
      UintSchema,
      bigint_to_hex(
        hex_to_bigint(parameters.l2_call_value) +
          hex_to_bigint(parameters.max_submission_cost) +
          hex_to_bigint(parameters.gas_limit) *
            hex_to_bigint(parameters.max_fee_per_gas),
      ),
    )
    const signed_transaction = await createRetryableTicket([
      parameters.to,
      parameters.l2_call_value,
      parameters.max_submission_cost,
      parameters.excess_fee_refund_address,
      parameters.call_value_refund_address,
      parameters.gas_limit,
      parameters.max_fee_per_gas,
      parameters.data,
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: inbox_address,
        value,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
