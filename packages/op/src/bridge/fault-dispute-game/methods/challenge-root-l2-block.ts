import {
  tuple as abi_tuple,
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
  abi_tuple({
    version: bytes32(),
    stateRoot: bytes32(),
    messagePasserStorageRoot: bytes32(),
    latestBlockhash: bytes32(),
  }),
  bytes(),
] as const

export const CHALLENGE_ROOT_L2_BLOCK_SIGNATURE = {
  signature:
    "challengeRootL2Block((bytes32,bytes32,bytes32,bytes32),bytes)",
  names: ["_outputRootProof", "_headerRLP"],
}

const ParametersSchema = union([
  tuple([
    object({
      version: Bytes32Schema,
      stateRoot: Bytes32Schema,
      messagePasserStorageRoot: Bytes32Schema,
      latestBlockhash: Bytes32Schema,
    }),
    BytesSchema,
  ]),
  object({
    _outputRootProof: object({
      version: Bytes32Schema,
      stateRoot: Bytes32Schema,
      messagePasserStorageRoot: Bytes32Schema,
      latestBlockhash: Bytes32Schema,
    }),
    _headerRLP: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function challengeRootL2Block(
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
          parameters._outputRootProof,
          parameters._headerRLP,
        ] as const)
    const calldata = encode_function_call({
      name: "challengeRootL2Block",
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
          function: CHALLENGE_ROOT_L2_BLOCK_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
