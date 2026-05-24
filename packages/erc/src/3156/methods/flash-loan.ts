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
  bytes(),
] as const

export const FLASH_LOAN_SIGNATURE = {
  signature: "flashLoan(address,address,uint256,bytes)",
  names: ["receiver", "token", "amount", "data"],
}

const parametersSchema = union([
  tuple([
    addressSchema,
    addressSchema,
    uint256Schema,
    bytesSchema,
  ]),
  object({
    receiver: addressSchema,
    token: addressSchema,
    amount: uint256Schema,
    data: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function flashLoan(
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
          parameters[3],
        ] as const)
      : ([
          parameters.receiver,
          parameters.token,
          parameters.amount,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "flashLoan",
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
          function: FLASH_LOAN_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
