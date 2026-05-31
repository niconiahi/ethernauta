import {
  address,
  bool,
  bytes,
  decode_function_result,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type {
  Bytes,
  Uint64,
  Uint256,
} from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint64Schema,
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

const PARAM_CODECS = [address(), bool(), bytes()] as const
const OUTPUT_CODECS = [
  uint64(),
  uint64(),
  uint256(),
  uint256(),
] as const

export const GAS_ESTIMATE_COMPONENTS_SIGNATURE = {
  signature: "gasEstimateComponents(address,bool,bytes)",
  names: ["to", "contractCreation", "data"],
}

const ParametersSchema = union([
  tuple([AddressSchema, boolean(), BytesSchema]),
  object({
    to: AddressSchema,
    contractCreation: boolean(),
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function gasEstimateComponents(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<[Uint64, Uint64, Uint256, Uint256]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters.to,
          parameters.contractCreation,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "gasEstimateComponents",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint64, Uint64, Uint256, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint64Schema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
          parse(Uint256Schema, decoded[2]),
          parse(Uint256Schema, decoded[3]),
        ]
      },
    }
  }
}
