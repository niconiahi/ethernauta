import {
  address,
  bytes32,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
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
  bytes32(),
  address(),
] as const

export const SET_ASSET_HANDLER_ADDRESS_SIGNATURE = {
  signature:
    "setAssetHandlerAddress(uint256,bytes32,address)",
  names: [
    "_originChainId",
    "_assetId",
    "_assetHandlerAddress",
  ],
}

const ParametersSchema = union([
  tuple([Uint256Schema, Bytes32Schema, AddressSchema]),
  object({
    _originChainId: Uint256Schema,
    _assetId: Bytes32Schema,
    _assetHandlerAddress: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setAssetHandlerAddress(
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
          parameters._originChainId,
          parameters._assetId,
          parameters._assetHandlerAddress,
        ] as const)
    const calldata = encode_function_call({
      name: "setAssetHandlerAddress",
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
          function: SET_ASSET_HANDLER_ADDRESS_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
