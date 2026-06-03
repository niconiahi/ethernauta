import {
  address,
  array,
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
  address(),
  address(),
  uint256(),
  bytes32(),
  uint256(),
  uint256(),
  uint16(),
  array(bytes32()),
] as const

export const CLAIM_FAILED_DEPOSIT_LEGACY_ERC20_BRIDGE_SIGNATURE =
  {
    signature:
      "claimFailedDepositLegacyErc20Bridge(address,address,uint256,bytes32,uint256,uint256,uint16,bytes32[])",
    names: [
      "_depositSender",
      "_l1Token",
      "_amount",
      "_l2TxHash",
      "_l2BatchNumber",
      "_l2MessageIndex",
      "_l2TxNumberInBatch",
      "_merkleProof",
    ],
  }

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Bytes32Schema,
    Uint256Schema,
    Uint256Schema,
    Uint16Schema,
    v_array(Bytes32Schema),
  ]),
  object({
    _depositSender: AddressSchema,
    _l1Token: AddressSchema,
    _amount: Uint256Schema,
    _l2TxHash: Bytes32Schema,
    _l2BatchNumber: Uint256Schema,
    _l2MessageIndex: Uint256Schema,
    _l2TxNumberInBatch: Uint16Schema,
    _merkleProof: v_array(Bytes32Schema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function claimFailedDepositLegacyErc20Bridge(
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
        ] as const)
      : ([
          parameters._depositSender,
          parameters._l1Token,
          parameters._amount,
          parameters._l2TxHash,
          parameters._l2BatchNumber,
          parameters._l2MessageIndex,
          parameters._l2TxNumberInBatch,
          parameters._merkleProof,
        ] as const)
    const calldata = encode_function_call({
      name: "claimFailedDepositLegacyErc20Bridge",
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
            CLAIM_FAILED_DEPOSIT_LEGACY_ERC20_BRIDGE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
