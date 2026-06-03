import {
  address,
  encode_function_call,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  BytesSchema,
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
] as const

export const SET_ADDRESSES_SIGNATURE = {
  signature:
    "setAddresses(address,address,address,address)",
  names: [
    "_assetRouter",
    "_l1CtmDeployer",
    "_messageRoot",
    "_chainAssetHandler",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    AddressSchema,
  ]),
  object({
    _assetRouter: AddressSchema,
    _l1CtmDeployer: AddressSchema,
    _messageRoot: AddressSchema,
    _chainAssetHandler: AddressSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function setAddresses(
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
        ] as const)
      : ([
          parameters._assetRouter,
          parameters._l1CtmDeployer,
          parameters._messageRoot,
          parameters._chainAssetHandler,
        ] as const)
    const calldata = encode_function_call({
      name: "setAddresses",
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
          function: SET_ADDRESSES_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
