import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint256Schema,
  UintSchema,
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
  uint256(),
  uint256(),
  uint256(),
  address(),
  uint256(),
  bytes(),
] as const

export const SEND_UNSIGNED_TRANSACTION_SIGNATURE = {
  signature:
    "sendUnsignedTransaction(uint256,uint256,uint256,address,uint256,bytes)",
  names: [
    "gasLimit",
    "maxFeePerGas",
    "nonce",
    "to",
    "value",
    "data",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    AddressSchema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    gasLimit: Uint256Schema,
    maxFeePerGas: Uint256Schema,
    nonce: Uint256Schema,
    to: AddressSchema,
    value: Uint256Schema,
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function sendUnsignedTransaction(
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
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
          parameters[4],
          parameters[5],
        ] as const)
      : ([
          parameters.gasLimit,
          parameters.maxFeePerGas,
          parameters.nonce,
          parameters.to,
          parameters.value,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "sendUnsignedTransaction",
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
          function: SEND_UNSIGNED_TRANSACTION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
