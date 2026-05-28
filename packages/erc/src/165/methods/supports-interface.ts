import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bool,
  bytes4,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"
import { Bytes4Schema, BytesSchema } from "@ethernauta/core"

const PARAM_CODECS = [bytes4()] as const
const OUTPUT_CODECS = [bool()] as const

export const SUPPORTS_INTERFACE_SIGNATURE = {
  signature: "supportsInterface(bytes4)",
  names: ["interfaceId"],
}

const ParametersSchema = union([
  tuple([Bytes4Schema]),
  object({ interfaceId: Bytes4Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function supportsInterface(_parameters: Parameters) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.interfaceId] as const)
    const calldata = encode_function_call({
      name: "supportsInterface",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
