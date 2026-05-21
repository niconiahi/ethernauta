// https://eips.ethereum.org/EIPS/eip-4337
// Account-Abstraction (v0.7). EntryPoint canonical address:
// 0x0000000071727De22E5E9d8BAf0edAc6f37da032

import {
  addressSchema,
  bytes32Schema,
  bytesSchema,
  hash32Schema,
  uintSchema,
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
export const userOperationSchema = object({
  sender: addressSchema,
  nonce: uintSchema,
  factory: optional(addressSchema),
  factoryData: optional(bytesSchema),
  callData: bytesSchema,
  callGasLimit: uintSchema,
  verificationGasLimit: uintSchema,
  preVerificationGas: uintSchema,
  maxFeePerGas: uintSchema,
  maxPriorityFeePerGas: uintSchema,
  paymaster: optional(addressSchema),
  paymasterVerificationGasLimit: optional(uintSchema),
  paymasterPostOpGasLimit: optional(uintSchema),
  paymasterData: optional(bytesSchema),
  signature: bytesSchema,
})
export type UserOperation = InferOutput<
  typeof userOperationSchema
>

// EntryPoint v0.7 storage layout. Composite fields are
// already packed — see ./packing.ts for the rules.
export const packedUserOperationSchema = object({
  sender: addressSchema,
  nonce: uintSchema,
  initCode: bytesSchema,
  callData: bytesSchema,
  accountGasLimits: bytes32Schema,
  preVerificationGas: uintSchema,
  gasFees: bytes32Schema,
  paymasterAndData: bytesSchema,
  signature: bytesSchema,
})
export type PackedUserOperation = InferOutput<
  typeof packedUserOperationSchema
>

export const userOperationByHashSchema = object({
  userOperation: userOperationSchema,
  entryPoint: addressSchema,
  blockNumber: optional(uintSchema),
  blockHash: optional(hash32Schema),
  transactionHash: optional(hash32Schema),
})
export type UserOperationByHash = InferOutput<
  typeof userOperationByHashSchema
>

export const userOperationLogSchema = object({
  address: addressSchema,
  topics: array(hash32Schema),
  data: bytesSchema,
})

export const userOperationReceiptSchema = object({
  userOpHash: hash32Schema,
  entryPoint: addressSchema,
  sender: addressSchema,
  nonce: uintSchema,
  paymaster: optional(addressSchema),
  actualGasCost: uintSchema,
  actualGasUsed: uintSchema,
  success: optional(uintSchema),
  reason: optional(bytesSchema),
  logs: array(userOperationLogSchema),
  receipt: object({
    transactionHash: hash32Schema,
    blockHash: hash32Schema,
    blockNumber: uintSchema,
  }),
})
export type UserOperationReceipt = InferOutput<
  typeof userOperationReceiptSchema
>

export const estimateUserOperationGasResultSchema = object({
  preVerificationGas: uintSchema,
  verificationGasLimit: uintSchema,
  callGasLimit: uintSchema,
  paymasterVerificationGasLimit: optional(uintSchema),
  paymasterPostOpGasLimit: optional(uintSchema),
})
export type EstimateUserOperationGasResult = InferOutput<
  typeof estimateUserOperationGasResultSchema
>
