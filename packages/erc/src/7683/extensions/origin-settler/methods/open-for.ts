import {
  tuple as abi_tuple,
  address,
  bytes,
  bytes32,
  encode_function_call,
  uint32,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint32Schema,
  uint256Schema,
  uintSchema,
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
    originSettler: address(),
    user: address(),
    nonce: uint256(),
    originChainId: uint256(),
    openDeadline: uint32(),
    fillDeadline: uint32(),
    orderDataType: bytes32(),
    orderData: bytes(),
  }),
  bytes(),
  bytes(),
] as const

export const OPEN_FOR_SIGNATURE = {
  signature:
    "openFor((address,address,uint256,uint256,uint32,uint32,bytes32,bytes),bytes,bytes)",
  names: ["order", "signature", "originFillerData"],
}

const parametersSchema = union([
  tuple([
    object({
      originSettler: addressSchema,
      user: addressSchema,
      nonce: uint256Schema,
      originChainId: uint256Schema,
      openDeadline: uint32Schema,
      fillDeadline: uint32Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
    bytesSchema,
    bytesSchema,
  ]),
  object({
    order: object({
      originSettler: addressSchema,
      user: addressSchema,
      nonce: uint256Schema,
      originChainId: uint256Schema,
      openDeadline: uint32Schema,
      fillDeadline: uint32Schema,
      orderDataType: bytes32Schema,
      orderData: bytesSchema,
    }),
    signature: bytesSchema,
    originFillerData: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function openFor(
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
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters.order,
          parameters.signature,
          parameters.originFillerData,
        ] as const)
    const calldata = encode_function_call({
      name: "openFor",
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
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: OPEN_FOR_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
