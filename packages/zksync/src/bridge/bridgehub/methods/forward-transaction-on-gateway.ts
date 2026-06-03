import {
  bytes32,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
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

const PARAM_CODECS = [
  uint256(),
  bytes32(),
  uint64(),
] as const

export const FORWARD_TRANSACTION_ON_GATEWAY_SIGNATURE = {
  signature:
    "forwardTransactionOnGateway(uint256,bytes32,uint64)",
  names: [
    "_chainId",
    "_canonicalTxHash",
    "_expirationTimestamp",
  ],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Bytes32Schema, Uint64Schema]),
  object({
    _chainId: Uint256Schema,
    _canonicalTxHash: Bytes32Schema,
    _expirationTimestamp: Uint64Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function forwardTransactionOnGateway(
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
          parameters._chainId,
          parameters._canonicalTxHash,
          parameters._expirationTimestamp,
        ] as const)
    const calldata = encode_function_call({
      name: "forwardTransactionOnGateway",
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
          function:
            FORWARD_TRANSACTION_ON_GATEWAY_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
