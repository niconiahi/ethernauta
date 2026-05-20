import type { Bytes, Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse } from "valibot"
import type { Bytes32 } from "@ethernauta/core"
import { bytes32Schema } from "@ethernauta/core"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [bytes32()] as const

export const DOMAIN_SEPARATOR_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "DOMAIN_SEPARATOR()",
  names: [],
}



export function DOMAIN_SEPARATOR()
: (_context: ContractContext) => Callable<Bytes32> {
  return (
    _context: ContractContext,
  ): Callable<Bytes32> => {
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "DOMAIN_SEPARATOR",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(bytes32Schema, decoded)
      },
    }
  }
}
