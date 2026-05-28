// https://eips.ethereum.org/EIPS/eip-5792

import {
  AddressSchema,
  Bytes32Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import {
  array,
  boolean,
  type InferOutput,
  integer,
  number,
  object,
  optional,
  pipe,
  record,
  string,
  unknown,
} from "valibot"

export const CapabilitiesSchema = record(
  string(),
  record(string(), unknown()),
)
export type Capabilities = InferOutput<
  typeof CapabilitiesSchema
>

export const SendCallsCallSchema = object({
  to: optional(AddressSchema),
  data: optional(BytesSchema),
  value: optional(UintSchema),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsCall = InferOutput<
  typeof SendCallsCallSchema
>

export const SendCallsParameterSchema = object({
  version: string(),
  id: optional(string()),
  from: optional(AddressSchema),
  chainId: UintSchema,
  atomicRequired: optional(boolean()),
  calls: array(SendCallsCallSchema),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsParameter = InferOutput<
  typeof SendCallsParameterSchema
>

export const SendCallsParametersSchema = array(
  SendCallsParameterSchema,
)
export type SendCallsParameters = InferOutput<
  typeof SendCallsParametersSchema
>

export const SendCallsResultSchema = object({
  id: string(),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsResult = InferOutput<
  typeof SendCallsResultSchema
>

export const CallsStatusCodeSchema = pipe(
  number(),
  integer(),
)
export type CallsStatusCode = InferOutput<
  typeof CallsStatusCodeSchema
>

export const CALLS_STATUS = {
  PENDING: 100,
  CONFIRMED: 200,
  FAILED_OFFCHAIN: 400,
  REVERTED: 500,
  PARTIALLY_REVERTED: 600,
} as const

export const CallsReceiptLogSchema = object({
  address: AddressSchema,
  topics: array(Bytes32Schema),
  data: BytesSchema,
})
export type CallsReceiptLog = InferOutput<
  typeof CallsReceiptLogSchema
>

export const CallsReceiptSchema = object({
  logs: array(CallsReceiptLogSchema),
  status: UintSchema,
  blockHash: Hash32Schema,
  blockNumber: UintSchema,
  gasUsed: UintSchema,
  transactionHash: Hash32Schema,
})
export type CallsReceipt = InferOutput<
  typeof CallsReceiptSchema
>

export const CallsStatusSchema = object({
  version: string(),
  id: string(),
  chainId: UintSchema,
  status: CallsStatusCodeSchema,
  atomic: boolean(),
  receipts: optional(array(CallsReceiptSchema)),
  capabilities: optional(record(string(), unknown())),
})
export type CallsStatus = InferOutput<
  typeof CallsStatusSchema
>
