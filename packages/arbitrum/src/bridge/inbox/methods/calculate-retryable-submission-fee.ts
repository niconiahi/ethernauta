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

const PARAM_CODECS = [uint256(), uint256()] as const
const OUTPUT_CODECS = [uint256()] as const

export const CALCULATE_RETRYABLE_SUBMISSION_FEE_SIGNATURE =
  {
    signature:
      "calculateRetryableSubmissionFee(uint256,uint256)",
    names: ["dataLength", "baseFee"],
  }

const ParametersSchema = union([
  tuple([Uint256Schema, Uint256Schema]),
  object({
    dataLength: Uint256Schema,
    baseFee: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function calculateRetryableSubmissionFee(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters.dataLength,
          parameters.baseFee,
        ] as const)
    const calldata = encode_function_call({
      name: "calculateRetryableSubmissionFee",
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
