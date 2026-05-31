import {
  address,
  array,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Bytes32,
  Uint256,
} from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [uint256(), uint64()] as const
const OUTPUT_CODECS = [
  array(bytes32()),
  uint256(),
  address(),
  address(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  bytes(),
] as const

export const LEGACY_LOOKUP_MESSAGE_BATCH_PROOF_SIGNATURE = {
  signature:
    "legacyLookupMessageBatchProof(uint256,uint64)",
  names: ["batchNum", "index"],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Uint64Schema]),
  object({ batchNum: Uint256Schema, index: Uint64Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function legacyLookupMessageBatchProof(
  _parameters: Parameters,
) {
  return (
    context: ContractContext,
  ): Callable<
    [
      Bytes32[],
      Uint256,
      Address,
      Address,
      Uint256,
      Uint256,
      Uint256,
      Uint256,
      Bytes,
    ]
  > => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.batchNum, parameters.index] as const)
    const calldata = encode_function_call({
      name: "legacyLookupMessageBatchProof",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): [
        Bytes32[],
        Uint256,
        Address,
        Address,
        Uint256,
        Uint256,
        Uint256,
        Uint256,
        Bytes,
      ] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(v_array(Bytes32Schema), decoded[0]),
          parse(Uint256Schema, decoded[1]),
          parse(AddressSchema, decoded[2]),
          parse(AddressSchema, decoded[3]),
          parse(Uint256Schema, decoded[4]),
          parse(Uint256Schema, decoded[5]),
          parse(Uint256Schema, decoded[6]),
          parse(Uint256Schema, decoded[7]),
          parse(BytesSchema, decoded[8]),
        ]
      },
    }
  }
}
