import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address, bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { boolean, object, parse, tuple, union } from "valibot"
import { addressSchema } from "@ethernauta/core"

const PARAM_CODECS = [address(), address()] as const
const OUTPUT_CODECS = [bool()] as const

export const IS_APPROVED_FOR_ALL_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "isApprovedForAll(address,address)",
  names: ["owner_", "operator"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema]),
  object({ owner_: addressSchema, operator: addressSchema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function isApprovedForAll(_parameters: Parameters)
: (_context: ContractContext) => Callable<boolean> {
  return (
    _context: ContractContext,
  ): Callable<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.owner_, parameters.operator]
    const calldata = encode_function_call({
      name: "isApprovedForAll",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
