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
    nonce: uint256(),
    sender: address(),
    target: address(),
    value: uint256(),
    gasLimit: uint256(),
    data: bytes(),
  }),
  address(),
] as const

export const FINALIZE_WITHDRAWAL_TRANSACTION_EXTERNAL_PROOF_SIGNATURE =
  {
    signature:
      "finalizeWithdrawalTransactionExternalProof((uint256,address,address,uint256,uint256,bytes),address)",
    names: ["_tx", "_proofSubmitter"],
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
    AddressSchema,
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
    _proofSubmitter: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function finalizeWithdrawalTransactionExternalProof(
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
      ? ([parameters[0], parameters[1]] as const)
      : ([
          parameters._tx,
          parameters._proofSubmitter,
        ] as const)
    const calldata = encode_function_call({
      name: "finalizeWithdrawalTransactionExternalProof",
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
          function:
            FINALIZE_WITHDRAWAL_TRANSACTION_EXTERNAL_PROOF_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
