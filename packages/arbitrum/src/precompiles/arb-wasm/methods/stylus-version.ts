import {
  decode_function_result,
  encode_function_call,
  uint16,
} from "@ethernauta/abi"
import type { Bytes, Uint16 } from "@ethernauta/core"
import { BytesSchema, Uint16Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint16()] as const

export const STYLUS_VERSION_SIGNATURE = {
  signature: "stylusVersion()",
  names: [],
}

export function stylusVersion() {
  return (context: ContractContext): Callable<Uint16> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "stylusVersion",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint16 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint16Schema, decoded)
      },
    }
  }
}
