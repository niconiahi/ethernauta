import {
  array,
  encode_function_call,
  fixed_array,
  uint64,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint64Schema,
  UintSchema,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  array(fixed_array(uint64(), 3)),
] as const

export const SET_GAS_PRICING_CONSTRAINTS_SIGNATURE = {
  signature: "setGasPricingConstraints(uint64[3][])",
  names: ["constraints"],
}

const ParametersSchema = union([
  tuple([
    v_array(
      tuple([Uint64Schema, Uint64Schema, Uint64Schema]),
    ),
  ]),
  object({
    constraints: v_array(
      tuple([Uint64Schema, Uint64Schema, Uint64Schema]),
    ),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setGasPricingConstraints(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([
    signer,
    context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.constraints] as const)
    const calldata = encode_function_call({
      name: "setGasPricingConstraints",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: SET_GAS_PRICING_CONSTRAINTS_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
