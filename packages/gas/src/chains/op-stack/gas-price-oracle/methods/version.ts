import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  string_,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse, string } from "valibot"
import { BytesSchema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [string_()] as const

export const VERSION_SIGNATURE = {
  signature: "version()",
  names: [],
}

export function version() {
  return (context: ContractContext): Callable<string> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "version",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): string => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(string(), decoded)
      },
    }
  }
}
