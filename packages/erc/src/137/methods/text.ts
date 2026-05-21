// https://docs.ens.domains/ensip/5 — text(node, key)

import {
  bytes32,
  decode_function_result,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { bytes32Schema } from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [bytes32(), string_()] as const
const OUTPUT_CODECS = [string_()] as const

export const TEXT_SIGNATURE: {
  signature: string
  names: string[]
} = {
  signature: "text(bytes32,string)",
  names: ["node", "key"],
}

const parametersSchema = union([
  tuple([bytes32Schema, string()]),
  object({ node: bytes32Schema, key: string() }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function text(
  _parameters: Parameters,
): (_context: ContractContext) => Callable<string> {
  return (_context: ContractContext): Callable<string> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.node, parameters.key]
    const calldata = encode_function_call({
      name: "text",
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
