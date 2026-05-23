import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address, bool,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"
import { addressSchema } from "@ethernauta/core"

const PARAM_CODECS = [address(), bool()] as const

export const SET_APPROVAL_FOR_ALL_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "setApprovalForAll(address,bool)",
  names: ["operator", "approved"],
}

const parametersSchema = union([
  tuple([addressSchema, boolean()]),
  object({ operator: addressSchema, approved: boolean() }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function setApprovalForAll(_parameters: Parameters)
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.operator, parameters.approved]
    const calldata = encode_function_call({
      name: "setApprovalForAll",
      args: PARAM_CODECS,
      values: values as never,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: _context.to,
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: {
          function: SET_APPROVAL_FOR_ALL_SIGNATURE,
        },
      }],
    )([signer, _context])
  }
}
