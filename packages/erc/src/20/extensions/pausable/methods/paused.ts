import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { boolean, parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bool()] as const

export const PAUSED_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "paused()",
  names: [],
}

export function paused() {
  return (context: ContractContext): Callable<boolean> => {
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "paused",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
