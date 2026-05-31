import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes, Uint32 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [uint32()] as const

export const CODEHASH_ASM_SIZE_SIGNATURE = {
  signature: "codehashAsmSize(bytes32)",
  names: ["codehash"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ codehash: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function codehashAsmSize(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.codehash] as const)
    const calldata = encode_function_call({
      name: "codehashAsmSize",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint32Schema, decoded)
      },
    }
  }
}
