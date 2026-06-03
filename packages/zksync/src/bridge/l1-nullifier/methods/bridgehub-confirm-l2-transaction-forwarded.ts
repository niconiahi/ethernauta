import {
  bytes32,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
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

const PARAM_CODECS = [
  uint256(),
  bytes32(),
  bytes32(),
] as const

export const BRIDGEHUB_CONFIRM_L2_TRANSACTION_FORWARDED_SIGNATURE =
  {
    signature:
      "bridgehubConfirmL2TransactionForwarded(uint256,bytes32,bytes32)",
    names: ["_chainId", "_txDataHash", "_txHash"],
  }

const ParametersSchema = union([
  tuple([Uint256Schema, Bytes32Schema, Bytes32Schema]),
  object({
    _chainId: Uint256Schema,
    _txDataHash: Bytes32Schema,
    _txHash: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function bridgehubConfirmL2TransactionForwarded(
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
          parameters._txDataHash,
          parameters._txHash,
        ] as const)
    const calldata = encode_function_call({
      name: "bridgehubConfirmL2TransactionForwarded",
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
            BRIDGEHUB_CONFIRM_L2_TRANSACTION_FORWARDED_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
