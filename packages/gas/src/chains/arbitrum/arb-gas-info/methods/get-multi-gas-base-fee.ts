import type { Bytes } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  array,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse, array as v_array } from "valibot"
import type { Uint256 } from "@ethernauta/core"
import {
  bytesSchema,
  uint256Schema,
} from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [array(uint256())] as const

export const GET_MULTI_GAS_BASE_FEE_SIGNATURE = {
  signature: "getMultiGasBaseFee()",
  names: [],
}

export function getMultiGasBaseFee() {
  return (
    context: ContractContext,
  ): Callable<Uint256[]> => {
    const values = [] as const
    const calldata = encode_function_call({
      name: "getMultiGasBaseFee",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(bytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint256[] => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(v_array(uint256Schema), decoded)
      },
    }
  }
}
