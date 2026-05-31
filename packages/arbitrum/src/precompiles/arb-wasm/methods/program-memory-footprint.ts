import {
  address,
  decode_function_result,
  encode_function_call,
  uint16,
} from "@ethernauta/abi"
import type { Bytes, Uint16 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint16Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [uint16()] as const

export const PROGRAM_MEMORY_FOOTPRINT_SIGNATURE = {
  signature: "programMemoryFootprint(address)",
  names: ["program"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ program: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function programMemoryFootprint(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Uint16> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.program] as const)
    const calldata = encode_function_call({
      name: "programMemoryFootprint",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint16 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint16Schema, decoded)
      },
    }
  }
}
