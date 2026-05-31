import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint16,
} from "@ethernauta/abi"
import type { Bytes, Uint16 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint16Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [uint16()] as const

export const CODEHASH_VERSION_SIGNATURE = {
  signature: "codehashVersion(bytes32)",
  names: ["codehash"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ codehash: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function codehashVersion(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint16> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.codehash] as const)
    const calldata = encode_function_call({
      name: "codehashVersion",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint16 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint16Schema, decoded)
      },
    }
  }
}
