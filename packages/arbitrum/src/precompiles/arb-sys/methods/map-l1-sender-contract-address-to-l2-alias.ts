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

const PARAM_CODECS = [address(), address()] as const
const OUTPUT_CODECS = [address()] as const

export const MAP_L1_SENDER_CONTRACT_ADDRESS_TO_L2_ALIAS_SIGNATURE =
  {
    signature:
      "mapL1SenderContractAddressToL2Alias(address,address)",
    names: ["sender", "unused"],
  }

const ParametersSchema = union([
  tuple([AddressSchema, AddressSchema]),
  object({ sender: AddressSchema, unused: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function mapL1SenderContractAddressToL2Alias(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.sender, parameters.unused] as const)
    const calldata = encode_function_call({
      name: "mapL1SenderContractAddressToL2Alias",
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
