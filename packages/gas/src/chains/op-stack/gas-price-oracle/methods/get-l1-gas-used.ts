import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import {
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [bytes()] as const
const OUTPUT_CODECS = [uint256()] as const

export const GET_L1_GAS_USED_SIGNATURE = {
  signature: "getL1GasUsed(bytes)",
  names: ["_data"],
}

const ParametersSchema = union([
  tuple([BytesSchema]),
  object({ _data: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getL1GasUsed(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint256> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._data] as const)
    const calldata = encode_function_call({
      name: "getL1GasUsed",
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
