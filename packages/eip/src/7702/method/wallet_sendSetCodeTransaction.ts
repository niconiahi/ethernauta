// https://eips.ethereum.org/EIPS/eip-7702
//
// High-level entry point for the self-sponsored 7702 case:
// the EOA delegates itself to one or more contracts and runs
// a single type-4 transaction in one user-facing step.
//
// The dapp supplies the *intent* (which contracts to delegate
// to, what calldata to execute). The wallet fills the nonces
// for each delegation as `eoa_nonce + 1 + i`, signs every
// authorization, signs the outer tx, broadcasts via the
// wallet's writer, and returns the resulting tx hash.

import {
  addressSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import type {
  ResolvedSigner,
  Signable,
} from "@ethernauta/transport"
import {
  array,
  type InferOutput,
  object,
  optional,
  parse,
  pipe,
  regex,
  string,
} from "valibot"

export const delegationIntentSchema = object({
  chainId: uintSchema,
  address: addressSchema,
})
export type DelegationIntent = InferOutput<
  typeof delegationIntentSchema
>

export const hexDataSchema = pipe(
  string(),
  regex(/^0x([0-9a-fA-F]{2})*$/),
)

export const sendSetCodeTransactionParametersSchema =
  object({
    to: addressSchema,
    value: optional(uintSchema),
    data: optional(hexDataSchema),
    gasLimit: optional(uintSchema),
    delegations: array(delegationIntentSchema),
  })
export type SendSetCodeTransactionParameters = InferOutput<
  typeof sendSetCodeTransactionParametersSchema
>

export function wallet_sendSetCodeTransaction(
  _parameters: SendSetCodeTransactionParameters,
): Signable<`0x${string}`> {
  return async ([signer]: ResolvedSigner) => {
    const parameters = parse(
      sendSetCodeTransactionParametersSchema,
      _parameters,
    )
    const result = await signer(
      "wallet_sendSetCodeTransaction",
      parameters,
    )
    return parse(hash32Schema, result)
  }
}
