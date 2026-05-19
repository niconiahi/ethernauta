import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { addressSchema } from "@ethernauta/eth"
import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_TYPES = ["address", "address"] as const
const OUTPUT_TYPES = ["bool"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "isApprovedForAll(address,address)",
  names: ["owner", "operator"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema]),
  object({ owner: addressSchema, operator: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function isApprovedForAll(
  _parameters: Parameters,
): Callable<boolean> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.owner, parameters.operator]
    const signature = build_signature("isApprovedForAll", [
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
