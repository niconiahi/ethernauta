import {
  address,
  decode_function_result,
  encode_function_call,
  uint32,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint32,
  Uint64,
} from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint32Schema,
  Uint64Schema,
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
const OUTPUT_CODECS = [
  uint32(),
  uint64(),
  address(),
] as const

export const GAME_AT_INDEX_SIGNATURE = {
  signature: "gameAtIndex(uint256)",
  names: ["_index"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ _index: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function gameAtIndex(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Uint32, Uint64, Address]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._index] as const)
    const calldata = encode_function_call({
      name: "gameAtIndex",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint32, Uint64, Address] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint32Schema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
          parse(AddressSchema, decoded[2]),
        ]
      },
    }
  }
}
