import {
  address,
  bytes,
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
  address(),
  bytes32(),
  bytes(),
] as const

export const BRIDGE_RECOVER_FAILED_TRANSFER_1346CA3B_SIGNATURE =
  {
    signature:
      "bridgeRecoverFailedTransfer(uint256,address,bytes32,bytes)",
    names: [
      "_chainId",
      "_depositSender",
      "_assetId",
      "_assetData",
    ],
  }

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    AddressSchema,
    Bytes32Schema,
    BytesSchema,
  ]),
  object({
    _chainId: Uint256Schema,
    _depositSender: AddressSchema,
    _assetId: Bytes32Schema,
    _assetData: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function bridgeRecoverFailedTransfer_1346ca3b(
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
          parameters._chainId,
          parameters._depositSender,
          parameters._assetId,
          parameters._assetData,
        ] as const)
    const calldata = encode_function_call({
      name: "bridgeRecoverFailedTransfer",
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
          function:
            BRIDGE_RECOVER_FAILED_TRANSFER_1346CA3B_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
