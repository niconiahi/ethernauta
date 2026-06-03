import {
  decode_function_result,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { BytesSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse, string } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [string_()] as const

export const NAME_SIGNATURE = {
  signature: "name()",
  names: [],
}

export function name() {
  return (context: ContractContext): Callable<string> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "name",
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
