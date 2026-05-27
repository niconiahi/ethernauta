import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  uint64,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Uint64 } from "@ethernauta/core"
import { bytesSchema, uint64Schema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint64()] as const

export const GET_L1_BASE_FEE_ESTIMATE_INERTIA_SIGNATURE = {
  signature: "getL1BaseFeeEstimateInertia()",
  names: [],
}

export function getL1BaseFeeEstimateInertia() {
  return (context: ContractContext): Callable<Uint64> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getL1BaseFeeEstimateInertia",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(uint64Schema, decoded)
      },
    }
  }
}
