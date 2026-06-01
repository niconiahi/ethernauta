import {
  address,
  decode_function_result,
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type { Bytes, Uint8 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint8Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [uint8(), uint8()] as const

export const GET_ACCOUNT_INFO_SIGNATURE = {
  signature: "getAccountInfo(address)",
  names: ["_address"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ _address: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getAccountInfo(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Uint8, Uint8]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._address] as const)
    const calldata = encode_function_call({
      name: "getAccountInfo",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Uint8, Uint8] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint8Schema, decoded[0]),
          parse(Uint8Schema, decoded[1]),
        ]
      },
    }
  }
}
