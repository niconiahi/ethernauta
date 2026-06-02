// L1→L2 ERC-20 deposit through the Arbitrum L1GatewayRouter.
//
// Canonical sources:
//   - Solidity: `L1GatewayRouter.outboundTransfer(
//       address _token, address _to, uint256 _amount,
//       uint256 _maxGas, uint256 _gasPriceBid, bytes _data
//     )` (selector `0xd2ce7d65`):
//     https://github.com/OffchainLabs/token-bridge-contracts/blob/v1.2.5/contracts/tokenbridge/ethereum/gateway/L1GatewayRouter.sol
//   - Standard-gateway data convention (`data = abi.encode(
//       uint256 maxSubmissionCost, bytes extraData
//     )`):
//     https://docs.arbitrum.io/build-decentralized-apps/token-bridging/standard-bridge-erc20
//   - Retryable submission + L2 gas cost (msg.value rule):
//     https://docs.arbitrum.io/how-arbitrum-works/arbos/l1-to-l2-messaging
//
// Composes:
//   - a pre-call read of `L1GatewayRouter.getGateway(token)`
//     against `l1.reader` — surfaces the canonical or custom
//     gateway address for `l1_token`, and throws if the
//     router has no gateway registered (the deposit would
//     otherwise revert downstream with no actionable info)
//   - ABI-encodes `data = (maxSubmissionCost, extraData ?? 0x)`
//     via `encode_sequence`, matching what the standard
//     gateway expects
//   - the thin `outboundTransfer(...)` Signable binding from
//     `l1-gateway-router/methods`, which encodes calldata +
//     signs via `eth_signTransaction`
//   - `L1GatewayRouter` proxy address lookup by destination
//     L2 chain id via
//     `require_deploy_addresses(l2.chain_id).contracts.l1GatewayRouter`
//   - L1-side dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// msg.value convention. `outboundTransfer` is payable —
// `msg.value` must cover the retryable's submission fee + L2
// execution: `value = max_submission_cost + max_gas *
// gas_price_bid`. The verb computes this from the caller's
// retryable params; the ERC-20 amount leaves the user's
// wallet through `transferFrom` inside the gateway, so the
// user must have approved the gateway (not the router) for
// `amount` of `l1_token` before calling — the router
// internally forwards to the gateway returned by
// `getGateway(token)`.
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. `eth_sendTransaction` is intentionally
// not used.
//
// Slice 3b of phase 05 — see tmp/plans/05_bridge_package/.

import {
  bytes as bytes_codec,
  encode_sequence,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  eth_call,
  eth_sendRawTransaction,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import {
  bigint_to_hex,
  bytes_to_hex,
  hex_to_bigint,
} from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import {
  getGateway,
  outboundTransfer,
} from "./l1-gateway-router"

const EMPTY_BYTES = parse(BytesSchema, "0x")
const ZERO_ADDRESS = parse(
  AddressSchema,
  "0x0000000000000000000000000000000000000000",
)

const ParametersSchema = object({
  l1_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  max_gas: Uint256Schema,
  gas_price_bid: Uint256Schema,
  max_submission_cost: Uint256Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    signer,
    l1,
    l2,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!signer) {
      throw new Error(
        "send_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const deploys = require_deploy_addresses(l2.chain_id)
    if (!deploys.contracts) {
      throw new Error(
        `send_erc20: chain ${l2.chain_id} is missing the bridge address registry — populate ArbitrumDeploys.contracts in packages/arbitrum/src/deploys/`,
      )
    }
    const router_address = deploys.contracts.l1GatewayRouter
    const get_gateway_call = getGateway([
      parameters.l1_token,
    ])({
      chain_id: l1.chain_id,
      to: router_address,
    })
    const gateway_bytes = await eth_call([
      {
        to: get_gateway_call.to,
        input: get_gateway_call.data,
      },
    ])([l1.reader, { chain_id: l1.chain_id }])
    const gateway_address =
      get_gateway_call.decode(gateway_bytes)
    if (gateway_address === ZERO_ADDRESS) {
      throw new Error(
        `send_erc20: token ${parameters.l1_token} has no gateway registered on L1GatewayRouter ${router_address}`,
      )
    }
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const data = parse(
      BytesSchema,
      bytes_to_hex(
        encode_sequence(
          [uint256_codec(), bytes_codec()],
          [parameters.max_submission_cost, extra_data],
        ),
      ),
    )
    const value = parse(
      UintSchema,
      bigint_to_hex(
        hex_to_bigint(parameters.max_submission_cost) +
          hex_to_bigint(parameters.max_gas) *
            hex_to_bigint(parameters.gas_price_bid),
      ),
    )
    const signed_transaction = await outboundTransfer([
      parameters.l1_token,
      parameters.to,
      parameters.amount,
      parameters.max_gas,
      parameters.gas_price_bid,
      data,
    ])([
      signer,
      {
        chain_id: l1.chain_id,
        to: router_address,
        value,
      },
    ])
    return eth_sendRawTransaction([signed_transaction])([
      l1.reader,
      { chain_id: l1.chain_id },
    ])
  }
}
