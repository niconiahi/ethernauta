import {
  address,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint32,
  uint128,
  uint256,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Bytes32,
  Uint32,
  Uint128,
} from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
  Uint128Schema,
  Uint256Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [uint256()] as const
const OUTPUT_CODECS = [
  uint32(),
  address(),
  address(),
  uint128(),
  bytes32(),
  uint128(),
  uint128(),
] as const

export const CLAIM_DATA_SIGNATURE = {
  signature: "claimData(uint256)",
  names: ["arg_0"],
}

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ arg_0: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function claimData(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<
    [
      Uint32,
      Address,
      Address,
      Uint128,
      Bytes32,
      Uint128,
      Uint128,
    ]
  > => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.arg_0] as const)
    const calldata = encode_function_call({
      name: "claimData",
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
        Uint32,
        Address,
        Address,
        Uint128,
        Bytes32,
        Uint128,
        Uint128,
      ] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(Uint32Schema, decoded[0]),
          parse(AddressSchema, decoded[1]),
          parse(AddressSchema, decoded[2]),
          parse(Uint128Schema, decoded[3]),
          parse(Bytes32Schema, decoded[4]),
          parse(Uint128Schema, decoded[5]),
          parse(Uint128Schema, decoded[6]),
        ]
      },
    }
  }
}
