import {
  array,
  decode_function_result,
  encode_function_call,
  fixed_array,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import { BytesSchema, Uint64Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse, tuple, array as v_array } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  array(fixed_array(uint64(), 3)),
] as const

export const GET_GAS_PRICING_CONSTRAINTS_SIGNATURE = {
  signature: "getGasPricingConstraints()",
  names: [],
}

export function getGasPricingConstraints() {
  return (
    context: ContractContext,
  ): Callable<[Uint64, Uint64, Uint64][]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getGasPricingConstraints",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [Uint64, Uint64, Uint64][] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          v_array(
            tuple([
              Uint64Schema,
              Uint64Schema,
              Uint64Schema,
            ]),
          ),
          decoded,
        )
      },
    }
  }
}
