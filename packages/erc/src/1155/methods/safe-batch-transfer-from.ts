import {
  address,
  array,
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
  array(uint256()),
  array(uint256()),
  bytes(),
] as const

export const SAFE_BATCH_TRANSFER_FROM_SIGNATURE = {
  signature:
    "safeBatchTransferFrom(address,address,uint256[],uint256[],bytes)",
  names: ["from", "to", "ids", "values", "data"],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    v_array(Uint256Schema),
    v_array(Uint256Schema),
    BytesSchema,
  ]),
  object({
    from: AddressSchema,
    to: AddressSchema,
    ids: v_array(Uint256Schema),
    values: v_array(Uint256Schema),
    data: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function safeBatchTransferFrom(
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
        ] as const)
      : ([
          parameters.from,
          parameters.to,
          parameters.ids,
          parameters.values,
          parameters.data,
        ] as const)
    const calldata = encode_function_call({
      name: "safeBatchTransferFrom",
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
          function: SAFE_BATCH_TRANSFER_FROM_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
