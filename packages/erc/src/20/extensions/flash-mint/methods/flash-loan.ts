import type { Bytes } from "@ethernauta/eth"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/transport"
import {
  build_signature,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { addressSchema, bytesSchema, uint256Schema } from "@ethernauta/eth"

const PARAM_TYPES = ["address", "address", "uint256", "bytes"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "flashLoan(address,address,uint256,bytes)",
  names: ["receiver", "token", "value", "data"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema, uint256Schema, bytesSchema]),
  object({ receiver: addressSchema, token: addressSchema, value: uint256Schema, data: bytesSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function flashLoan(_parameters: Parameters)
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.receiver, parameters.token, parameters.value, parameters.data]
    const signature = build_signature("flashLoan", [...PARAM_TYPES])
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
      [{
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
      }],
      { _function: SIGNATURE },
    )([signer, _context])
  }
}
