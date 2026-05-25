import {
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  bytes32Schema,
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes32(), uint256()] as const
const OUTPUT_CODECS = [bytes()] as const

export const ADDR_SIGNATURE = {
  signature: "addr(bytes32,uint256)",
  names: ["node", "coinType"],
}

const parametersSchema = union([
  tuple([bytes32Schema, uint256Schema]),
  object({ node: bytes32Schema, coinType: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function addr(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.node, parameters.coinType] as const)
    const calldata = encode_function_call({
      name: "addr",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(bytesSchema, decoded)
      },
    }
  }
}
