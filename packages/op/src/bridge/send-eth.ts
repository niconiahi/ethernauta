// L1→L2 ETH deposit through the OP-stack L1StandardBridge.
//
// Composes:
//   - `bridgeETHTo(address,uint32,bytes)` calldata encoding
//   - L1StandardBridgeProxy address lookup by destination
//     L2 chain id
//   - origin-side (L1) signer issuing eth_sendTransaction
//
// Slice 1 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
  uint32 as uint32_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Hash32Schema,
  Uint32Schema,
  UintSchema,
} from "@ethernauta/core"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, optional, parse } from "valibot"
import {
  BRIDGE_ETH_TO_SIGNATURE,
  require_l1_standard_bridge_address,
} from "./l1-standard-bridge"

const PARAM_CODECS = [
  address_codec(),
  uint32_codec(),
  bytes_codec(),
] as const

const EMPTY_BYTES = parse(BytesSchema, "0x")

const ParametersSchema = object({
  to: AddressSchema,
  amount: UintSchema,
  min_gas_limit: Uint32Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_eth(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
    destination,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "send_eth requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const bridge_address =
      require_l1_standard_bridge_address(destination.chain_id)
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const calldata = encode_function_call({
      name: "bridgeETHTo",
      args: PARAM_CODECS,
      values: [
        parameters.to,
        parameters.min_gas_limit,
        extra_data,
      ],
    })
    const result = await origin.signer("eth_sendTransaction", [
      {
        to: bridge_address,
        value: parameters.amount,
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: BRIDGE_ETH_TO_SIGNATURE,
        },
      },
    ])
    return parse(Hash32Schema, result)
  }
}
