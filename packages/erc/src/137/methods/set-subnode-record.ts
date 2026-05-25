import {
  address,
  bytes32,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  uint64Schema,
  uintSchema,
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
  bytes32(),
  bytes32(),
  address(),
  address(),
  uint64(),
] as const

export const SET_SUBNODE_RECORD_SIGNATURE = {
  signature:
    "setSubnodeRecord(bytes32,bytes32,address,address,uint64)",
  names: ["node", "label", "owner", "resolver", "ttl"],
}

const parametersSchema = union([
  tuple([
    bytes32Schema,
    bytes32Schema,
    addressSchema,
    addressSchema,
    uint64Schema,
  ]),
  object({
    node: bytes32Schema,
    label: bytes32Schema,
    owner: addressSchema,
    resolver: addressSchema,
    ttl: uint64Schema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function setSubnodeRecord(
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
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
          parameters[4],
        ] as const)
      : ([
          parameters.node,
          parameters.label,
          parameters.owner,
          parameters.resolver,
          parameters.ttl,
        ] as const)
    const calldata = encode_function_call({
      name: "setSubnodeRecord",
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
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: SET_SUBNODE_RECORD_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
