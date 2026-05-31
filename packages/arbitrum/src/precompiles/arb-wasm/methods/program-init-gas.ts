import {
  address,
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint64Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [uint64(), uint64()] as const

export const PROGRAM_INIT_GAS_SIGNATURE = {
  signature: "programInitGas(address)",
  names: ["program"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ program: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function programInitGas(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Uint64, Uint64]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.program] as const)
    const calldata = encode_function_call({
      name: "programInitGas",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Uint64, Uint64] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint64Schema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
        ]
      },
    }
  }
}
