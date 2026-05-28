import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes32,
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint64 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [uint64()] as const

export const GET_L1_CONFIRMATIONS_SIGNATURE = {
  signature: "getL1Confirmations(bytes32)",
  names: ["blockHash"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ blockHash: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getL1Confirmations(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.blockHash] as const)
    const calldata = encode_function_call({
      name: "getL1Confirmations",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint64Schema, decoded)
      },
    }
  }
}
