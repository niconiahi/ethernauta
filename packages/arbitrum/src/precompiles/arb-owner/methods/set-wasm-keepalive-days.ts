import {
  encode_function_call,
  uint16,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint16Schema,
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

const PARAM_CODECS = [uint16()] as const

export const SET_WASM_KEEPALIVE_DAYS_SIGNATURE = {
  signature: "setWasmKeepaliveDays(uint16)",
  names: ["_days"],
}

const ParametersSchema = union([
  tuple([Uint16Schema]),
  object({ _days: Uint16Schema }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setWasmKeepaliveDays(
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
      : ([parameters._days] as const)
    const calldata = encode_function_call({
      name: "setWasmKeepaliveDays",
      args: PARAM_CODECS,
      values,
    })
    // TODO(wallet): wallet fills nonce, gas, gasPrice / maxFeePerGas /
    //               maxPriorityFeePerGas by querying the network
    //               (eth_getTransactionCount, eth_estimateGas, eth_feeHistory).
    //               Generator MUST leave these fields unset.
    return eth_signTransaction([
      {
        to: context.to,
        value: parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: SET_WASM_KEEPALIVE_DAYS_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
