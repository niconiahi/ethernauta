import {
  address,
  bytes,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [bytes()] as const

export const GET_CODE_SIGNATURE = {
  signature: "getCode(address)",
  names: ["account"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ account: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getCode(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.account] as const)
    const calldata = encode_function_call({
      name: "getCode",
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
