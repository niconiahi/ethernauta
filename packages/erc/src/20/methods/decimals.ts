import {
  decode_function_result,
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type { Bytes, Uint256 } from "@ethernauta/core"
import { uint256Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import { parse } from "valibot"

const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [uint8()] as const

export const DECIMALS_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "decimals()",
  names: [],
}

export function decimals(): (
  _context: ContractContext,
) => Callable<Uint256> {
  return (_context: ContractContext): Callable<Uint256> => {
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "decimals",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): Uint256 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(uint256Schema, decoded)
      },
    }
  }
}
