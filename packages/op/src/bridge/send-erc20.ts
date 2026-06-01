// L1→L2 ERC-20 deposit through the OP-stack L1StandardBridge.
//
// Composes:
//   - `bridgeERC20To(address,address,address,uint256,uint32,bytes)`
//     calldata encoding
//   - L1StandardBridgeProxy address lookup by destination
//     L2 chain id
//   - origin-side (L1) wallet signs via `eth_signTransaction`
//   - origin-side (L1) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value is zero — the token leaves the
// user's wallet through ERC-20 `transferFrom` inside the
// bridge, so the user must have approved the bridge proxy
// for `amount` of `l1_token` before calling.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  uint32 as uint32_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint32Schema,
  Uint256Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { BRIDGE_ERC20_TO_SIGNATURE } from "./l1-standard-bridge"

const PARAM_CODECS = [
  address_codec(),
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint32_codec(),
  bytes_codec(),
] as const

const EMPTY_BYTES = parse(BytesSchema, "0x")
const ZERO_VALUE = parse(UintSchema, "0x0")

const ParametersSchema = object({
  l1_token: AddressSchema,
  l2_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  min_gas_limit: Uint32Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
    destination,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "send_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const bridge_address = require_deploy_addresses(
      destination.chain_id,
    ).contracts.L1StandardBridgeProxy
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const calldata = encode_function_call({
      name: "bridgeERC20To",
      args: PARAM_CODECS,
      values: [
        parameters.l1_token,
        parameters.l2_token,
        parameters.to,
        parameters.amount,
        parameters.min_gas_limit,
        extra_data,
      ],
    })
    const signed_bytes = await eth_signTransaction([
      {
        to: bridge_address,
        value: ZERO_VALUE,
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: BRIDGE_ERC20_TO_SIGNATURE,
        },
      },
    ])([origin.signer, { chain_id: origin.chain_id }])
    return eth_sendRawTransaction([signed_bytes])([
      origin.reader,
      { chain_id: origin.chain_id },
    ])
  }
}
