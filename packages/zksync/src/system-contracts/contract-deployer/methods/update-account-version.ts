import {
  encode_function_call,
  uint8,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint8Schema,
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

const PARAM_CODECS = [uint8()] as const

export const UPDATE_ACCOUNT_VERSION_SIGNATURE = {
  signature: "updateAccountVersion(uint8)",
  names: ["_version"],
}

const ParametersSchema = union([
  tuple([Uint8Schema]),
  object({ _version: Uint8Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function updateAccountVersion(
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
      ? ([parameters[0]] as const)
      : ([parameters._version] as const)
    const calldata = encode_function_call({
      name: "updateAccountVersion",
      args: PARAM_CODECS,
      values,
    })
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: UPDATE_ACCOUNT_VERSION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
