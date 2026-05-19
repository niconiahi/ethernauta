import {
  build_signature,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Uint256 } from "@ethernauta/eth"
import {
  addressSchema,
  uint256Schema,
} from "@ethernauta/eth"
import type {
  Callable,
  ResolvedContract,
} from "@ethernauta/transport"
import { callSchema } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_TYPES = ["address", "uint256"] as const
const OUTPUT_TYPES = ["uint256"] as const

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "balanceOf(address,uint256)",
  names: ["account", "id"],
}

const parametersSchema = union([
  tuple([addressSchema, uint256Schema]),
  object({ account: addressSchema, id: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function balanceOf(
  _parameters: Parameters,
): Callable<Uint256> {
  return async ([
    transports,
    _context,
  ]: ResolvedContract): Promise<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.account, parameters.id]
    const signature = build_signature("balanceOf", [
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
    return parse(uint256Schema, decoded)
  }
}
