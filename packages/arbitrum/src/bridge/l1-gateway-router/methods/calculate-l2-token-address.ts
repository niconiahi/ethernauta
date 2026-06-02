import {
  address,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
const OUTPUT_CODECS = [address()] as const

export const CALCULATE_L2_TOKEN_ADDRESS_SIGNATURE = {
  signature: "calculateL2TokenAddress(address)",
  names: ["l1ERC20"],
}

const ParametersSchema = union([
  tuple([AddressSchema]),
  object({ l1ERC20: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function calculateL2TokenAddress(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.l1ERC20] as const)
    const calldata = encode_function_call({
      name: "calculateL2TokenAddress",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Address => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(AddressSchema, decoded)
      },
    }
  }
}
