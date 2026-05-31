import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [address(), bool()] as const

export const GET_PREFERRED_AGGREGATOR_SIGNATURE = {
  signature: "getPreferredAggregator(address)",
  names: ["addr"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ addr: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getPreferredAggregator(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<[Address, boolean]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.addr] as const)
    const calldata = encode_function_call({
      name: "getPreferredAggregator",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, boolean] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(boolean(), decoded[1]),
        ]
      },
    }
  }
}
