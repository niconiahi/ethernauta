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
  uint256(),
  address(),
  address(),
  uint256(),
  uint256(),
  bytes(),
] as const

export const RELAY_MESSAGE_SIGNATURE = {
  signature:
    "relayMessage(uint256,address,address,uint256,uint256,bytes)",
  names: [
    "_nonce",
    "_sender",
    "_target",
    "_value",
    "_minGasLimit",
    "_message",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    _nonce: Uint256Schema,
    _sender: AddressSchema,
    _target: AddressSchema,
    _value: Uint256Schema,
    _minGasLimit: Uint256Schema,
    _message: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function relayMessage(
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
          parameters._nonce,
          parameters._sender,
          parameters._target,
          parameters._value,
          parameters._minGasLimit,
          parameters._message,
        ] as const)
    const calldata = encode_function_call({
      name: "relayMessage",
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
          function: RELAY_MESSAGE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
