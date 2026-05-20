// https://github.com/ethereum/execution-apis/blob/main/src/eth/transaction.yaml
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  nullable,
  object,
  optional,
} from "valibot"

import {
  addressSchema,
  byteSchema,
  bytes32Schema,
  bytes256Schema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"

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
export type Log = InferOutput<typeof logSchema>

export const receiptInfoSchema = object({
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  cumulativeGasUsed: uintSchema,
  gasUsed: uintSchema,
  logs: array(logSchema),
  logsBloom: bytes256Schema,
  transactionHash: hash32Schema,
  transactionIndex: uintSchema,
  effectiveGasPrice: uintSchema,
  type: optional(byteSchema), // might not be present in all receipts
  to: nullable(addressSchema),
  blobGasUsed: optional(uintSchema), // only for blob transactions
  root: optional(hash32Schema), // only for pre-Byzantium transactions
  status: optional(uintSchema), // only for post-Byzantium transactions
  blobGasPrice: optional(uintSchema), // only for blob transactions
  contractAddress: nullable(addressSchema),
})
export type ReceiptInfo = InferOutput<
  typeof receiptInfoSchema
>
