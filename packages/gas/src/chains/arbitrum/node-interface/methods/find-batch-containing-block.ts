import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint64 } from "@ethernauta/core"
import { bytesSchema, uint64Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint64()] as const
const OUTPUT_CODECS = [uint64()] as const

export const FIND_BATCH_CONTAINING_BLOCK_SIGNATURE = {
  signature: "findBatchContainingBlock(uint64)",
  names: ["blockNum"],
}

const parametersSchema = union([
  tuple([uint64Schema]),
  object({ blockNum: uint64Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function findBatchContainingBlock(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.blockNum] as const)
    const calldata = encode_function_call({
      name: "findBatchContainingBlock",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint64Schema, decoded)
      },
    }
  }
}
