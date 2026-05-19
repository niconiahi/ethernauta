import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  callSchema,
} from "@ethernauta/transport"
import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import { bytes4Schema } from "@ethernauta/eth"

const PARAM_TYPES = ["bytes4"] as const
const OUTPUT_TYPES = ["bool"] as const

export const SIGNATURE: {
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

export function supportsInterface(
  _parameters: Parameters,
): Callable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.interfaceId]
    const signature = build_signature("supportsInterface", [
      ...PARAM_TYPES,
    ])
    const calldata = encode_function_call(
      signature,
      [...PARAM_TYPES],
      values,
    )
    const call = parse(callSchema, [
      "eth_call",
      [
        { to: _context.to, input: bytes_to_hex(calldata) },
        "latest",
      ],
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
    return parse(boolean(), decoded)
  }
}
