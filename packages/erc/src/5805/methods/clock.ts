import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint48,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Uint48 } from "@ethernauta/core"
import { uint48Schema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint48()] as const

export const CLOCK_SIGNATURE = {
  signature: "clock()",
  names: [],
}



export function clock() {
  return (context: ContractContext): Callable<Uint48> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "clock",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Uint48 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint48Schema, decoded)
      },
    }
  }
}
