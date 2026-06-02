import {
  address,
  array,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
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
  array(address()),
  array(address()),
] as const

export const SET_GATEWAY_SIGNATURE = {
  signature: "setGateway(address[],address[])",
  names: ["_l1Token", "_gateway"],
}

const ParametersSchema = union([
  tuple([v_array(AddressSchema), v_array(AddressSchema)]),
  object({
    _l1Token: v_array(AddressSchema),
    _gateway: v_array(AddressSchema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setGateway(
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
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters._l1Token,
          parameters._gateway,
        ] as const)
    const calldata = encode_function_call({
      name: "setGateway",
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
          function: SET_GATEWAY_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
