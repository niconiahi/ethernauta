import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import { uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [uint256()] as const

export const TOKEN_BY_INDEX_SIGNATURE = {
  signature: "tokenByIndex(uint256)",
  names: ["index"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ index: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function tokenByIndex(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.index]
    const calldata = encode_function_call({
      name: "tokenByIndex",
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
