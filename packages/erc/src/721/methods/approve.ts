import {
  build_signature,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/eth"
import {
  addressSchema,
  eth_signTransaction,
  uint256Schema,
} from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_TYPES = ["address", "uint256"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "approve(address,uint256)",
  names: ["to", "tokenId"],
}

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({ to: addressSchema, tokenId: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function approve(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([
    signer,
    _context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!_context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.to, parameters.tokenId]
    const signature = build_signature("approve", [
      ...PARAM_TYPES,
    ])
    const calldata = encode_function_call(
      signature,
      [...PARAM_TYPES],
      values,
    )
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [
        {
          to: _context.to,
          value: "0x0",
          input: bytes_to_hex(calldata),
        },
      ],
      { _function: SIGNATURE },
    )([signer, _context])
  }
}
