import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes, bytes32, uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import { bytes32Schema, bytesSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [bytes32(), uint256()] as const
const OUTPUT_CODECS = [bytes()] as const

export const ADDR_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "addr(bytes32,uint256)",
  names: ["node", "coinType"],
}

const parametersSchema = union([
  tuple([bytes32Schema, uint256Schema]),
  object({ node: bytes32Schema, coinType: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function addr(_parameters: Parameters)
: (_context: ContractContext) => Callable<Bytes> {
  return (
    _context: ContractContext,
  ): Callable<Bytes> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node, parameters.coinType]
    const calldata = encode_function_call({
      name: "addr",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(bytesSchema, decoded)
      },
    }
  }
}
