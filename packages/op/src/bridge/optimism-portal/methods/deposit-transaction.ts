import {
  address,
  bool,
  bytes,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
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
import {
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [
  address(),
  uint256(),
  uint64(),
  bool(),
  bytes(),
] as const

export const DEPOSIT_TRANSACTION_SIGNATURE = {
  signature:
    "depositTransaction(address,uint256,uint64,bool,bytes)",
  names: [
    "_to",
    "_value",
    "_gasLimit",
    "_isCreation",
    "_data",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    Uint256Schema,
    Uint64Schema,
    boolean(),
    BytesSchema,
  ]),
  object({
    _to: AddressSchema,
    _value: Uint256Schema,
    _gasLimit: Uint64Schema,
    _isCreation: boolean(),
    _data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function depositTransaction(
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
          parameters._to,
          parameters._value,
          parameters._gasLimit,
          parameters._isCreation,
          parameters._data,
        ] as const)
    const calldata = encode_function_call({
      name: "depositTransaction",
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
          function: DEPOSIT_TRANSACTION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
