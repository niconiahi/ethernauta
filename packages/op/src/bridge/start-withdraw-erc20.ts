// L2→L1 ERC-20 withdrawal initiation through the OP-stack
// L2StandardBridge predeploy.
//
// Composes:
//   - `withdrawTo(address,address,uint256,uint32,bytes)`
//     calldata encoding
//   - L2StandardBridge predeploy address (fixed at
//     `0x4200000000000000000000000000000000000010`)
//   - origin-side (L2) wallet signs via `eth_signTransaction`
//   - origin-side (L2) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value = 0 — the L2 ERC-20 is burned via
// the bridge's internal call. The L1 counterpart is released
// later by `execute_withdraw` after the proof matures.
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
import {
  L2_STANDARD_BRIDGE_ADDRESS,
  WITHDRAW_TO_SIGNATURE,
} from "../predeploys/l2-standard-bridge"

const PARAM_CODECS = [
  address_codec(),
  address_codec(),
  uint256_codec(),
  uint32_codec(),
  bytes_codec(),
] as const

const EMPTY_BYTES = parse(BytesSchema, "0x")
const ZERO_VALUE = parse(UintSchema, "0x0")

const ParametersSchema = object({
  l2_token: AddressSchema,
  to: AddressSchema,
  amount: Uint256Schema,
  min_gas_limit: Uint32Schema,
  extra_data: optional(BytesSchema),
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_erc20(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "start_withdraw_erc20 requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const extra_data = parameters.extra_data ?? EMPTY_BYTES
    const calldata = encode_function_call({
      name: "withdrawTo",
      args: PARAM_CODECS,
      values: [
        parameters.l2_token,
        parameters.to,
        parameters.amount,
        parameters.min_gas_limit,
        extra_data,
      ],
    })
    const signed_bytes = await eth_signTransaction([
      {
        to: L2_STANDARD_BRIDGE_ADDRESS,
        value: ZERO_VALUE,
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: WITHDRAW_TO_SIGNATURE,
        },
      },
    ])([origin.signer, { chain_id: origin.chain_id }])
    return eth_sendRawTransaction([signed_bytes])([
      origin.reader,
      { chain_id: origin.chain_id },
    ])
  }
}
