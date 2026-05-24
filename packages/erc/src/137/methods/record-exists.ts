import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bool,
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"
import { bytes32Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [bool()] as const

export const RECORD_EXISTS_SIGNATURE = {
  signature: "recordExists(bytes32)",
  names: ["node"],
}

const parametersSchema = union([
  tuple([bytes32Schema]),
  object({ node: bytes32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function recordExists(_parameters: Parameters) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node]
    const calldata = encode_function_call({
      name: "recordExists",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
