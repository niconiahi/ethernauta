import {
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import { uint256Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [uint256()] as const

export const PREVIEW_WITHDRAW_SIGNATURE = {
  signature: "previewWithdraw(uint256)",
  names: ["assets"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ assets: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function previewWithdraw(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.assets]
    const calldata = encode_function_call({
      name: "previewWithdraw",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint256Schema, decoded)
      },
    }
  }
}
