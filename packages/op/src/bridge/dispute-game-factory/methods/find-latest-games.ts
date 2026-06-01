import {
  tuple as abi_tuple,
  array,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type {
  Bytes,
  Bytes32,
  Uint64,
  Uint256,
} from "@ethernauta/core"
import {
  Bytes32Schema,
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
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  uint32(),
  uint256(),
  uint256(),
] as const
const OUTPUT_CODECS = [
  array(
    abi_tuple({
      index: uint256(),
      metadata: bytes32(),
      timestamp: uint64(),
      rootClaim: bytes32(),
      extraData: bytes(),
    }),
  ),
] as const

export const FIND_LATEST_GAMES_SIGNATURE = {
  signature: "findLatestGames(uint32,uint256,uint256)",
  names: ["_gameType", "_start", "_n"],
}

const ParametersSchema = union([
  tuple([Uint32Schema, Uint256Schema, Uint256Schema]),
  object({
    _gameType: Uint32Schema,
    _start: Uint256Schema,
    _n: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function findLatestGames(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<
    {
      index: Uint256
      metadata: Bytes32
      timestamp: Uint64
      rootClaim: Bytes32
      extraData: Bytes
    }[]
  > => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters._gameType,
          parameters._start,
          parameters._n,
        ] as const)
    const calldata = encode_function_call({
      name: "findLatestGames",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): {
        index: Uint256
        metadata: Bytes32
        timestamp: Uint64
        rootClaim: Bytes32
        extraData: Bytes
      }[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          v_array(
            object({
              index: Uint256Schema,
              metadata: Bytes32Schema,
              timestamp: Uint64Schema,
              rootClaim: Bytes32Schema,
              extraData: BytesSchema,
            }),
          ),
          decoded,
        )
      },
    }
  }
}
