import {
  address,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes, Bytes32 } from "@ethernauta/core"
import {
  AddressSchema,
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

const PARAM_CODECS = [
  address(),
  address(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  bytes(),
] as const
const OUTPUT_CODECS = [bytes32()] as const

export const CALCULATE_ITEM_HASH_SIGNATURE = {
  signature:
    "calculateItemHash(address,address,uint256,uint256,uint256,uint256,bytes)",
  names: [
    "l2Sender",
    "to",
    "l2Block",
    "l1Block",
    "l2Timestamp",
    "value",
    "data",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    l2Sender: AddressSchema,
    to: AddressSchema,
    l2Block: Uint256Schema,
    l1Block: Uint256Schema,
    l2Timestamp: Uint256Schema,
    value: Uint256Schema,
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function calculateItemHash(_parameters: Parameters) {
  return (context: ContractContext): Callable<Bytes32> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
          parameters[4],
          parameters[5],
          parameters[6],
        ] as const)
      : ([
          parameters.l2Sender,
          parameters.to,
          parameters.l2Block,
          parameters.l1Block,
          parameters.l2Timestamp,
          parameters.value,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "calculateItemHash",
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
