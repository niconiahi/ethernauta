import {
  address,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes, Uint64 } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
} from "@ethernauta/core"
import type {
  Callable,
  ContractContext,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [address(), bytes32()] as const
const OUTPUT_CODECS = [uint64()] as const

export const GET_REVOKE_OFFCHAIN_SIGNATURE = {
  signature: "getRevokeOffchain(address,bytes32)",
  names: ["revoker", "data"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Bytes32Schema]),
  object({ revoker: AddressSchema, data: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getRevokeOffchain(_parameters: Parameters) {
  return (context: ContractContext): Callable<Uint64> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.revoker, parameters.data] as const)
    const calldata = encode_function_call({
      name: "getRevokeOffchain",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): Uint64 => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(Uint64Schema, decoded)
      },
    }
  }
}
