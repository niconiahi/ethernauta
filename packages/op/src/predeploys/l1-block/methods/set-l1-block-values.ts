import {
  bytes32,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
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
  uint64(),
  uint64(),
  uint256(),
  bytes32(),
  uint64(),
  bytes32(),
  uint256(),
  uint256(),
] as const

export const SET_L1_BLOCK_VALUES_SIGNATURE = {
  signature:
    "setL1BlockValues(uint64,uint64,uint256,bytes32,uint64,bytes32,uint256,uint256)",
  names: [
    "_number",
    "_timestamp",
    "_basefee",
    "_hash",
    "_sequenceNumber",
    "_batcherHash",
    "_l1FeeOverhead",
    "_l1FeeScalar",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint64Schema,
    Uint64Schema,
    Uint256Schema,
    Bytes32Schema,
    Uint64Schema,
    Bytes32Schema,
    Uint256Schema,
    Uint256Schema,
  ]),
  object({
    _number: Uint64Schema,
    _timestamp: Uint64Schema,
    _basefee: Uint256Schema,
    _hash: Bytes32Schema,
    _sequenceNumber: Uint64Schema,
    _batcherHash: Bytes32Schema,
    _l1FeeOverhead: Uint256Schema,
    _l1FeeScalar: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setL1BlockValues(
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
          parameters[5],
          parameters[6],
          parameters[7],
        ] as const)
      : ([
          parameters._number,
          parameters._timestamp,
          parameters._basefee,
          parameters._hash,
          parameters._sequenceNumber,
          parameters._batcherHash,
          parameters._l1FeeOverhead,
          parameters._l1FeeScalar,
        ] as const)
    const calldata = encode_function_call({
      name: "setL1BlockValues",
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
          function: SET_L1_BLOCK_VALUES_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
