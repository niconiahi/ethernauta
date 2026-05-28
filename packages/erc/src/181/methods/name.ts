import {
  bytes32,
  decode_function_result,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
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
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [string_()] as const

export const NAME_SIGNATURE = {
  signature: "name(bytes32)",
  names: ["node"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ node: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function name(_parameters: Parameters) {
  return (context: ContractContext): Callable<string> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.node] as const)
    const calldata = encode_function_call({
      name: "name",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): string => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(string(), decoded)
      },
    }
  }
}
