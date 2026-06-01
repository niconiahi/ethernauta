import {
  address,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
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

const PARAM_CODECS = [address(), uint256()] as const
const OUTPUT_CODECS = [address()] as const

export const GET_NEW_ADDRESS_CREATE_SIGNATURE = {
  signature: "getNewAddressCreate(address,uint256)",
  names: ["_sender", "_senderNonce"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema]),
  object({
    _sender: AddressSchema,
    _senderNonce: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getNewAddressCreate(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters._sender,
          parameters._senderNonce,
        ] as const)
    const calldata = encode_function_call({
      name: "getNewAddressCreate",
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
