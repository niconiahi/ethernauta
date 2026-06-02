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
  uint256(),
  uint256(),
  uint256(),
  bytes(),
] as const

export const OUTBOUND_TRANSFER_D2CE7D65_SIGNATURE = {
  signature:
    "outboundTransfer(address,address,uint256,uint256,uint256,bytes)",
  names: [
    "_token",
    "_to",
    "_amount",
    "_maxGas",
    "_gasPriceBid",
    "_data",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    _token: AddressSchema,
    _to: AddressSchema,
    _amount: Uint256Schema,
    _maxGas: Uint256Schema,
    _gasPriceBid: Uint256Schema,
    _data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function outboundTransfer_d2ce7d65(
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
          parameters._token,
          parameters._to,
          parameters._amount,
          parameters._maxGas,
          parameters._gasPriceBid,
          parameters._data,
        ] as const)
    const calldata = encode_function_call({
      name: "outboundTransfer",
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
          function: OUTBOUND_TRANSFER_D2CE7D65_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
