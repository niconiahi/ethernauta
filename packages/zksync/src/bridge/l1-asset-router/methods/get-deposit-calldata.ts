import {
  address,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
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
  bytes(),
] as const
const OUTPUT_CODECS = [bytes()] as const

export const GET_DEPOSIT_CALLDATA_SIGNATURE = {
  signature: "getDepositCalldata(address,bytes32,bytes)",
  names: ["_sender", "_assetId", "_assetData"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Bytes32Schema, BytesSchema]),
  object({
    _sender: AddressSchema,
    _assetId: Bytes32Schema,
    _assetData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getDepositCalldata(
  _parameters: Parameters,
) {
  return (context: ContractContext): Callable<Bytes> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters._sender,
          parameters._assetId,
          parameters._assetData,
        ] as const)
    const calldata = encode_function_call({
      name: "getDepositCalldata",
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
