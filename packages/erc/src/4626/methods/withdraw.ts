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
import { addressSchema, uint256Schema } from "@ethernauta/eth"

const PARAM_TYPES = ["uint256", "address", "address"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "withdraw(uint256,address,address)",
  names: ["assets", "receiver", "owner"],
}

const parametersSchema = union([
  tuple([uint256Schema, addressSchema, addressSchema]),
  object({ assets: uint256Schema, receiver: addressSchema, owner: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function withdraw(_parameters: Parameters)
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.assets, parameters.receiver, parameters.owner]
    const signature = build_signature("withdraw", [...PARAM_TYPES])
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
