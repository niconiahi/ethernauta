import {
  address,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Address, Bytes } from "@ethernauta/core"
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

const PARAM_CODECS = [
  address(),
  bytes32(),
  bytes32(),
  bytes(),
] as const
const OUTPUT_CODECS = [address()] as const

export const GET_NEW_ADDRESS_CREATE2_SIGNATURE = {
  signature:
    "getNewAddressCreate2(address,bytes32,bytes32,bytes)",
  names: ["_sender", "_bytecodeHash", "_salt", "_input"],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    Bytes32Schema,
    Bytes32Schema,
    BytesSchema,
  ]),
  object({
    _sender: AddressSchema,
    _bytecodeHash: Bytes32Schema,
    _salt: Bytes32Schema,
    _input: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getNewAddressCreate2(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Address> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
        ] as const)
      : ([
          parameters._sender,
          parameters._bytecodeHash,
          parameters._salt,
          parameters._input,
        ] as const)
    const calldata = encode_function_call({
      name: "getNewAddressCreate2",
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
