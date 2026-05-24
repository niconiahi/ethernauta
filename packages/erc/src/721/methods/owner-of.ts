import type { Bytes } from "@ethernauta/core"
import type { Callable, ContractContext } from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import {
  address,
  uint256,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"
import type { Address } from "@ethernauta/core"
import { addressSchema, uint256Schema } from "@ethernauta/core"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [address()] as const

export const OWNER_OF_SIGNATURE = {
  signature: "ownerOf(uint256)",
  names: ["tokenId"],
}

const parametersSchema = union([
  tuple([uint256Schema]),
  object({ tokenId: uint256Schema }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function ownerOf(_parameters: Parameters) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [parameters.tokenId]
    const calldata = encode_function_call({
      name: "ownerOf",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: bytes_to_hex(calldata),
      decode: (result: Bytes): Address => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(addressSchema, decoded)
      },
    }
  }
}
