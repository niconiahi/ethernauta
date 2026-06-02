import {
  decode_function_result,
  encode_function_call,
  uint128,
} from "@ethernauta/abi"
import type { Bytes, Uint128 } from "@ethernauta/core"
import {
  BytesSchema,
  Uint128Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint128()] as const

export const OUTBOX_VERSION_SIGNATURE = {
  signature: "OUTBOX_VERSION()",
  names: [],
}

export function OUTBOX_VERSION() {
  return (context: ContractContext): Callable<Uint128> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "OUTBOX_VERSION",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint128 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint128Schema, decoded)
      },
    }
  }
}
