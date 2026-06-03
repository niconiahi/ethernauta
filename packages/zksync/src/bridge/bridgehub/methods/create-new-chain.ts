import {
  address,
  array,
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
  uint256(),
  address(),
  bytes(),
  array(bytes()),
] as const

export const CREATE_NEW_CHAIN_SIGNATURE = {
  signature:
    "createNewChain(uint256,address,bytes32,uint256,address,bytes,bytes[])",
  names: [
    "_chainId",
    "_chainTypeManager",
    "_baseTokenAssetId",
    "_salt",
    "_admin",
    "_initData",
    "_factoryDeps",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    AddressSchema,
    Bytes32Schema,
    Uint256Schema,
    AddressSchema,
    BytesSchema,
    v_array(BytesSchema),
  ]),
  object({
    _chainId: Uint256Schema,
    _chainTypeManager: AddressSchema,
    _baseTokenAssetId: Bytes32Schema,
    _salt: Uint256Schema,
    _admin: AddressSchema,
    _initData: BytesSchema,
    _factoryDeps: v_array(BytesSchema),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function createNewChain(
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
        ] as const)
      : ([
          parameters._chainId,
          parameters._chainTypeManager,
          parameters._baseTokenAssetId,
          parameters._salt,
          parameters._admin,
          parameters._initData,
          parameters._factoryDeps,
        ] as const)
    const calldata = encode_function_call({
      name: "createNewChain",
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
          function: CREATE_NEW_CHAIN_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
