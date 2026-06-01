// L2→L1 arbitrary message initiation through the OP-stack
// L2ToL1MessagePasser predeploy.
//
// Composes:
//   - `initiateWithdrawal(address,uint256,bytes)` calldata
//     encoding
//   - L2ToL1MessagePasser predeploy address (fixed at
//     `0x4200000000000000000000000000000000000016`)
//   - origin-side (L2) wallet signs via `eth_signTransaction`
//   - origin-side (L2) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L2 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value mirrors the `value` parameter —
// L2 ETH is burned now and released on L1 by
// `execute_withdraw` after the proof matures. For a pure
// no-value message, pass `value: 0x0`.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  bytes as bytes_codec,
  encode_function_call,
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
  eth_sendRawTransaction,
  eth_signTransaction,
} from "@ethernauta/eth"
import type {
  Bridgeable,
  ResolvedBridge,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse } from "valibot"
import {
  INITIATE_WITHDRAWAL_SIGNATURE,
  L2_TO_L1_MESSAGE_PASSER_ADDRESS,
} from "./l2-to-l1-message-passer"

const PARAM_CODECS = [
  address_codec(),
  uint256_codec(),
  bytes_codec(),
] as const

const ParametersSchema = object({
  to: AddressSchema,
  value: Uint256Schema,
  gas_limit: Uint256Schema,
  data: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function start_withdraw_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "start_withdraw_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const calldata = encode_function_call({
      name: "initiateWithdrawal",
      args: PARAM_CODECS,
      values: [
        parameters.to,
        parameters.gas_limit,
        parameters.data,
      ],
    })
    const signed_bytes = await eth_signTransaction([
      {
        to: L2_TO_L1_MESSAGE_PASSER_ADDRESS,
        value: parse(UintSchema, parameters.value),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: INITIATE_WITHDRAWAL_SIGNATURE,
        },
      },
    ])([origin.signer, { chain_id: origin.chain_id }])
    return eth_sendRawTransaction([signed_bytes])([
      origin.reader,
      { chain_id: origin.chain_id },
    ])
  }
}
