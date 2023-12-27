import type { Input } from "valibot"
import { array, boolean, nullable, object, optional } from "valibot"

import { addressSchema, byteSchema, bytes32Schema, bytesSchema, hash32Schema, uintSchema } from "../base"

export const logSchema = object({
  removed: boolean(),
  logIndex: uintSchema,
  transactionIndex: uintSchema,
  transactionHash: hash32Schema,
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  address: addressSchema,
  data: bytesSchema,
  topics: array(bytes32Schema),
})
export type Log = Input<typeof logSchema>

export const receiptInfoSchema = object({
  type: optional(byteSchema), // might not be present in all receipts
  transactionHash: hash32Schema,
  transactionIndex: uintSchema,
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  to: nullable(addressSchema),
  cumulativeGasUsed: uintSchema,
  gasUsed: uintSchema,
  blobGasUsed: optional(uintSchema), // only for blob transactions
  contractAddress: nullable(addressSchema),
  logs: array(logSchema),
  logsBloom: bytesSchema,
  root: optional(hash32Schema), // only for pre-Byzantium transactions
  status: optional(uintSchema), // only for post-Byzantium transactions
  effectiveGasPrice: uintSchema,
  blobGasPrice: optional(uintSchema), // only for blob transactions
})
export type ReceiptInfo = Input<typeof receiptInfoSchema>
