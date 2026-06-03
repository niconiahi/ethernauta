import {
  tuple as abi_tuple,
  address,
  bool,
  bytes,
  bytes32,
  decode_function_result,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type {
  Address,
  Bytes,
  Bytes32,
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [bytes32()] as const
const OUTPUT_CODECS = [
  abi_tuple({
    uid: bytes32(),
    schema: bytes32(),
    time: uint64(),
    expirationTime: uint64(),
    revocationTime: uint64(),
    refUID: bytes32(),
    recipient: address(),
    attester: address(),
    revocable: bool(),
    data: bytes(),
  }),
] as const

export const GET_ATTESTATION_SIGNATURE = {
  signature: "getAttestation(bytes32)",
  names: ["uid"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema]),
  object({ uid: Bytes32Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function getAttestation(_parameters: Parameters) {
  return (
    context: ContractContext,
  ): Callable<{
    uid: Bytes32
    schema: Bytes32
    time: Uint64
    expirationTime: Uint64
    revocationTime: Uint64
    refUID: Bytes32
    recipient: Address
    attester: Address
    revocable: boolean
    data: Bytes
  }> => {
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([parameters[0]] as const)
      : ([parameters.uid] as const)
    const calldata = encode_function_call({
      name: "getAttestation",
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
        schema: Bytes32
        time: Uint64
        expirationTime: Uint64
        revocationTime: Uint64
        refUID: Bytes32
        recipient: Address
        attester: Address
        revocable: boolean
        data: Bytes
      } => {
        const [decoded] = decode_function_result(
          OUTPUT_CODECS,
          result,
        )
        return parse(
          object({
            uid: Bytes32Schema,
            schema: Bytes32Schema,
            time: Uint64Schema,
            expirationTime: Uint64Schema,
            revocationTime: Uint64Schema,
            refUID: Bytes32Schema,
            recipient: AddressSchema,
            attester: AddressSchema,
            revocable: boolean(),
            data: BytesSchema,
          }),
          decoded,
        )
      },
    }
  }
}
