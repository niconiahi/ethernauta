import {
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  BytesSchema,
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
const OUTPUT_CODECS = [uint256()] as const

export const GET_OPERATOR_FEE_SIGNATURE = {
  signature: "getOperatorFee(uint256)",
  names: ["_gasUsed"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ _gasUsed: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getOperatorFee(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._gasUsed] as const)
    const calldata = encode_function_call({
      name: "getOperatorFee",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint256Schema, decoded)
      },
    }
  }
}
