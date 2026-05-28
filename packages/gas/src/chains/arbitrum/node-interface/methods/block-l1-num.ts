import {
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import { BytesSchema, Uint64Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint64()] as const
const OUTPUT_CODECS = [uint64()] as const

export const BLOCK_L1_NUM_SIGNATURE = {
  signature: "blockL1Num(uint64)",
  names: ["l2BlockNum"],
}

const ParametersSchema = union([
  tuple([Uint64Schema]),
  object({ l2BlockNum: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function blockL1Num(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.l2BlockNum] as const)
    const calldata = encode_function_call({
      name: "blockL1Num",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint64Schema, decoded)
      },
    }
  }
}
