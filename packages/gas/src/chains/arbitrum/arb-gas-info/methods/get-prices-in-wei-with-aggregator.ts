import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
] as const

export const GET_PRICES_IN_WEI_WITH_AGGREGATOR_SIGNATURE = {
  signature: "getPricesInWeiWithAggregator(address)",
  names: ["aggregator"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ aggregator: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getPricesInWeiWithAggregator(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<
    [Uint256, Uint256, Uint256, Uint256, Uint256, Uint256]
  > => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.aggregator] as const)
    const calldata = encode_function_call({
      name: "getPricesInWeiWithAggregator",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [
        Uint256,
        Uint256,
        Uint256,
        Uint256,
        Uint256,
        Uint256,
      ] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint256Schema, decoded[0]),
          parse(Uint256Schema, decoded[1]),
          parse(Uint256Schema, decoded[2]),
          parse(Uint256Schema, decoded[3]),
          parse(Uint256Schema, decoded[4]),
          parse(Uint256Schema, decoded[5]),
        ]
      },
    }
  }
}
