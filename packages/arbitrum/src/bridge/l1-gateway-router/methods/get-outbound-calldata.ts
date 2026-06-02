import {
  address,
  bytes,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
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

const PARAM_CODECS = [
  address(),
  address(),
  address(),
  uint256(),
  bytes(),
] as const
const OUTPUT_CODECS = [bytes()] as const

export const GET_OUTBOUND_CALLDATA_SIGNATURE = {
  signature:
    "getOutboundCalldata(address,address,address,uint256,bytes)",
  names: ["_token", "_from", "_to", "_amount", "_data"],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    _token: AddressSchema,
    _from: AddressSchema,
    _to: AddressSchema,
    _amount: Uint256Schema,
    _data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getOutboundCalldata(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
          parameters[4],
        ] as const)
      : ([
          parameters._token,
          parameters._from,
          parameters._to,
          parameters._amount,
          parameters._data,
        ] as const)
    const calldata = encode_function_call({
      name: "getOutboundCalldata",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Bytes => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(BytesSchema, decoded)
      },
    }
  }
}
