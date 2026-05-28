import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import {
  Bytes32Schema,
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

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [uint64()] as const

export const TTL_SIGNATURE = {
  signature: "ttl(bytes32)",
  names: ["node"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ node: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function ttl(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.node] as const)
    const calldata = encode_function_call({
      name: "ttl",
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
