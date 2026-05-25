import {
  decode_function_result,
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type { Bytes, Uint8 } from "@ethernauta/core"
import { bytesSchema, uint8Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint8()] as const

export const DECIMALS_SIGNATURE = {
  signature: "decimals()",
  names: [],
}

export function decimals() {
  return (context: ContractContext): Callable<Uint8> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "decimals",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint8 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint8Schema, decoded)
      },
    }
  }
}
