// https://docs.ens.domains/ensip/10

import {
  bytes,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { Bytes4Schema, BytesSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

// ERC-165 interface ID for `resolve(bytes,bytes)` —
// `bytes4(keccak256("resolve(bytes,bytes)"))`.
export const ENSIP10_INTERFACE_ID = parse(
  Bytes4Schema,
  "0x9061b923",
)

const PARAM_CODECS = [bytes(), bytes()] as const
const OUTPUT_CODECS = [bytes()] as const

const ParametersSchema = union([
  tuple([BytesSchema, BytesSchema]),
  object({ name: BytesSchema, data: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function resolve(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.name, parameters.data] as const)
    const calldata = encode_function_call({
      name: "resolve",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(BytesSchema, decoded)
      },
    }
  }
}
