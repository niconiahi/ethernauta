import {
  address,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
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

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [address()] as const

export const LOOKUP_INDEX_SIGNATURE = {
  signature: "lookupIndex(uint256)",
  names: ["index"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ index: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function lookupIndex(_parameters: Parameters) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.index] as const)
    const calldata = encode_function_call({
      name: "lookupIndex",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Address => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(AddressSchema, decoded)
      },
    }
  }
}
