import {
  tuple as abi_tuple,
  address,
  array,
  bytes,
  bytes32,
  encode_function_call,
  uint16,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint16Schema,
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
    l2BatchNumber: uint256(),
    l2MessageIndex: uint256(),
    l2Sender: address(),
    l2TxNumberInBatch: uint16(),
    message: bytes(),
    merkleProof: array(bytes32()),
  }),
] as const

export const FINALIZE_DEPOSIT_SIGNATURE = {
  signature:
    "finalizeDeposit((uint256,uint256,uint256,address,uint16,bytes,bytes32[]))",
  names: ["_finalizeWithdrawalParams"],
}

const ParametersSchema = union([
  tuple([
    object({
      chainId: Uint256Schema,
      l2BatchNumber: Uint256Schema,
      l2MessageIndex: Uint256Schema,
      l2Sender: AddressSchema,
      l2TxNumberInBatch: Uint16Schema,
      message: BytesSchema,
      merkleProof: v_array(Bytes32Schema),
    }),
  ]),
  object({
    _finalizeWithdrawalParams: object({
      chainId: Uint256Schema,
      l2BatchNumber: Uint256Schema,
      l2MessageIndex: Uint256Schema,
      l2Sender: AddressSchema,
      l2TxNumberInBatch: Uint16Schema,
      message: BytesSchema,
      merkleProof: v_array(Bytes32Schema),
    }),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function finalizeDeposit(
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
      : ([parameters._finalizeWithdrawalParams] as const)
    const calldata = encode_function_call({
      name: "finalizeDeposit",
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
          function: FINALIZE_DEPOSIT_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
