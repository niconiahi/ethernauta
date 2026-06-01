import {
  bytes32,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [bytes32()] as const

export const CTM_ASSET_ID_FROM_CHAIN_ID_SIGNATURE = {
  signature: "ctmAssetIdFromChainId(uint256)",
  names: ["_chainId"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ _chainId: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function ctmAssetIdFromChainId(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters._chainId] as const)
    const calldata = encode_function_call({
      name: "ctmAssetIdFromChainId",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes32 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Bytes32Schema, decoded)
      },
    }
  }
}
