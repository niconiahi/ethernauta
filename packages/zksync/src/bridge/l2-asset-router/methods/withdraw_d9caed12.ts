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
  uint256(),
] as const

export const WITHDRAW_D9CAED12_SIGNATURE = {
  signature: "withdraw(address,address,uint256)",
  names: ["_l1Receiver", "_l2Token", "_amount"],
}

const ParametersSchema = union([
  tuple([AddressSchema, AddressSchema, Uint256Schema]),
  object({
    _l1Receiver: AddressSchema,
    _l2Token: AddressSchema,
    _amount: Uint256Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function withdraw_d9caed12(
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
        ] as const)
      : ([
          parameters._l1Receiver,
          parameters._l2Token,
          parameters._amount,
        ] as const)
    const calldata = encode_function_call({
      name: "withdraw",
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
          function: WITHDRAW_D9CAED12_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
