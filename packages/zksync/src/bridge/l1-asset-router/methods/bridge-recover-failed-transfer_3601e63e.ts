import {
  address,
  array,
  bytes,
  bytes32,
  encode_function_call,
  uint16,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint16Schema,
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
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  uint256(),
  address(),
  bytes32(),
  bytes(),
  bytes32(),
  uint256(),
  uint256(),
  uint16(),
  array(bytes32()),
] as const

export const BRIDGE_RECOVER_FAILED_TRANSFER_3601E63E_SIGNATURE =
  {
    signature:
      "bridgeRecoverFailedTransfer(uint256,address,bytes32,bytes,bytes32,uint256,uint256,uint16,bytes32[])",
    names: [
      "_chainId",
      "_depositSender",
      "_assetId",
      "_assetData",
      "_l2TxHash",
      "_l2BatchNumber",
      "_l2MessageIndex",
      "_l2TxNumberInBatch",
      "_merkleProof",
    ],
  }

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    AddressSchema,
    Bytes32Schema,
    BytesSchema,
    Bytes32Schema,
    Uint256Schema,
    Uint256Schema,
    Uint16Schema,
    v_array(Bytes32Schema),
  ]),
  object({
    _chainId: Uint256Schema,
    _depositSender: AddressSchema,
    _assetId: Bytes32Schema,
    _assetData: BytesSchema,
    _l2TxHash: Bytes32Schema,
    _l2BatchNumber: Uint256Schema,
    _l2MessageIndex: Uint256Schema,
    _l2TxNumberInBatch: Uint16Schema,
    _merkleProof: v_array(Bytes32Schema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function bridgeRecoverFailedTransfer_3601e63e(
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
          parameters[6],
          parameters[7],
          parameters[8],
        ] as const)
      : ([
          parameters._chainId,
          parameters._depositSender,
          parameters._assetId,
          parameters._assetData,
          parameters._l2TxHash,
          parameters._l2BatchNumber,
          parameters._l2MessageIndex,
          parameters._l2TxNumberInBatch,
          parameters._merkleProof,
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
            BRIDGE_RECOVER_FAILED_TRANSFER_3601E63E_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
