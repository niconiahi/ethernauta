import {
  address,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
  uint64,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint64,
} from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
  Uint64Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint32(), bytes32(), bytes()] as const
const OUTPUT_CODECS = [address(), uint64()] as const

export const GAMES_SIGNATURE = {
  signature: "games(uint32,bytes32,bytes)",
  names: ["_gameType", "_rootClaim", "_extraData"],
}

const ParametersSchema = union([
  tuple([Uint32Schema, Bytes32Schema, BytesSchema]),
  object({
    _gameType: Uint32Schema,
    _rootClaim: Bytes32Schema,
    _extraData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function games(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Address, Uint64]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters._gameType,
          parameters._rootClaim,
          parameters._extraData,
        ] as const)
    const calldata = encode_function_call({
      name: "games",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, Uint64] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
        ]
      },
    }
  }
}
