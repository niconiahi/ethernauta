import {
  decode_function_result,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import {
  BytesSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [uint64()] as const

export const GET_CHALLENGER_DURATION_SIGNATURE = {
  signature: "getChallengerDuration(uint256)",
  names: ["_claimIndex"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ _claimIndex: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getChallengerDuration(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._claimIndex] as const)
    const calldata = encode_function_call({
      name: "getChallengerDuration",
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
