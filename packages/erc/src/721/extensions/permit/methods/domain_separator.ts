import type { Readable, ResolvedReader } from "@ethernauta/transport"
import { bytes_to_hex, callSchema } from "@ethernauta/transport"
import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Bytes32 } from "@ethernauta/eth"
import { bytes32Schema } from "@ethernauta/eth"

const PARAM_TYPES = [] as const
const OUTPUT_TYPES = ["bytes32"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "DOMAIN_SEPARATOR()",
  names: [],
}



export function DOMAIN_SEPARATOR()
: Readable<Bytes32> {
  return async (
    [transports, _context]: ResolvedReader,
  ): Promise<Bytes32> => {
    if (!_context.to)
      throw new Error("contract Readable requires a 'to' on the reader resolver")
    const values: unknown[] = []
    const signature = build_signature("DOMAIN_SEPARATOR", [...PARAM_TYPES])
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
    return parse(bytes32Schema, decoded)
  }
}
