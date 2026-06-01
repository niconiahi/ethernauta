import {
  bytes,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import { BytesSchema, UintSchema } from "@ethernauta/core"
import { eth_signTransaction } from "@ethernauta/eth"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import { bytes_to_hex } from "@ethernauta/utils"
import type { InferOutput } from "valibot"
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [bytes()] as const

export const CREATE_EVM_SIGNATURE = {
  signature: "createEVM(bytes)",
  names: ["_initCode"],
}

const ParametersSchema = union([
  tuple([BytesSchema]),
  object({ _initCode: BytesSchema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function createEVM(
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
      : ([parameters._initCode] as const)
    const calldata = encode_function_call({
      name: "createEVM",
      args: PARAM_CODECS,
      values,
    })
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: { function: CREATE_EVM_SIGNATURE },
      },
    ])([signer, context])
  }
}
