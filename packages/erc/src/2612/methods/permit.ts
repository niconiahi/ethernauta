import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address, bytes32, uint256, uint8,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { addressSchema, bytes32Schema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [address(), address(), uint256(), uint256(), uint8(), bytes32(), bytes32()] as const

export const PERMIT_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
  names: ["owner", "spender", "value", "deadline", "v", "r", "s"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema, uint256Schema, uint256Schema, uint256Schema, bytes32Schema, bytes32Schema]),
  object({ owner: addressSchema, spender: addressSchema, value: uint256Schema, deadline: uint256Schema, v: uint256Schema, r: bytes32Schema, s: bytes32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function permit(_parameters: Parameters)
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.owner, parameters.spender, parameters.value, parameters.deadline, parameters.v, parameters.r, parameters.s]
    const calldata = encode_function_call({
      name: "permit",
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
          function: PERMIT_SIGNATURE,
        },
      }],
    )([signer, _context])
  }
}
