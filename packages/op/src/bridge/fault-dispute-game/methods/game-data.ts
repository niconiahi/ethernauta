import {
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type {
  Bytes,
  Bytes32,
  Uint32,
} from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  uint32(),
  bytes32(),
  bytes(),
] as const

export const GAME_DATA_SIGNATURE = {
  signature: "gameData()",
  names: [],
}

export function gameData() {
  return (
    context: ContractContext,
  ): Callable<[Uint32, Bytes32, Bytes]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "gameData",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Uint32, Bytes32, Bytes] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint32Schema, decoded[0]),
          parse(Bytes32Schema, decoded[1]),
          parse(BytesSchema, decoded[2]),
        ]
      },
    }
  }
}
