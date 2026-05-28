import {
  address,
  bytes32,
  encode_function_call,
  uint64,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
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
  bytes32(),
  address(),
  address(),
  uint64(),
] as const

export const SET_RECORD_SIGNATURE = {
  signature: "setRecord(bytes32,address,address,uint64)",
  names: ["node", "owner", "resolver", "ttl"],
}

const ParametersSchema = union([
  tuple([
    Bytes32Schema,
    AddressSchema,
    AddressSchema,
    Uint64Schema,
  ]),
  object({
    node: Bytes32Schema,
    owner: AddressSchema,
    resolver: AddressSchema,
    ttl: Uint64Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setRecord(
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
          parameters.node,
          parameters.owner,
          parameters.resolver,
          parameters.ttl,
        ] as const)
    const calldata = encode_function_call({
      name: "setRecord",
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
          function: SET_RECORD_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
