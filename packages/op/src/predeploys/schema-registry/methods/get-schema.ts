import {
  tuple as abi_tuple,
  address,
  bool,
  bytes32,
  decode_function_result,
  encode_function_call,
  string_,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Bytes32,
} from "@ethernauta/core"
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
import {
  boolean,
  object,
  parse,
  string,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [
  abi_tuple({
    uid: bytes32(),
    resolver: address(),
    revocable: bool(),
    schema: string_(),
  }),
] as const

export const GET_SCHEMA_SIGNATURE = {
  signature: "getSchema(bytes32)",
  names: ["uid"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ uid: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getSchema(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<{
    uid: Bytes32
    resolver: Address
    revocable: boolean
    schema: string
  }> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.uid] as const)
    const calldata = encode_function_call({
      name: "getSchema",
      args: PARAM_CODECS,
      values,
    })
    return {
      chain_id: context.chain_id,
      to: context.to,
      data: parse(BytesSchema, bytes_to_hex(calldata)),
      decode: (
        result: Bytes,
      ): {
        uid: Bytes32
        resolver: Address
        revocable: boolean
        schema: string
      } => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          object({
            uid: Bytes32Schema,
            resolver: AddressSchema,
            revocable: boolean(),
            schema: string(),
          }),
          decoded,
        )
      },
    }
  }
}
