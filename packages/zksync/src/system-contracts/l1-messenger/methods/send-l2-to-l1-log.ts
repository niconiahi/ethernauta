import {
  bool,
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [bool(), bytes32(), bytes32()] as const

export const SEND_L2_TO_L1_LOG_SIGNATURE = {
  signature: "sendL2ToL1Log(bool,bytes32,bytes32)",
  names: ["_isService", "_key", "_value"],
}

const ParametersSchema = union([
  tuple([boolean(), Bytes32Schema, Bytes32Schema]),
  object({
    _isService: boolean(),
    _key: Bytes32Schema,
    _value: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function sendL2ToL1Log(
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
          parameters._isService,
          parameters._key,
          parameters._value,
        ] as const)
    const calldata = encode_function_call({
      name: "sendL2ToL1Log",
      args: PARAM_CODECS,
      values,
    })
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: SEND_L2_TO_L1_LOG_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
