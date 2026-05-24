import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { addressSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [address(), address()] as const
const OUTPUT_CODECS = [bool()] as const

export const IS_APPROVED_FOR_ALL_SIGNATURE = {
  signature: "isApprovedForAll(address,address)",
  names: ["owner_", "operator"],
}

const parametersSchema = union([
  tuple([addressSchema, addressSchema]),
  object({
    owner_: addressSchema,
    operator: addressSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function isApprovedForAll(_parameters: Parameters) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.owner_, parameters.operator] as const)
    const calldata = encode_function_call({
      name: "isApprovedForAll",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
