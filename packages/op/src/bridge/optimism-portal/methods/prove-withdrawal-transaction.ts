import {
  tuple as abi_tuple,
  address,
  array,
  bytes,
  bytes32,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
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
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    nonce: uint256(),
    sender: address(),
    target: address(),
    value: uint256(),
    gasLimit: uint256(),
    data: bytes(),
  }),
  uint256(),
  abi_tuple({
    version: bytes32(),
    stateRoot: bytes32(),
    messagePasserStorageRoot: bytes32(),
    latestBlockhash: bytes32(),
  }),
  array(bytes()),
] as const

export const PROVE_WITHDRAWAL_TRANSACTION_SIGNATURE = {
  signature:
    "proveWithdrawalTransaction((uint256,address,address,uint256,uint256,bytes),uint256,(bytes32,bytes32,bytes32,bytes32),bytes[])",
  names: [
    "_tx",
    "_disputeGameIndex",
    "_outputRootProof",
    "_withdrawalProof",
  ],
}

const ParametersSchema = union([
  tuple([
    object({
      nonce: Uint256Schema,
      sender: AddressSchema,
      target: AddressSchema,
      value: Uint256Schema,
      gasLimit: Uint256Schema,
      data: BytesSchema,
    }),
    Uint256Schema,
    object({
      version: Bytes32Schema,
      stateRoot: Bytes32Schema,
      messagePasserStorageRoot: Bytes32Schema,
      latestBlockhash: Bytes32Schema,
    }),
    v_array(BytesSchema),
  ]),
  object({
    _tx: object({
      nonce: Uint256Schema,
      sender: AddressSchema,
      target: AddressSchema,
      value: Uint256Schema,
      gasLimit: Uint256Schema,
      data: BytesSchema,
    }),
    _disputeGameIndex: Uint256Schema,
    _outputRootProof: object({
      version: Bytes32Schema,
      stateRoot: Bytes32Schema,
      messagePasserStorageRoot: Bytes32Schema,
      latestBlockhash: Bytes32Schema,
    }),
    _withdrawalProof: v_array(BytesSchema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function proveWithdrawalTransaction(
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
          parameters._tx,
          parameters._disputeGameIndex,
          parameters._outputRootProof,
          parameters._withdrawalProof,
        ] as const)
    const calldata = encode_function_call({
      name: "proveWithdrawalTransaction",
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
          function: PROVE_WITHDRAWAL_TRANSACTION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
