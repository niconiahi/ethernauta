import {
  decode_function_result,
  encode_function_call,
  uint64,
  uint128,
} from "@ethernauta/abi"
import type {
  Bytes,
  Uint64,
  Uint128,
} from "@ethernauta/core"
import {
  BytesSchema,
  Uint64Schema,
  Uint128Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  uint128(),
  uint64(),
  uint64(),
] as const

export const PARAMS_SIGNATURE = {
  signature: "params()",
  names: [],
}

export function params() {
  return (
    context: ContractContext,
  ): Callable<[Uint128, Uint64, Uint64]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "params",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint128, Uint64, Uint64] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint128Schema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
          parse(Uint64Schema, decoded[2]),
        ]
      },
    }
  }
}
