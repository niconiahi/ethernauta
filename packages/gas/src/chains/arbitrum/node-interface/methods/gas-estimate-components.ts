import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  bool,
  bytes,
  uint256,
  uint64,
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
import type { Uint256, Uint64 } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
  uint256Schema,
  uint64Schema,
} from "@ethernauta/core"

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

const parametersSchema = union([
  tuple([addressSchema, boolean(), bytesSchema]),
  object({
    to: addressSchema,
    contractCreation: boolean(),
    data: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function gasEstimateComponents(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<[Uint64, Uint64, Uint256, Uint256]> => {
    const parameters = parse(parametersSchema, _parameters)
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
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint64, Uint64, Uint256, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(uint64Schema, decoded[0]),
          parse(uint64Schema, decoded[1]),
          parse(uint256Schema, decoded[2]),
          parse(uint256Schema, decoded[3]),
        ]
      },
    }
  }
}
