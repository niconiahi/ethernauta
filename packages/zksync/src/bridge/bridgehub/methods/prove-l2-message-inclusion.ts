import {
  tuple as abi_tuple,
  address,
  array,
  bool,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint16,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint16Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  boolean,
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  uint256(),
  uint256(),
  uint256(),
  abi_tuple({
    txNumberInBatch: uint16(),
    sender: address(),
    data: bytes(),
  }),
  array(bytes32()),
] as const
const OUTPUT_CODECS = [bool()] as const

export const PROVE_L2_MESSAGE_INCLUSION_SIGNATURE = {
  signature:
    "proveL2MessageInclusion(uint256,uint256,uint256,(uint16,address,bytes),bytes32[])",
  names: [
    "_chainId",
    "_batchNumber",
    "_index",
    "_message",
    "_proof",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    object({
      txNumberInBatch: Uint16Schema,
      sender: AddressSchema,
      data: BytesSchema,
    }),
    v_array(Bytes32Schema),
  ]),
  object({
    _chainId: Uint256Schema,
    _batchNumber: Uint256Schema,
    _index: Uint256Schema,
    _message: object({
      txNumberInBatch: Uint16Schema,
      sender: AddressSchema,
      data: BytesSchema,
    }),
    _proof: v_array(Bytes32Schema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function proveL2MessageInclusion(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<boolean> => {
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
          parameters._chainId,
          parameters._batchNumber,
          parameters._index,
          parameters._message,
          parameters._proof,
        ] as const)
    const calldata = encode_function_call({
      name: "proveL2MessageInclusion",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): boolean => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(boolean(), decoded)
      },
    }
  }
}
