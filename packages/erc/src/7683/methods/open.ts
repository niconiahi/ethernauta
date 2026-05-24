import {
  tuple as abi_tuple,
  bytes,
  bytes32,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  bytes32Schema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    fillDeadline: uint32(),
    orderDataType: bytes32(),
    orderData: bytes(),
  }),
] as const

export const OPEN_SIGNATURE = {
  signature: "open((uint32,bytes32,bytes))",
  names: ["order"],
}

const parametersSchema = union([
  tuple([
    object({
      fillDeadline: uint256Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
  ]),
  object({
    order: object({
      fillDeadline: uint256Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function open(
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
      : [parameters.order]
    const calldata = encode_function_call({
      name: "open",
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
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: {
          function: OPEN_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
