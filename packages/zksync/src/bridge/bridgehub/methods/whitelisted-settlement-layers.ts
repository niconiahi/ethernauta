import {
  bool,
  decode_function_result,
  encode_function_call,
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
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [bool()] as const

export const WHITELISTED_SETTLEMENT_LAYERS_SIGNATURE = {
  signature: "whitelistedSettlementLayers(uint256)",
  names: ["chainId"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ chainId: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function whitelistedSettlementLayers(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<boolean> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.chainId] as const)
    const calldata = encode_function_call({
      name: "whitelistedSettlementLayers",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
