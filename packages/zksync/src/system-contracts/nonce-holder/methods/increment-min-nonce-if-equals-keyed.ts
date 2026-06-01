import {
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint256Schema,
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

const PARAM_CODECS = [uint256()] as const

export const INCREMENT_MIN_NONCE_IF_EQUALS_KEYED_SIGNATURE =
  {
    signature: "incrementMinNonceIfEqualsKeyed(uint256)",
    names: ["_expectedNonce"],
  }

const ParametersSchema = union([
  tuple([Uint256Schema]),
  object({ _expectedNonce: Uint256Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function incrementMinNonceIfEqualsKeyed(
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
      : ([parameters._expectedNonce] as const)
    const calldata = encode_function_call({
      name: "incrementMinNonceIfEqualsKeyed",
      args: PARAM_CODECS,
      values,
    })
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function:
            INCREMENT_MIN_NONCE_IF_EQUALS_KEYED_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
