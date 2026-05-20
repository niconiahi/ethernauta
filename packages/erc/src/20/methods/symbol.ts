import type { Bytes, Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  string_,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import { parse, string } from "valibot"


const PARAM_CODECS = [] as const
const OUTPUT_CODECS = [string_()] as const

export const SYMBOL_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "symbol()",
  names: [],
}



export function symbol()
: (_context: ContractContext) => Callable<string> {
  return (
    _context: ContractContext,
  ): Callable<string> => {
    const values: unknown[] = []
    const calldata = encode_function_call({
      name: "symbol",
      args: PARAM_CODECS,
      values: values as never,
    })
    return {
      chain_id: _context.chain_id,
      to: _context.to,
      data: bytes_to_hex(calldata),
      decode: (_result: Bytes): string => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          _result,
        )
        return parse(string(), decoded)
      },
    }
  }
}
