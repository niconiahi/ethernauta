import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint256,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { bytesSchema, uint256Schema, uintSchema } from "@ethernauta/core"

const PARAM_CODECS = [uint256()] as const

export const BURN_SIGNATURE = {
  signature: "burn(uint256)",
  names: ["tokenId"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ tokenId: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function burn(_parameters: Parameters): Signable<Bytes> {
  return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.tokenId] as const)
    const calldata = encode_function_call({
      name: "burn",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction(
      [{
        to: context.to,
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: BURN_SIGNATURE,
        },
      }],
    )([signer, context])
  }
}
