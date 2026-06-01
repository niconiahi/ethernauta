import {
  bool,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { BytesSchema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { boolean, parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bool()] as const

export const MIGRATION_PAUSED_SIGNATURE = {
  signature: "migrationPaused()",
  names: [],
}

export function migrationPaused() {
  return (context: ContractContext): Callable<boolean> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "migrationPaused",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
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
