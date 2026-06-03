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
  address(),
  address(),
  uint256(),
  uint256(),
  uint256(),
  address(),
] as const

export const DEPOSIT_LEGACY_ERC20_BRIDGE_SIGNATURE = {
  signature:
    "depositLegacyErc20Bridge(address,address,address,uint256,uint256,uint256,address)",
  names: [
    "_originalCaller",
    "_l2Receiver",
    "_l1Token",
    "_amount",
    "_l2TxGasLimit",
    "_l2TxGasPerPubdataByte",
    "_refundRecipient",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    AddressSchema,
  ]),
  object({
    _originalCaller: AddressSchema,
    _l2Receiver: AddressSchema,
    _l1Token: AddressSchema,
    _amount: Uint256Schema,
    _l2TxGasLimit: Uint256Schema,
    _l2TxGasPerPubdataByte: Uint256Schema,
    _refundRecipient: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function depositLegacyErc20Bridge(
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
        ] as const)
      : ([
          parameters._originalCaller,
          parameters._l2Receiver,
          parameters._l1Token,
          parameters._amount,
          parameters._l2TxGasLimit,
          parameters._l2TxGasPerPubdataByte,
          parameters._refundRecipient,
        ] as const)
    const calldata = encode_function_call({
      name: "depositLegacyErc20Bridge",
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
          function: DEPOSIT_LEGACY_ERC20_BRIDGE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
