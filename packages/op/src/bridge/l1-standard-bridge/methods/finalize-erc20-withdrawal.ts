import {
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
  address(),
  address(),
  address(),
  address(),
  uint256(),
  bytes(),
] as const

export const FINALIZE_ERC20_WITHDRAWAL_SIGNATURE = {
  signature:
    "finalizeERC20Withdrawal(address,address,address,address,uint256,bytes)",
  names: [
    "_l1Token",
    "_l2Token",
    "_from",
    "_to",
    "_amount",
    "_extraData",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    _l1Token: AddressSchema,
    _l2Token: AddressSchema,
    _from: AddressSchema,
    _to: AddressSchema,
    _amount: Uint256Schema,
    _extraData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function finalizeERC20Withdrawal(
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
        ] as const)
      : ([
          parameters._l1Token,
          parameters._l2Token,
          parameters._from,
          parameters._to,
          parameters._amount,
          parameters._extraData,
        ] as const)
    const calldata = encode_function_call({
      name: "finalizeERC20Withdrawal",
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
          function: FINALIZE_ERC20_WITHDRAWAL_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
