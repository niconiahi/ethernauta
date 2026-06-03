import {
  tuple as abi_tuple,
  address,
  array,
  bytes32,
  encode_function_call,
  uint8,
  uint64,
  uint256,
} from "@ethernauta/abi"
import type { Bytes } from "@ethernauta/core"
import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Uint8Schema,
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
  object,
  parse,
  tuple,
  union,
  array as v_array,
} from "valibot"

const PARAM_CODECS = [
  array(
    abi_tuple({
      schema: bytes32(),
      data: array(
        abi_tuple({ uid: bytes32(), value: uint256() }),
      ),
      signatures: array(
        abi_tuple({
          v: uint8(),
          r: bytes32(),
          s: bytes32(),
        }),
      ),
      revoker: address(),
      deadline: uint64(),
    }),
  ),
] as const

export const MULTI_REVOKE_BY_DELEGATION_SIGNATURE = {
  signature:
    "multiRevokeByDelegation((bytes32,(bytes32,uint256)[],(uint8,bytes32,bytes32)[],address,uint64)[])",
  names: ["multiDelegatedRequests"],
}

const ParametersSchema = union([
  tuple([
    v_array(
      object({
        schema: Bytes32Schema,
        data: v_array(
          object({
            uid: Bytes32Schema,
            value: Uint256Schema,
          }),
        ),
        signatures: v_array(
          object({
            v: Uint8Schema,
            r: Bytes32Schema,
            s: Bytes32Schema,
          }),
        ),
        revoker: AddressSchema,
        deadline: Uint64Schema,
      }),
    ),
  ]),
  object({
    multiDelegatedRequests: v_array(
      object({
        schema: Bytes32Schema,
        data: v_array(
          object({
            uid: Bytes32Schema,
            value: Uint256Schema,
          }),
        ),
        signatures: v_array(
          object({
            v: Uint8Schema,
            r: Bytes32Schema,
            s: Bytes32Schema,
          }),
        ),
        revoker: AddressSchema,
        deadline: Uint64Schema,
      }),
    ),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function multiRevokeByDelegation(
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
      : ([parameters.multiDelegatedRequests] as const)
    const calldata = encode_function_call({
      name: "multiRevokeByDelegation",
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
          function: MULTI_REVOKE_BY_DELEGATION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
