import {
  tuple as abi_tuple,
  address,
  array,
  bytes,
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
import {
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    chainId: uint256(),
    mintValue: uint256(),
    l2Contract: address(),
    l2Value: uint256(),
    l2Calldata: bytes(),
    l2GasLimit: uint256(),
    l2GasPerPubdataByteLimit: uint256(),
    factoryDeps: array(bytes()),
    refundRecipient: address(),
  }),
] as const

export const REQUEST_L2_TRANSACTION_DIRECT_SIGNATURE = {
  signature:
    "requestL2TransactionDirect((uint256,uint256,address,uint256,bytes,uint256,uint256,bytes[],address))",
  names: ["_request"],
}

const ParametersSchema = union([
  tuple([
    object({
      chainId: Uint256Schema,
      mintValue: Uint256Schema,
      l2Contract: AddressSchema,
      l2Value: Uint256Schema,
      l2Calldata: BytesSchema,
      l2GasLimit: Uint256Schema,
      l2GasPerPubdataByteLimit: Uint256Schema,
      factoryDeps: v_array(BytesSchema),
      refundRecipient: AddressSchema,
    }),
  ]),
  object({
    _request: object({
      chainId: Uint256Schema,
      mintValue: Uint256Schema,
      l2Contract: AddressSchema,
      l2Value: Uint256Schema,
      l2Calldata: BytesSchema,
      l2GasLimit: Uint256Schema,
      l2GasPerPubdataByteLimit: Uint256Schema,
      factoryDeps: v_array(BytesSchema),
      refundRecipient: AddressSchema,
    }),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function requestL2TransactionDirect(
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
      ? ([parameters[0]] as const)
      : ([parameters._request] as const)
    const calldata = encode_function_call({
      name: "requestL2TransactionDirect",
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
          function: REQUEST_L2_TRANSACTION_DIRECT_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
