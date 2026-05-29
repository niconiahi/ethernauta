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
// signature (paymaster signs over the rest). The wire shape
// follows the targeted EntryPoint version: v0.6 carries
// `initCode`; v0.7 splits it into optional `factory` +
// `factoryData` (both absent for already-deployed accounts).

export const PaymasterUserOperationV06Schema = object({
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
export type PaymasterUserOperationV06 = InferOutput<
  typeof PaymasterUserOperationV06Schema
>

export const PaymasterUserOperationV07Schema = object({
  sender: AddressSchema,
  nonce: UintSchema,
  factory: optional(AddressSchema),
  factoryData: optional(BytesSchema),
  callData: BytesSchema,
  callGasLimit: UintSchema,
  verificationGasLimit: UintSchema,
  preVerificationGas: UintSchema,
  maxFeePerGas: UintSchema,
  maxPriorityFeePerGas: UintSchema,
})
export type PaymasterUserOperationV07 = InferOutput<
  typeof PaymasterUserOperationV07Schema
>

// v0.6 first: its required `initCode` is the only field that
// discriminates the variants on the input side. With the
// reverse order a v0.6 payload would silently match v0.7
// (whose only v0.7-specific fields are optional) and drop
// `initCode` on the way to the wire.
export const PaymasterUserOperationSchema = union([
  PaymasterUserOperationV06Schema,
  PaymasterUserOperationV07Schema,
])
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
