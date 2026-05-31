import {
  address,
  bytes,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint256,
} from "@ethernauta/core"
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
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes(), uint256()] as const
const OUTPUT_CODECS = [address(), uint256()] as const

export const DECOMPRESS_SIGNATURE = {
  signature: "decompress(bytes,uint256)",
  names: ["buf", "offset"],
}

const ParametersSchema = union([
  tuple([BytesSchema, Uint256Schema]),
  object({ buf: BytesSchema, offset: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function decompress(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Address, Uint256]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.buf, parameters.offset] as const)
    const calldata = encode_function_call({
      name: "decompress",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(Uint256Schema, decoded[1]),
        ]
      },
    }
  }
}
