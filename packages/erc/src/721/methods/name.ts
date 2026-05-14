import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type {
  Readable,
  ResolvedReader,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  callSchema,
} from "@ethernauta/transport"
import { parse, string } from "valibot"

const PARAM_TYPES = [] as const
const OUTPUT_TYPES = ["string"] as const

export function name(): Readable<string> {
  return async ([
    transports,
    _context,
  ]: ResolvedReader): Promise<string> => {
    if (!_context.to)
      throw new Error(
        "contract Readable requires a 'to' on the reader resolver",
      )
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
