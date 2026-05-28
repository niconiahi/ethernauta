import {
  decode_function_result,
  encode_function_call,
  string_,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
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

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [string_()] as const

export const TOKEN_URI_SIGNATURE = {
  signature: "tokenURI(uint256)",
  names: ["tokenId"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ tokenId: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function tokenURI(_parameters: Parameters) {
  return (context: ContractContext): Callable<string> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.tokenId] as const)
    const calldata = encode_function_call({
      name: "tokenURI",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): string => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(string(), decoded)
      },
    }
  }
}
