import {
  address,
  bytes,
  encode_function_call,
  uint32,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
  Uint32Schema,
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
  uint32(),
  bytes(),
] as const

export const BRIDGE_ERC721_TO_SIGNATURE = {
  signature:
    "bridgeERC721To(address,address,address,uint256,uint32,bytes)",
  names: [
    "_localToken",
    "_remoteToken",
    "_to",
    "_tokenId",
    "_minGasLimit",
    "_extraData",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint32Schema,
    BytesSchema,
  ]),
  object({
    _localToken: AddressSchema,
    _remoteToken: AddressSchema,
    _to: AddressSchema,
    _tokenId: Uint256Schema,
    _minGasLimit: Uint32Schema,
    _extraData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function bridgeERC721To(
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
          parameters._localToken,
          parameters._remoteToken,
          parameters._to,
          parameters._tokenId,
          parameters._minGasLimit,
          parameters._extraData,
        ] as const)
    const calldata = encode_function_call({
      name: "bridgeERC721To",
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
          function: BRIDGE_ERC721_TO_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
