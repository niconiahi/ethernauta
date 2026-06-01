import {
  bytes,
  bytes32,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  bytes32(),
  bytes32(),
  bytes(),
] as const

export const CREATE2_SIGNATURE = {
  signature: "create2(bytes32,bytes32,bytes)",
  names: ["_salt", "_bytecodeHash", "_input"],
}

const ParametersSchema = union([
  tuple([Bytes32Schema, Bytes32Schema, BytesSchema]),
  object({
    _salt: Bytes32Schema,
    _bytecodeHash: Bytes32Schema,
    _input: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function create2(
  _parameters: Parameters,
): Signable<Bytes> {
  return async ([
    signer,
    context,
  ]: ResolvedSigner): Promise<Bytes> => {
    if (!context.to)
      throw new Error(
        "contract Signable requires a 'to' on the signer resolver",
      )
    const parameters = parse(ParametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
        ] as const)
      : ([
          parameters._salt,
          parameters._bytecodeHash,
          parameters._input,
        ] as const)
    const calldata = encode_function_call({
      name: "create2",
      args: PARAM_CODECS,
      values,
    })
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: { function: CREATE2_SIGNATURE },
      },
    ])([signer, context])
  }
}
