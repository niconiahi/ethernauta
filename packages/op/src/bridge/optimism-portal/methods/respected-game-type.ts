import {
  decode_function_result,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes, Uint32 } from "@ethernauta/core"
import { BytesSchema, Uint32Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint32()] as const

export const RESPECTED_GAME_TYPE_SIGNATURE = {
  signature: "respectedGameType()",
  names: [],
}

export function respectedGameType() {
  return (context: ContractContext): Callable<Uint32> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "respectedGameType",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint32Schema, decoded)
      },
    }
  }
}
