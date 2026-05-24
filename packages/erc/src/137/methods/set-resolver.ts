import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  bytes32,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import {
  addressSchema,
  bytes32Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [bytes32(), address()] as const

export const SET_RESOLVER_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "setResolver(bytes32,address)",
  names: ["node", "resolver"],
}

const parametersSchema = union([
  tuple([bytes32Schema, addressSchema]),
  object({ node: bytes32Schema, resolver: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function setResolver(
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
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node, parameters.resolver]
    const calldata = encode_function_call({
      name: "setResolver",
      args: PARAM_CODECS,
      values: values as never,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([
      {
        to: context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: {
          function: SET_RESOLVER_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
