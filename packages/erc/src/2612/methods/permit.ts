import {
  address,
  bytes32,
  encode_function_call,
  uint8,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint8Schema,
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
  uint8(),
  bytes32(),
  bytes32(),
] as const

export const PERMIT_SIGNATURE = {
  signature:
    "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)",
  names: [
    "owner",
    "spender",
    "value",
    "deadline",
    "v",
    "r",
    "s",
  ],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    Uint256Schema,
    Uint8Schema,
    Bytes32Schema,
    Bytes32Schema,
  ]),
  object({
    owner: AddressSchema,
    spender: AddressSchema,
    value: Uint256Schema,
    deadline: Uint256Schema,
    v: Uint8Schema,
    r: Bytes32Schema,
    s: Bytes32Schema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function permit(
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
          parameters.owner,
          parameters.spender,
          parameters.value,
          parameters.deadline,
          parameters.v,
          parameters.r,
          parameters.s,
        ] as const)
    const calldata = encode_function_call({
      name: "permit",
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
          function: PERMIT_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
