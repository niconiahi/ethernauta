import {
  address,
  bytes,
  bytes32,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
  bytes32(),
  uint256(),
  uint256(),
  uint256(),
  uint256(),
  uint64(),
  uint256(),
  address(),
  address(),
  address(),
  bytes(),
] as const

export const SUBMIT_RETRYABLE_SIGNATURE = {
  signature:
    "submitRetryable(bytes32,uint256,uint256,uint256,uint256,uint64,uint256,address,address,address,bytes)",
  names: [
    "requestId",
    "l1BaseFee",
    "deposit",
    "callvalue",
    "gasFeeCap",
    "gasLimit",
    "maxSubmissionFee",
    "feeRefundAddress",
    "beneficiary",
    "retryTo",
    "retryData",
  ],
}

const ParametersSchema = union([
  tuple([
    Bytes32Schema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    Uint64Schema,
    Uint256Schema,
    AddressSchema,
    AddressSchema,
    AddressSchema,
    BytesSchema,
  ]),
  object({
    requestId: Bytes32Schema,
    l1BaseFee: Uint256Schema,
    deposit: Uint256Schema,
    callvalue: Uint256Schema,
    gasFeeCap: Uint256Schema,
    gasLimit: Uint64Schema,
    maxSubmissionFee: Uint256Schema,
    feeRefundAddress: AddressSchema,
    beneficiary: AddressSchema,
    retryTo: AddressSchema,
    retryData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function submitRetryable(
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
          parameters[8],
          parameters[9],
          parameters[10],
        ] as const)
      : ([
          parameters.requestId,
          parameters.l1BaseFee,
          parameters.deposit,
          parameters.callvalue,
          parameters.gasFeeCap,
          parameters.gasLimit,
          parameters.maxSubmissionFee,
          parameters.feeRefundAddress,
          parameters.beneficiary,
          parameters.retryTo,
          parameters.retryData,
        ] as const)
    const calldata = encode_function_call({
      name: "submitRetryable",
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
          function: SUBMIT_RETRYABLE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
