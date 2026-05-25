import {
  address,
  bytes,
  encode_function_call,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  addressSchema,
  bytesSchema,
  uint256Schema,
  uintSchema,
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
  bytes(),
  bytes(),
] as const

export const ANNOUNCE_SIGNATURE = {
  signature: "announce(uint256,address,bytes,bytes)",
  names: [
    "schemeId",
    "stealthAddress",
    "ephemeralPubKey",
    "metadata",
  ],
}

const parametersSchema = union([
  tuple([
    uint256Schema,
    addressSchema,
    bytesSchema,
    bytesSchema,
  ]),
  object({
    schemeId: uint256Schema,
    stealthAddress: addressSchema,
    ephemeralPubKey: bytesSchema,
    metadata: bytesSchema,
  }),
])
type Parameters = InferOutput<typeof parametersSchema>

export function announce(
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
    const parameters = parse(parametersSchema, _parameters)
    const values = Array.isArray(parameters)
      ? ([
          parameters[0],
          parameters[1],
          parameters[2],
          parameters[3],
        ] as const)
      : ([
          parameters.schemeId,
          parameters.stealthAddress,
          parameters.ephemeralPubKey,
          parameters.metadata,
        ] as const)
    const calldata = encode_function_call({
      name: "announce",
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
        value: parse(uintSchema, "0x0"),
        input: parse(bytesSchema, bytes_to_hex(calldata)),
        _ethernauta: {
          function: ANNOUNCE_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
