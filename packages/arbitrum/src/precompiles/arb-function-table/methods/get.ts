import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [address(), uint256()] as const
const OUTPUT_CODECS = [
  uint256(),
  bool(),
  uint256(),
] as const

export const GET_SIGNATURE = {
  signature: "get(address,uint256)",
  names: ["addr", "index"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema]),
  object({ addr: AddressSchema, index: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function get(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Uint256, boolean, Uint256]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.addr, parameters.index] as const)
    const calldata = encode_function_call({
      name: "get",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint256, boolean, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint256Schema, decoded[0]),
          parse(boolean(), decoded[1]),
          parse(Uint256Schema, decoded[2]),
        ]
      },
    }
  }
}
