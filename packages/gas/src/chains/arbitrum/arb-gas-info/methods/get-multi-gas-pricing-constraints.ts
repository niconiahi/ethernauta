import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  tuple as abi_tuple,
  array,
  uint32,
  uint64,
  uint8,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { object, parse, array as v_array } from "valibot"
import type {
  Uint32,
  Uint64,
  Uint8,
} from "@ethernauta/core"
import {
  bytesSchema,
  uint32Schema,
  uint64Schema,
  uint8Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [
  array(
    abi_tuple({
      resources: array(
        abi_tuple({ resource: uint8(), weight: uint64() }),
      ),
      adjustmentWindowSecs: uint32(),
      targetPerSec: uint64(),
      backlog: uint64(),
    }),
  ),
] as const

export const GET_MULTI_GAS_PRICING_CONSTRAINTS_SIGNATURE = {
  signature: "getMultiGasPricingConstraints()",
  names: [],
}

export function getMultiGasPricingConstraints() {
  return (
    context: ContractContext,
  ): Callable<
    {
      resources: { resource: Uint8; weight: Uint64 }[]
      adjustmentWindowSecs: Uint32
      targetPerSec: Uint64
      backlog: Uint64
    }[]
  > => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getMultiGasPricingConstraints",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): {
        resources: { resource: Uint8; weight: Uint64 }[]
        adjustmentWindowSecs: Uint32
        targetPerSec: Uint64
        backlog: Uint64
      }[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          v_array(
            object({
              resources: v_array(
                object({
                  resource: uint8Schema,
                  weight: uint64Schema,
                }),
              ),
              adjustmentWindowSecs: uint32Schema,
              targetPerSec: uint64Schema,
              backlog: uint64Schema,
            }),
          ),
          decoded,
        )
      },
    }
  }
}
