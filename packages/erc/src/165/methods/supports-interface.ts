import type { Bytes, Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bool, bytes4,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"
import { bytes4Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes4()] as const
const OUTPUT_CODECS = [bool()] as const

export const SUPPORTS_INTERFACE_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "supportsInterface(bytes4)",
  names: ["interfaceId"],
}

const parametersSchema = union([
  tuple([bytes4Schema]),
  object({ interfaceId: bytes4Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function supportsInterface(_parameters: Parameters)
: (_context: ContractContext) => Callable<boolean> {
  return (
    _context: ContractContext,
  ): Callable<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.interfaceId]
    const calldata = encode_function_call({
      name: "supportsInterface",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
