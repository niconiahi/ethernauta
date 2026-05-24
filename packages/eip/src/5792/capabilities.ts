// https://eips.ethereum.org/EIPS/eip-5792

import {
  addressSchema,
  bytesSchema,
  hash32Schema,
  uintSchema,
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

export const capabilitiesSchema = record(
  string(),
  record(string(), unknown()),
)
export type Capabilities = InferOutput<
  typeof capabilitiesSchema
>

export const sendCallsCallSchema = object({
  to: optional(addressSchema),
  data: optional(bytesSchema),
  value: optional(uintSchema),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsCall = InferOutput<
  typeof sendCallsCallSchema
>

export const sendCallsParameterSchema = object({
  version: string(),
  id: optional(string()),
  from: optional(addressSchema),
  chainId: uintSchema,
  atomicRequired: optional(boolean()),
  calls: array(sendCallsCallSchema),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsParameter = InferOutput<
  typeof sendCallsParameterSchema
>

export const sendCallsParametersSchema = array(
  sendCallsParameterSchema,
)
export type SendCallsParameters = InferOutput<
  typeof sendCallsParametersSchema
>

export const sendCallsResultSchema = object({
  id: string(),
  capabilities: optional(record(string(), unknown())),
})
export type SendCallsResult = InferOutput<
  typeof sendCallsResultSchema
>

export const callsStatusCodeSchema = pipe(
  number(),
  integer(),
)
export type CallsStatusCode = InferOutput<
  typeof callsStatusCodeSchema
>

export const CALLS_STATUS = {
  PENDING: 100,
  CONFIRMED: 200,
  FAILED_OFFCHAIN: 400,
  REVERTED: 500,
  PARTIALLY_REVERTED: 600,
} as const

export const callsReceiptLogSchema = object({
  address: addressSchema,
  topics: array(hash32Schema),
  data: string(),
})
export type CallsReceiptLog = InferOutput<
  typeof callsReceiptLogSchema
>

export const callsReceiptSchema = object({
  logs: array(callsReceiptLogSchema),
  status: uintSchema,
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  gasUsed: uintSchema,
  transactionHash: hash32Schema,
})
export type CallsReceipt = InferOutput<
  typeof callsReceiptSchema
>

export const callsStatusSchema = object({
  version: string(),
  id: string(),
  chainId: uintSchema,
  status: callsStatusCodeSchema,
  atomic: boolean(),
  receipts: optional(array(callsReceiptSchema)),
  capabilities: optional(record(string(), unknown())),
})
export type CallsStatus = InferOutput<
  typeof callsStatusSchema
>
