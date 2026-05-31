import {
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import {
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
] as const

export const GET_STATS_SIGNATURE = {
  signature: "getStats()",
  names: [],
}

export function getStats() {
  return (
    context: ContractContext,
  ): Callable<
    [Uint256, Uint256, Uint256, Uint256, Uint256, Uint256]
  > => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getStats",
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
