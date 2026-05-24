import {
  address,
  bytes32,
  encode_function_call,
  uint8,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytes32Schema,
  uint256Schema,
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
  address(),
  uint256(),
  uint256(),
  uint8(),
  bytes32(),
  bytes32(),
] as const

export const DELEGATE_BY_SIG_SIGNATURE = {
  signature:
    "delegateBySig(address,uint256,uint256,uint8,bytes32,bytes32)",
  names: ["delegatee", "nonce", "expiry", "v", "r", "s"],
}

const parametersSchema = union([
  tuple([
    addressSchema,
    uint256Schema,
    uint256Schema,
    uint256Schema,
    bytes32Schema,
    bytes32Schema,
  ]),
  object({
    delegatee: addressSchema,
    nonce: uint256Schema,
    expiry: uint256Schema,
    v: uint256Schema,
    r: bytes32Schema,
    s: bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function delegateBySig(
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
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? parameters
      : [
          parameters.delegatee,
          parameters.nonce,
          parameters.expiry,
          parameters.v,
          parameters.r,
          parameters.s,
        ]
    const calldata = encode_function_call({
      name: "delegateBySig",
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
        value: "0x0",
        input: bytes_to_hex(calldata),
        _ethernauta: {
          function: DELEGATE_BY_SIG_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
