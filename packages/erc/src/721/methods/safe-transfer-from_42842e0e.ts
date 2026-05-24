import {
  address,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
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
] as const

export const SAFE_TRANSFER_FROM_42842E0E_SIGNATURE = {
  signature: "safeTransferFrom(address,address,uint256)",
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

export function safeTransferFrom_42842e0e(
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
      : [parameters.from, parameters.to, parameters.tokenId]
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
          function: SAFE_TRANSFER_FROM_42842E0E_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
