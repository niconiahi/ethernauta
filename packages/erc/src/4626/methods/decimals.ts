import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint8,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Uint8 } from "@ethernauta/core"
import { uint8Schema } from "@ethernauta/core"

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
      data: bytes_to_hex(calldata),
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
