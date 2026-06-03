import {
  tuple as abi_tuple,
  address,
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
import { object, parse, tuple, union } from "valibot"

const PARAM_CODECS = [
  abi_tuple({
    schema: bytes32(),
    data: abi_tuple({ uid: bytes32(), value: uint256() }),
    signature: abi_tuple({
      v: uint8(),
      r: bytes32(),
      s: bytes32(),
    }),
    revoker: address(),
    deadline: uint64(),
  }),
] as const

export const REVOKE_BY_DELEGATION_SIGNATURE = {
  signature:
    "revokeByDelegation((bytes32,(bytes32,uint256),(uint8,bytes32,bytes32),address,uint64))",
  names: ["delegatedRequest"],
}

const ParametersSchema = union([
  tuple([
    object({
      schema: Bytes32Schema,
      data: object({
        uid: Bytes32Schema,
        value: Uint256Schema,
      }),
      signature: object({
        v: Uint8Schema,
        r: Bytes32Schema,
        s: Bytes32Schema,
      }),
      revoker: AddressSchema,
      deadline: Uint64Schema,
    }),
  ]),
  object({
    delegatedRequest: object({
      schema: Bytes32Schema,
      data: object({
        uid: Bytes32Schema,
        value: Uint256Schema,
      }),
      signature: object({
        v: Uint8Schema,
        r: Bytes32Schema,
        s: Bytes32Schema,
      }),
      revoker: AddressSchema,
      deadline: Uint64Schema,
    }),
  }),
])
type Parameters = InferOutput<typeof ParametersSchema>

export function revokeByDelegation(
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
      : ([parameters.delegatedRequest] as const)
    const calldata = encode_function_call({
      name: "revokeByDelegation",
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
          function: REVOKE_BY_DELEGATION_SIGNATURE,
        },
      },
    ])([signer, context])
  }
}
