import {
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import { BytesSchema, Uint64Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint64()] as const

export const GET_BROTLI_COMPRESSION_LEVEL_SIGNATURE = {
  signature: "getBrotliCompressionLevel()",
  names: [],
}

export function getBrotliCompressionLevel() {
  return (context: ContractContext): Callable<Uint64> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getBrotliCompressionLevel",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint64Schema, decoded)
      },
    }
  }
}
