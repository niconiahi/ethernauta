import {
  bytes,
  decode_function_result,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { BytesSchema, Uint32Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint32()] as const
const OUTPUT_CODECS = [bytes()] as const

export const GAME_ARGS_SIGNATURE = {
  signature: "gameArgs(uint32)",
  names: ["arg_0"],
}

const ParametersSchema = union([
  tuple([Uint32Schema]),
  object({ arg_0: Uint32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function gameArgs(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.arg_0] as const)
    const calldata = encode_function_call({
      name: "gameArgs",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(BytesSchema, decoded)
      },
    }
  }
}
