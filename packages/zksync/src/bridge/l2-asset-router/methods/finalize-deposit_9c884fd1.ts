import {
  bytes,
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
  bytes(),
] as const

export const FINALIZE_DEPOSIT_9C884FD1_SIGNATURE = {
  signature: "finalizeDeposit(uint256,bytes32,bytes)",
  names: ["arg_0", "_assetId", "_transferData"],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Bytes32Schema, BytesSchema]),
  object({
    arg_0: Uint256Schema,
    _assetId: Bytes32Schema,
    _transferData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function finalizeDeposit_9c884fd1(
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
          parameters.arg_0,
          parameters._assetId,
          parameters._transferData,
        ] as const)
    const calldata = encode_function_call({
      name: "finalizeDeposit",
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
          function: FINALIZE_DEPOSIT_9C884FD1_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
