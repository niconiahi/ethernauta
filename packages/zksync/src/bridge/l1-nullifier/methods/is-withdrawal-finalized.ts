import {
  bool,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [
  uint256(),
  uint256(),
  uint256(),
] as const
const OUTPUT_CODECS = [bool()] as const

export const IS_WITHDRAWAL_FINALIZED_SIGNATURE = {
  signature:
    "isWithdrawalFinalized(uint256,uint256,uint256)",
  names: [
    "chainId",
    "l2BatchNumber",
    "l2ToL1MessageNumber",
  ],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Uint256Schema, Uint256Schema]),
  object({
    chainId: Uint256Schema,
    l2BatchNumber: Uint256Schema,
    l2ToL1MessageNumber: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function isWithdrawalFinalized(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters.chainId,
          parameters.l2BatchNumber,
          parameters.l2ToL1MessageNumber,
        ] as const)
    const calldata = encode_function_call({
      name: "isWithdrawalFinalized",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
