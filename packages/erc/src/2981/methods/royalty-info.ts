import {
  address,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint256,
} from "@ethernauta/core"
import {
  AddressSchema,
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

const PARAM_CODECS = [uint256(), uint256()] as const
const OUTPUT_CODECS = [address(), uint256()] as const

export const ROYALTY_INFO_SIGNATURE = {
  signature: "royaltyInfo(uint256,uint256)",
  names: ["tokenId", "salePrice"],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Uint256Schema]),
  object({
    tokenId: Uint256Schema,
    salePrice: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function royaltyInfo(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Address, Uint256]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters.tokenId,
          parameters.salePrice,
        ] as const)
    const calldata = encode_function_call({
      name: "royaltyInfo",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, Uint256] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(Uint256Schema, decoded[1]),
        ]
      },
    }
  }
}
