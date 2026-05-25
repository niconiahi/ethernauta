import type { Bytes } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type { ResolvedSigner, Signable } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes,
  bytes32,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { bytes32Schema, bytesSchema, uintSchema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32(), bytes(), bytes()] as const

export const FILL_SIGNATURE = {
  signature: "fill(bytes32,bytes,bytes)",
  names: ["orderId", "originData", "fillerData"],
}

const parametersSchema = union([
  tuple([bytes32Schema, bytesSchema, bytesSchema]),
  object({ orderId: bytes32Schema, originData: bytesSchema, fillerData: bytesSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function fill(_parameters: Parameters): Signable<Bytes> {
  return async ([signer, context]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error("contract Signable requires a 'to' on the signer resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1], parameters[2]] as const)
      : ([parameters.orderId, parameters.originData, parameters.fillerData] as const)
    const calldata = encode_function_call({
      name: "fill",
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
          function: FILL_SIGNATURE,
        },
      }],
    )([signer, context])
  }
}
