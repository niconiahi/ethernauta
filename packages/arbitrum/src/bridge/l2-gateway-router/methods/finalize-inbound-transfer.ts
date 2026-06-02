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
  address(),
  address(),
  address(),
  uint256(),
  bytes(),
] as const

export const FINALIZE_INBOUND_TRANSFER_SIGNATURE = {
  signature:
    "finalizeInboundTransfer(address,address,address,uint256,bytes)",
  names: ["arg_0", "arg_1", "arg_2", "arg_3", "arg_4"],
}

const ParametersSchema = union([
  tuple([
    AddressSchema,
    AddressSchema,
    AddressSchema,
    Uint256Schema,
    BytesSchema,
  ]),
  object({
    arg_0: AddressSchema,
    arg_1: AddressSchema,
    arg_2: AddressSchema,
    arg_3: Uint256Schema,
    arg_4: BytesSchema,
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function finalizeInboundTransfer(
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
          parameters.arg_0,
          parameters.arg_1,
          parameters.arg_2,
          parameters.arg_3,
          parameters.arg_4,
        ] as const)
    const calldata = encode_function_call({
      name: "finalizeInboundTransfer",
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
        value: context.value ?? parse(UintSchema, "0x0"),
        input: parse(BytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: FINALIZE_INBOUND_TRANSFER_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
