import {
  bool,
  bytes,
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [
  uint256(),
  bool(),
  bytes(),
  bytes(),
] as const

export const STEP_SIGNATURE = {
  signature: "step(uint256,bool,bytes,bytes)",
  names: [
    "_claimIndex",
    "_isAttack",
    "_stateData",
    "_proof",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    boolean(),
    BytesSchema,
    BytesSchema,
  ]),
  object({
    _claimIndex: Uint256Schema,
    _isAttack: boolean(),
    _stateData: BytesSchema,
    _proof: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function step(
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
          parameters[3],
        ] as const)
      : ([
          parameters._claimIndex,
          parameters._isAttack,
          parameters._stateData,
          parameters._proof,
        ] as const)
    const calldata = encode_function_call({
      name: "step",
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
          function: STEP_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
