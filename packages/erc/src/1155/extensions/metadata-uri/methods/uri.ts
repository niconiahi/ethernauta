import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  string_,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, string, tuple, union } from "valibot"
import { bytesSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [string_()] as const

export const URI_SIGNATURE = {
  signature: "uri(uint256)",
  names: ["id"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ id: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function uri(_parameters: Parameters) {
  return (context: ContractContext): Callable<string> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.id] as const)
    const calldata = encode_function_call({
      name: "uri",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
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
