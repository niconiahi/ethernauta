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
  uint256(),
  bytes(),
] as const

export const INITIATE_WITHDRAWAL_SIGNATURE = {
  signature: "initiateWithdrawal(address,uint256,bytes)",
  names: ["_target", "_gasLimit", "_data"],
}

const ParametersSchema = union([
  tuple([AddressSchema, Uint256Schema, BytesSchema]),
  object({
    _target: AddressSchema,
    _gasLimit: Uint256Schema,
    _data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function initiateWithdrawal(
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
          parameters._target,
          parameters._gasLimit,
          parameters._data,
        ] as const)
    const calldata = encode_function_call({
      name: "initiateWithdrawal",
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
          function: INITIATE_WITHDRAWAL_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
