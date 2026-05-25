import {
  address,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
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
  address(),
  address(),
  uint256(),
] as const

export const TRANSFER_FROM_SIGNATURE = {
  signature: "transferFrom(address,address,uint256)",
  names: ["from", "to", "tokenId"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema, uint256Schema]),
  object({
    from: addressSchema,
    to: addressSchema,
    tokenId: uint256Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function transferFrom(
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
          parameters.from,
          parameters.to,
          parameters.tokenId,
        ] as const)
    const calldata = encode_function_call({
      name: "transferFrom",
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
          function: TRANSFER_FROM_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
