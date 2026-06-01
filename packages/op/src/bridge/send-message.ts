// L1→L2 arbitrary message through the OP-stack OptimismPortal.
//
// Composes:
//   - `depositTransaction(address,uint256,uint64,bool,bytes)`
//     calldata encoding
//   - OptimismPortalProxy address lookup by destination
//     L2 chain id
//   - origin-side (L1) wallet signs via `eth_signTransaction`
//   - origin-side (L1) dispatcher broadcasts via
//     `eth_sendRawTransaction`, returning the L1 tx hash
//
// Path-2 composition (per M3): the wallet only signs, the
// dapp broadcasts. msg.value mirrors the `_value` ABI
// parameter — the L1 ETH locked equals the L2 mint amount,
// which is the standard case. For a pure no-value message,
// pass `value: 0x0`.
//
// Slice 2 of phase 05 — see tmp/plans/05_bridge_package/.

import {
  address as address_codec,
  bool as bool_codec,
  bytes as bytes_codec,
  encode_function_call,
  uint64 as uint64_codec,
  uint256 as uint256_codec,
} from "@ethernauta/abi"
import {
  AddressSchema,
  BytesSchema,
  type Hash32,
  Uint64Schema,
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
import { boolean, object, parse } from "valibot"
import { require_deploy_addresses } from "../lib/deploy"
import { DEPOSIT_TRANSACTION_SIGNATURE } from "./optimism-portal"

const PARAM_CODECS = [
  address_codec(),
  uint256_codec(),
  uint64_codec(),
  bool_codec(),
  bytes_codec(),
] as const

const ParametersSchema = object({
  to: AddressSchema,
  value: Uint256Schema,
  gas_limit: Uint64Schema,
  is_creation: boolean(),
  data: BytesSchema,
})
type Parameters = InferOutput<typeof ParametersSchema>

export function send_message(
  _parameters: Parameters,
): Bridgeable<Hash32> {
  return async ({
    origin,
    destination,
  }: ResolvedBridge): Promise<Hash32> => {
    if (!origin.signer) {
      throw new Error(
        "send_message requires a signer — pass signer to bridge({...})",
      )
    }
    const parameters = parse(ParametersSchema, _parameters)
    const portal_address = require_deploy_addresses(
      destination.chain_id,
    ).contracts.OptimismPortalProxy
    const calldata = encode_function_call({
      name: "depositTransaction",
      args: PARAM_CODECS,
      values: [
        parameters.to,
        parameters.value,
        parameters.gas_limit,
        parameters.is_creation,
        parameters.data,
      ],
    })
    const signed_bytes = await eth_signTransaction([
      {
        to: portal_address,
        value: parse(UintSchema, parameters.value),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: DEPOSIT_TRANSACTION_SIGNATURE,
        },
      },
    ])([origin.signer, { chain_id: origin.chain_id }])
    return eth_sendRawTransaction([signed_bytes])([
      origin.reader,
      { chain_id: origin.chain_id },
    ])
  }
}
