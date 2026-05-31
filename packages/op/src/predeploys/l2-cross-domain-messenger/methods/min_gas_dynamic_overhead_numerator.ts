import {
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import { BytesSchema, Uint64Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint64()] as const

export const MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR_SIGNATURE =
  {
    signature: "MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR()",
    names: [],
  }

export function MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR() {
  return (context: ContractContext): Callable<Uint64> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "MIN_GAS_DYNAMIC_OVERHEAD_NUMERATOR",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint64Schema, decoded)
      },
    }
  }
}
