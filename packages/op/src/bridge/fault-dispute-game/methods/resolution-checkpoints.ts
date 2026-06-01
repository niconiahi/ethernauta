import {
  address,
  bool,
  decode_function_result,
  encode_function_call,
  uint32,
  uint128,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint32,
  Uint128,
} from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint32Schema,
  Uint128Schema,
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

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [
  bool(),
  uint32(),
  uint128(),
  address(),
] as const

export const RESOLUTION_CHECKPOINTS_SIGNATURE = {
  signature: "resolutionCheckpoints(uint256)",
  names: ["arg_0"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ arg_0: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function resolutionCheckpoints(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<[boolean, Uint32, Uint128, Address]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.arg_0] as const)
    const calldata = encode_function_call({
      name: "resolutionCheckpoints",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [boolean, Uint32, Uint128, Address] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(boolean(), decoded[0]),
          parse(Uint32Schema, decoded[1]),
          parse(Uint128Schema, decoded[2]),
          parse(AddressSchema, decoded[3]),
        ]
      },
    }
  }
}
