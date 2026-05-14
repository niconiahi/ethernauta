import type { Readable, ResolvedReader } from "@ethernauta/transport"
import { bytes_to_hex, callSchema } from "@ethernauta/transport"
import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/eth"
import { addressSchema, uint256Schema } from "@ethernauta/eth"

const PARAM_TYPES = ["address"] as const
const OUTPUT_TYPES = ["uint256"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "nonces(address)",
  names: ["owner"],
}

const parametersSchema = union([
  tuple([addressSchema]),
  object({ owner: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function nonces(_parameters: Parameters)
: Readable<Uint256> {
  return async (
    [transports, _context]: ResolvedReader,
  ): Promise<Uint256> => {
    if (!_context.to)
      throw new Error("contract Readable requires a 'to' on the reader resolver")
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.owner]
    const signature = build_signature("nonces", [...PARAM_TYPES])
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
    return parse(uint256Schema, decoded)
  }
}
