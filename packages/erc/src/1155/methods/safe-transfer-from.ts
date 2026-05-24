import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
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
  address(),
  address(),
  uint256(),
  uint256(),
  bytes(),
] as const

export const SAFE_TRANSFER_FROM_SIGNATURE = {
  signature:
    "safeTransferFrom(address,address,uint256,uint256,bytes)",
  names: ["from", "to", "id", "value", "data"],
}

const parametersSchema = union([
  tuple([
    addressSchema,
    addressSchema,
    uint256Schema,
    uint256Schema,
    bytesSchema,
  ]),
  object({
    from: addressSchema,
    to: addressSchema,
    id: uint256Schema,
    value: uint256Schema,
    data: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function safeTransferFrom(
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
      : [
          parameters.from,
          parameters.to,
          parameters.id,
          parameters.value,
          parameters.data,
        ]
    const calldata = encode_function_call({
      name: "safeTransferFrom",
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
          function: SAFE_TRANSFER_FROM_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
