import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address } from "@ethernauta/eth"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import {
  bytes_to_hex,
  callSchema,
} from "@ethernauta/transport"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_TYPES = ["uint256"] as const
const OUTPUT_TYPES = ["address"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "ownerOf(uint256)",
  names: ["tokenId"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ tokenId: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function ownerOf(
  _parameters: Parameters,
): Callable<Address> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<Address> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.tokenId]
    const signature = build_signature("ownerOf", [
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
