// https://eips.ethereum.org/EIPS/eip-4337
// Account-Abstraction (v0.7). EntryPoint canonical address:
// 0x0000000071727De22E5E9d8BAf0edAc6f37da032

import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  array,
  type InferOutput,
  object,
  optional,
} from "valibot"

// JSON-RPC facing UserOperation. v0.7 splits the packed
// composite fields back into discrete keys so bundlers can
// reason about each gas component independently.
export const UserOperationSchema = object({
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
  paymaster: optional(AddressSchema),
  paymasterVerificationGasLimit: optional(UintSchema),
  paymasterPostOpGasLimit: optional(UintSchema),
  paymasterData: optional(BytesSchema),
  signature: BytesSchema,
})
export type UserOperation = InferOutput<
  typeof UserOperationSchema
>

// EntryPoint v0.7 storage layout. Composite fields are
// already packed — see ./packing.ts for the rules.
export const PackedUserOperationSchema = object({
  sender: AddressSchema,
  nonce: UintSchema,
  initCode: BytesSchema,
  callData: BytesSchema,
  accountGasLimits: Bytes32Schema,
  preVerificationGas: UintSchema,
  gasFees: Bytes32Schema,
  paymasterAndData: BytesSchema,
  signature: BytesSchema,
})
export type PackedUserOperation = InferOutput<
  typeof PackedUserOperationSchema
>

export const UserOperationByHashSchema = object({
  userOperation: UserOperationSchema,
  entryPoint: AddressSchema,
  blockNumber: optional(UintSchema),
  blockHash: optional(Hash32Schema),
  transactionHash: optional(Hash32Schema),
})
export type UserOperationByHash = InferOutput<
  typeof UserOperationByHashSchema
>

export const UserOperationLogSchema = object({
  address: AddressSchema,
  topics: array(Hash32Schema),
  data: BytesSchema,
})

export const UserOperationReceiptSchema = object({
  userOpHash: Hash32Schema,
  entryPoint: AddressSchema,
  sender: AddressSchema,
  nonce: UintSchema,
  paymaster: optional(AddressSchema),
  actualGasCost: UintSchema,
  actualGasUsed: UintSchema,
  success: optional(UintSchema),
  reason: optional(BytesSchema),
  logs: array(UserOperationLogSchema),
  receipt: object({
    transactionHash: Hash32Schema,
    blockHash: Hash32Schema,
    blockNumber: UintSchema,
  }),
})
export type UserOperationReceipt = InferOutput<
  typeof UserOperationReceiptSchema
>

export const EstimateUserOperationGasResultSchema = object({
  preVerificationGas: UintSchema,
  verificationGasLimit: UintSchema,
  callGasLimit: UintSchema,
  paymasterVerificationGasLimit: optional(UintSchema),
  paymasterPostOpGasLimit: optional(UintSchema),
})
export type EstimateUserOperationGasResult = InferOutput<
  typeof EstimateUserOperationGasResultSchema
>
