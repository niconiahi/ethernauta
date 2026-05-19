import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address } from "@ethernauta/eth"
import { addressSchema } from "@ethernauta/eth"
import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  callSchema,
} from "@ethernauta/transport"
import { parse } from "valibot"

const PARAM_TYPES = [] as const
const OUTPUT_TYPES = ["address"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "underlying()",
  names: [],
}

export function underlying(): Callable<Address> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<Address> => {
    const values: unknown[] = []
    const signature = build_signature("underlying", [
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
    return parse(addressSchema, decoded)
  }
}
