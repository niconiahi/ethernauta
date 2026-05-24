import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes32,
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import { bytes32Schema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [uint64()] as const

export const TTL_SIGNATURE = {
  signature: "ttl(bytes32)",
  names: ["node"],
}

const parametersSchema = union([
  tuple([bytes32Schema]),
  object({ node: bytes32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function ttl(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node]
    const calldata = encode_function_call({
      name: "ttl",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint256Schema, decoded)
      },
    }
  }
}
