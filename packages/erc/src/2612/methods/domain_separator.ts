import {
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import { bytes32Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bytes32()] as const

export const DOMAIN_SEPARATOR_SIGNATURE = {
  signature: "DOMAIN_SEPARATOR()",
  names: [],
}

export function DOMAIN_SEPARATOR() {
  return (context: ContractContext): Callable<Bytes32> => {
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "DOMAIN_SEPARATOR",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(bytes32Schema, decoded)
      },
    }
  }
}
