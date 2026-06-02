import {
  address,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
  address(),
  address(),
  address(),
  address(),
  address(),
] as const

export const INITIALIZE_SIGNATURE = {
  signature:
    "initialize(address,address,address,address,address)",
  names: [
    "_owner",
    "_defaultGateway",
    "arg_2",
    "_counterpartGateway",
    "_inbox",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    AddressSchema,
    AddressSchema,
  ]),
  object({
    _owner: AddressSchema,
    _defaultGateway: AddressSchema,
    arg_2: AddressSchema,
    _counterpartGateway: AddressSchema,
    _inbox: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function initialize(
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
          parameters[4],
        ] as const)
      : ([
          parameters._owner,
          parameters._defaultGateway,
          parameters.arg_2,
          parameters._counterpartGateway,
          parameters._inbox,
        ] as const)
    const calldata = encode_function_call({
      name: "initialize",
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
          function: INITIALIZE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
