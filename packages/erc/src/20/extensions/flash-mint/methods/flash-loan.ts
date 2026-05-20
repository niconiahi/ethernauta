import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address, bytes, uint256,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { addressSchema, bytesSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [address(), address(), uint256(), bytes()] as const

export const FLASH_LOAN_SIGNATURE: {
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
    const calldata = encode_function_call({
      name: "flashLoan",
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
      }],
      { _function: FLASH_LOAN_SIGNATURE },
    )([signer, _context])
  }
}
