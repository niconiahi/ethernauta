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
  uint256(),
  uint256(),
  bytes(),
] as const

export const EXECUTE_TRANSACTION_SIMULATION_SIGNATURE = {
  signature:
    "executeTransactionSimulation(uint256,address,address,uint256,uint256,uint256,uint256,bytes)",
  names: [
    "index",
    "l2Sender",
    "to",
    "l2Block",
    "l1Block",
    "l2Timestamp",
    "value",
    "data",
  ],
}

const ParametersSchema = union([
  tuple([
    Uint256Schema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    index: Uint256Schema,
    l2Sender: AddressSchema,
    to: AddressSchema,
    l2Block: Uint256Schema,
    l1Block: Uint256Schema,
    l2Timestamp: Uint256Schema,
    value: Uint256Schema,
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function executeTransactionSimulation(
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
          parameters.index,
          parameters.l2Sender,
          parameters.to,
          parameters.l2Block,
          parameters.l1Block,
          parameters.l2Timestamp,
          parameters.value,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "executeTransactionSimulation",
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
            EXECUTE_TRANSACTION_SIMULATION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
