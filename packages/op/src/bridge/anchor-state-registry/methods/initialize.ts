import {
  tuple as abi_tuple,
  address,
  bytes32,
  encode_function_call,
  uint32,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint32Schema,
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
  address(),
  abi_tuple({
    root: bytes32(),
    l2SequenceNumber: uint256(),
  }),
  uint32(),
] as const

export const INITIALIZE_SIGNATURE = {
  signature:
    "initialize(address,address,(bytes32,uint256),uint32)",
  names: [
    "_systemConfig",
    "_disputeGameFactory",
    "_startingAnchorRoot",
    "_startingRespectedGameType",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    object({
      root: Bytes32Schema,
      l2SequenceNumber: Uint256Schema,
    }),
    Uint32Schema,
  ]),
  object({
    _systemConfig: AddressSchema,
    _disputeGameFactory: AddressSchema,
    _startingAnchorRoot: object({
      root: Bytes32Schema,
      l2SequenceNumber: Uint256Schema,
    }),
    _startingRespectedGameType: Uint32Schema,
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
        ] as const)
      : ([
          parameters._systemConfig,
          parameters._disputeGameFactory,
          parameters._startingAnchorRoot,
          parameters._startingRespectedGameType,
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
