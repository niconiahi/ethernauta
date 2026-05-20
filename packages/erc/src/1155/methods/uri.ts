import type {
  Bytes,
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  string_,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"
import { uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [string_()] as const

export const URI_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "uri(uint256)",
  names: ["id"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ id: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function uri(
  _parameters: Parameters,
): (_context: ContractContext) => Callable<string> {
  return (_context: ContractContext): Callable<string> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.id]
    const calldata = encode_function_call({
      name: "uri",
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
