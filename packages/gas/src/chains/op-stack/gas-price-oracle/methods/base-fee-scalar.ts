import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Uint32 } from "@ethernauta/core"
import { bytesSchema, uint32Schema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint32()] as const

export const BASE_FEE_SCALAR_SIGNATURE = {
  signature: "baseFeeScalar()",
  names: [],
}

export function baseFeeScalar() {
  return (context: ContractContext): Callable<Uint32> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "baseFeeScalar",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint32Schema, decoded)
      },
    }
  }
}
