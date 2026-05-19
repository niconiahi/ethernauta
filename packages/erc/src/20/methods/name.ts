import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  callSchema,
} from "@ethernauta/transport"
import { parse, string } from "valibot"

const PARAM_TYPES = [] as const
const OUTPUT_TYPES = ["string"] as const

export function name(): Callable<string> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<string> => {
    const values: unknown[] = []
    const signature = build_signature("name", [
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
    return parse(string(), decoded)
  }
}
