import {
  tuple as abi_tuple,
  address,
  bool,
  bytes,
  bytes32,
  encode_function_call,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint64Schema,
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
  boolean,
  object,
  parse,
  tuple,
  union,
} from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    schema: bytes32(),
    data: abi_tuple({
      recipient: address(),
      expirationTime: uint64(),
      revocable: bool(),
      refUID: bytes32(),
      data: bytes(),
      value: uint256(),
    }),
  }),
] as const

export const ATTEST_SIGNATURE = {
  signature:
    "attest((bytes32,(address,uint64,bool,bytes32,bytes,uint256)))",
  names: ["request"],
}

const ParametersSchema = union([
  tuple([
    object({
      schema: Bytes32Schema,
      data: object({
        recipient: AddressSchema,
        expirationTime: Uint64Schema,
        revocable: boolean(),
        refUID: Bytes32Schema,
        data: BytesSchema,
        value: Uint256Schema,
      }),
    }),
  ]),
  object({
    request: object({
      schema: Bytes32Schema,
      data: object({
        recipient: AddressSchema,
        expirationTime: Uint64Schema,
        revocable: boolean(),
        refUID: Bytes32Schema,
        data: BytesSchema,
        value: Uint256Schema,
      }),
    }),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function attest(
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
      ? ([parameters[0]] as const)
      : ([parameters.request] as const)
    const calldata = encode_function_call({
      name: "attest",
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
          function: ATTEST_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
