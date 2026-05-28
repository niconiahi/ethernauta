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
  AddressSchema,
  Hash32Schema,
  UintSchema,
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

export const DelegationIntentSchema = object({
  chainId: UintSchema,
  address: AddressSchema,
})
export type DelegationIntent = InferOutput<
  typeof DelegationIntentSchema
>

export const HexDataSchema = pipe(
  string(),
  regex(/^0x([0-9a-fA-F]{2})*$/),
)

export const SendSetCodeTransactionParametersSchema =
  object({
    to: AddressSchema,
    value: optional(UintSchema),
    data: optional(HexDataSchema),
    gasLimit: optional(UintSchema),
    delegations: array(DelegationIntentSchema),
  })
export type SendSetCodeTransactionParameters = InferOutput<
  typeof SendSetCodeTransactionParametersSchema
>

export function wallet_sendSetCodeTransaction(
  _parameters: SendSetCodeTransactionParameters,
): Signable<`0x${string}`> {
  return async ([signer]: ResolvedSigner) => {
    const parameters = parse(
      SendSetCodeTransactionParametersSchema,
      _parameters,
    )
    const result = await signer(
      "wallet_sendSetCodeTransaction",
      parameters,
    )
    return parse(Hash32Schema, result)
  }
}
