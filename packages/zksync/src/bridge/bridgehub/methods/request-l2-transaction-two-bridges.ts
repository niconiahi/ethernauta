import {
  tuple as abi_tuple,
  address,
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
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    chainId: uint256(),
    mintValue: uint256(),
    l2Value: uint256(),
    l2GasLimit: uint256(),
    l2GasPerPubdataByteLimit: uint256(),
    refundRecipient: address(),
    secondBridgeAddress: address(),
    secondBridgeValue: uint256(),
    secondBridgeCalldata: bytes(),
  }),
] as const

export const REQUEST_L2_TRANSACTION_TWO_BRIDGES_SIGNATURE =
  {
    signature:
      "requestL2TransactionTwoBridges((uint256,uint256,uint256,uint256,uint256,address,address,uint256,bytes))",
    names: ["_request"],
  }

const ParametersSchema = union([
  tuple([
    object({
      chainId: Uint256Schema,
      mintValue: Uint256Schema,
      l2Value: Uint256Schema,
      l2GasLimit: Uint256Schema,
      l2GasPerPubdataByteLimit: Uint256Schema,
      refundRecipient: AddressSchema,
      secondBridgeAddress: AddressSchema,
      secondBridgeValue: Uint256Schema,
      secondBridgeCalldata: BytesSchema,
    }),
  ]),
  object({
    _request: object({
      chainId: Uint256Schema,
      mintValue: Uint256Schema,
      l2Value: Uint256Schema,
      l2GasLimit: Uint256Schema,
      l2GasPerPubdataByteLimit: Uint256Schema,
      refundRecipient: AddressSchema,
      secondBridgeAddress: AddressSchema,
      secondBridgeValue: Uint256Schema,
      secondBridgeCalldata: BytesSchema,
    }),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function requestL2TransactionTwoBridges(
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
      name: "requestL2TransactionTwoBridges",
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
          function:
            REQUEST_L2_TRANSACTION_TWO_BRIDGES_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
