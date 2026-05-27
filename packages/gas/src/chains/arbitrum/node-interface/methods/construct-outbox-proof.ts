import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  array,
  bytes32,
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"
import type { Bytes32 } from "@ethernauta/core"
import {
  bytes32Schema,
  bytesSchema,
  uint64Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [uint64(), uint64()] as const
const OUTPUT_CODECS = [
  bytes32(),
  bytes32(),
  array(bytes32()),
] as const

export const CONSTRUCT_OUTBOX_PROOF_SIGNATURE = {
  signature: "constructOutboxProof(uint64,uint64)",
  names: ["size", "leaf"],
}

const parametersSchema = union([
  tuple([uint64Schema, uint64Schema]),
  object({ size: uint64Schema, leaf: uint64Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function constructOutboxProof(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<[Bytes32, Bytes32, Bytes32[]]> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.size, parameters.leaf] as const)
    const calldata = encode_function_call({
      name: "constructOutboxProof",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Bytes32, Bytes32, Bytes32[]] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(bytes32Schema, decoded[0]),
          parse(bytes32Schema, decoded[1]),
          parse(v_array(bytes32Schema), decoded[2]),
        ]
      },
    }
  }
}
