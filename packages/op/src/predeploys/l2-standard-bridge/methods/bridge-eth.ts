import {
  bytes,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  BytesSchema,
  Uint32Schema,
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

const PARAM_CODECS = [uint32(), bytes()] as const

export const BRIDGE_ETH_SIGNATURE = {
  signature: "bridgeETH(uint32,bytes)",
  names: ["_minGasLimit", "_extraData"],
}

const ParametersSchema = union([
  tuple([Uint32Schema, BytesSchema]),
  object({
    _minGasLimit: Uint32Schema,
    _extraData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function bridgeETH(
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
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters._minGasLimit,
          parameters._extraData,
        ] as const)
    const calldata = encode_function_call({
      name: "bridgeETH",
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
        value: context.value ?? parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: BRIDGE_ETH_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
