import {
  address,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Uint64,
} from "@ethernauta/core"
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

const PARAM_CODECS = [bytes32(), address()] as const
const OUTPUT_CODECS = [address(), uint64()] as const

export const PROVEN_WITHDRAWALS_SIGNATURE = {
  signature: "provenWithdrawals(bytes32,address)",
  names: ["arg_0", "arg_1"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema, AddressSchema]),
  object({ arg_0: Bytes32Schema, arg_1: AddressSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function provenWithdrawals(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<[Address, Uint64]> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0], parameters[1]] as const)
      : ([parameters.arg_0, parameters.arg_1] as const)
    const calldata = encode_function_call({
      name: "provenWithdrawals",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (result: Bytes): [Address, Uint64] => {
        const decoded = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return [
          parse(AddressSchema, decoded[0]),
          parse(Uint64Schema, decoded[1]),
        ]
      },
    }
  }
}
