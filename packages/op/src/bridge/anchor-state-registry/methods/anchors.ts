import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
  uint256,
} from "@ethernauta/abi"
import type {
  Bytes,
  Bytes32,
  Uint256,
} from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint32()] as const
const OUTPUT_CODECS = [bytes32(), uint256()] as const

export const ANCHORS_SIGNATURE = {
  signature: "anchors(uint32)",
  names: ["arg_0"],
}

const ParametersSchema = union([
  tuple([Uint32Schema]),
  object({ arg_0: Uint32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function anchors(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Bytes32, Uint256]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.arg_0] as const)
    const calldata = encode_function_call({
      name: "anchors",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Bytes32, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Bytes32Schema, decoded[0]),
          parse(Uint256Schema, decoded[1]),
        ]
      },
    }
  }
}
