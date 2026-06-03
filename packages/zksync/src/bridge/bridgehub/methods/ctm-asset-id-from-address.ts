import {
  address,
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address()] as const
const OUTPUT_CODECS = [bytes32()] as const

export const CTM_ASSET_ID_FROM_ADDRESS_SIGNATURE = {
  signature: "ctmAssetIdFromAddress(address)",
  names: ["ctmAddress"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ ctmAddress: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function ctmAssetIdFromAddress(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.ctmAddress] as const)
    const calldata = encode_function_call({
      name: "ctmAssetIdFromAddress",
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
