import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint64 } from "@ethernauta/core"
import { BytesSchema, Uint64Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint64()] as const
const OUTPUT_CODECS = [uint64(), uint64()] as const

export const L2_BLOCK_RANGE_FOR_L1_SIGNATURE = {
  signature: "l2BlockRangeForL1(uint64)",
  names: ["blockNum"],
}

const ParametersSchema = union([
  tuple([Uint64Schema]),
  object({ blockNum: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function l2BlockRangeForL1(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Uint64, Uint64]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.blockNum] as const)
    const calldata = encode_function_call({
      name: "l2BlockRangeForL1",
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
