import {
  bytes,
  bytes32,
  encode_function_call,
  uint32,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
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

const PARAM_CODECS = [uint32(), bytes32(), bytes()] as const

export const CREATE_SIGNATURE = {
  signature: "create(uint32,bytes32,bytes)",
  names: ["_gameType", "_rootClaim", "_extraData"],
}

const ParametersSchema = union([
  tuple([Uint32Schema, Bytes32Schema, BytesSchema]),
  object({
    _gameType: Uint32Schema,
    _rootClaim: Bytes32Schema,
    _extraData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function create(
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
          parameters._gameType,
          parameters._rootClaim,
          parameters._extraData,
        ] as const)
    const calldata = encode_function_call({
      name: "create",
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
          function: CREATE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
