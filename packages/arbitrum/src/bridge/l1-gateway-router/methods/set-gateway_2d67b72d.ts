import {
  address,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
  address(),
  uint256(),
  uint256(),
  uint256(),
  address(),
] as const

export const SET_GATEWAY_2D67B72D_SIGNATURE = {
  signature:
    "setGateway(address,uint256,uint256,uint256,address)",
  names: [
    "_gateway",
    "_maxGas",
    "_gasPriceBid",
    "_maxSubmissionCost",
    "_creditBackAddress",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    AddressSchema,
  ]),
  object({
    _gateway: AddressSchema,
    _maxGas: Uint256Schema,
    _gasPriceBid: Uint256Schema,
    _maxSubmissionCost: Uint256Schema,
    _creditBackAddress: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setGateway_2d67b72d(
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
          parameters._gateway,
          parameters._maxGas,
          parameters._gasPriceBid,
          parameters._maxSubmissionCost,
          parameters._creditBackAddress,
        ] as const)
    const calldata = encode_function_call({
      name: "setGateway",
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
          function: SET_GATEWAY_2D67B72D_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
