import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes32, uint64,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { bytes32Schema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32(), uint64()] as const

export const SET_TTL_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "setTTL(bytes32,uint64)",
  names: ["node", "ttl"],
}

const parametersSchema = union([
  tuple([bytes32Schema, uint256Schema]),
  object({ node: bytes32Schema, ttl: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function setTTL(_parameters: Parameters)
: Signable<Bytes> {
  return async (
    [signer, _context]: ResolvedSigner,
  ): Promise<Bytes> => {
    if (!_context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node, parameters.ttl]
    const calldata = encode_function_call({
      name: "setTTL",
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
          function: SET_TTL_SIGNATURE,
        },
      }],
    )([signer, _context])
  }
}
