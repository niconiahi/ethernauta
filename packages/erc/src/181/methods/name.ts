import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes32, string_,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, string, tuple, union } from "valibot"
import { bytes32Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [string_()] as const

export const NAME_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "name(bytes32)",
  names: ["node"],
}

const parametersSchema = union([
  tuple([bytes32Schema]),
  object({ node: bytes32Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function name(_parameters: Parameters)
: (_context: ContractContext) => Callable<string> {
  return (
    _context: ContractContext,
  ): Callable<string> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node]
    const calldata = encode_function_call({
      name: "name",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): string => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(string(), decoded)
      },
    }
  }
}
