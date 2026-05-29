// https://eips.ethereum.org/EIPS/eip-7677

import {
  AddressSchema,
  BytesSchema,
  UintSchema,
} from "@ethernauta/core"
import {
  boolean,
  type InferOutput,
  object,
  optional,
  record,
  string,
  union,
  unknown,
} from "valibot"

// The userOp subset the paymaster sees pre-sponsorship.
// No paymaster fields (those are what we're asking for), no
// signature (paymaster signs over the rest).
export const PaymasterUserOperationSchema = object({
  sender: AddressSchema,
  nonce: UintSchema,
  initCode: BytesSchema,
  callData: BytesSchema,
  callGasLimit: UintSchema,
  verificationGasLimit: UintSchema,
  preVerificationGas: UintSchema,
  maxFeePerGas: UintSchema,
  maxPriorityFeePerGas: UintSchema,
})
export type PaymasterUserOperation = InferOutput<
  typeof PaymasterUserOperationSchema
>

export const ContextSchema = record(string(), unknown())
export type Context = InferOutput<typeof ContextSchema>

export const SponsorSchema = object({
  name: string(),
  icon: optional(string()),
})
export type Sponsor = InferOutput<typeof SponsorSchema>

// v0.7 first in each union — its required-key set is the
// stricter superset, so the order rejects ambiguous payloads
// before falling back to the v0.6 shape.

export const PaymasterStubDataV07Schema = object({
  paymaster: AddressSchema,
  paymasterData: BytesSchema,
  paymasterVerificationGasLimit: optional(UintSchema),
  paymasterPostOpGasLimit: UintSchema,
  sponsor: optional(SponsorSchema),
  isFinal: optional(boolean()),
})
export type PaymasterStubDataV07 = InferOutput<
  typeof PaymasterStubDataV07Schema
>

export const PaymasterStubDataV06Schema = object({
  paymasterAndData: BytesSchema,
  sponsor: optional(SponsorSchema),
  isFinal: optional(boolean()),
})
export type PaymasterStubDataV06 = InferOutput<
  typeof PaymasterStubDataV06Schema
>

export const PaymasterStubDataSchema = union([
  PaymasterStubDataV07Schema,
  PaymasterStubDataV06Schema,
])
export type PaymasterStubData = InferOutput<
  typeof PaymasterStubDataSchema
>

export const PaymasterDataV07Schema = object({
  paymaster: AddressSchema,
  paymasterData: BytesSchema,
})
export type PaymasterDataV07 = InferOutput<
  typeof PaymasterDataV07Schema
>

export const PaymasterDataV06Schema = object({
  paymasterAndData: BytesSchema,
})
export type PaymasterDataV06 = InferOutput<
  typeof PaymasterDataV06Schema
>

export const PaymasterDataSchema = union([
  PaymasterDataV07Schema,
  PaymasterDataV06Schema,
])
export type PaymasterData = InferOutput<
  typeof PaymasterDataSchema
>
