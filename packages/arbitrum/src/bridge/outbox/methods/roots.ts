import {
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [bytes32()] as const

export const ROOTS_SIGNATURE = {
  signature: "roots(bytes32)",
  names: ["arg_0"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ arg_0: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function roots(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.arg_0] as const)
    const calldata = encode_function_call({
      name: "roots",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Bytes32Schema, decoded)
      },
    }
  }
}
