import {
  bytes,
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
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bytes()] as const

export const EXTRA_DATA_SIGNATURE = {
  signature: "extraData()",
  names: [],
}

export function extraData() {
  return (context: ContractContext): Callable<Bytes> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "extraData",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(BytesSchema, decoded)
      },
    }
  }
}
