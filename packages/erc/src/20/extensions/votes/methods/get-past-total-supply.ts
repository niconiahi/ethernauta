import type { Bytes, Callable, ContractContext } from "@ethernauta/transport"
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

export const SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "getPastTotalSupply(uint256)",
  names: ["timepoint"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ timepoint: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function getPastTotalSupply(_parameters: Parameters)
: (_context: ContractContext) => Callable<Uint256> {
  return (
    _context: ContractContext,
  ): Callable<Uint256> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.timepoint]
    const calldata = encode_function_call({
      name: "getPastTotalSupply",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(uint256Schema, decoded)
      },
    }
  }
}
