import type { Readable, ResolvedReader } from "@ethernauta/transport"
import { bytes_to_hex, callSchema } from "@ethernauta/transport"
import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, string, tuple, union } from "valibot"
import { uint256Schema } from "@ethernauta/eth"

const PARAM_TYPES = ["uint256"] as const
const OUTPUT_TYPES = ["string"] as const

export const SIGNATURE: {
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

export function uri(_parameters: Parameters)
: Readable<string> {
  return async (
    [transports, _context]: ResolvedReader,
  ): Promise<string> => {
    if (!_context.to)
      throw new Error("contract Readable requires a 'to' on the reader resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.id]
    const signature = build_signature("uri", [...PARAM_TYPES])
    const calldata = encode_function_call(
      signature,
      [...PARAM_TYPES],
      values,
    )
    const call = parse(callSchema, [
      "eth_call",
      [{ to: _context.to, input: bytes_to_hex(calldata) }, "latest"],
    ])
    const response = await Promise.any(
      transports.map((transport) => transport(call)),
    )
    if ("error" in response) {
      throw new Error(response.error.message)
    }
    const [decoded] = decode_function_result(
      [...OUTPUT_TYPES],
      response.result as `0x${string}`,
    )
    return parse(string(), decoded)
  }
}
