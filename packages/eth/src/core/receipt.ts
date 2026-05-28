// https://github.com/ethereum/execution-apis/blob/main/src/eth/transaction.yaml

import {
  AddressSchema,
  ByteSchema,
  Bytes32Schema,
  Bytes256Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  nullable,
  object,
  optional,
} from "valibot"

export const LogSchema = object({
  removed: boolean(),
  logIndex: UintSchema,
  transactionIndex: UintSchema,
  transactionHash: Hash32Schema,
  blockHash: Hash32Schema,
  blockNumber: UintSchema,
  address: AddressSchema,
  data: BytesSchema,
  topics: array(Bytes32Schema),
})
export type Log = InferOutput<typeof LogSchema>

export const ReceiptInfoSchema = object({
  blockHash: Hash32Schema,
  blockNumber: UintSchema,
  from: AddressSchema,
  cumulativeGasUsed: UintSchema,
  gasUsed: UintSchema,
  logs: array(LogSchema),
  logsBloom: Bytes256Schema,
  transactionHash: Hash32Schema,
  transactionIndex: UintSchema,
  effectiveGasPrice: UintSchema,
  type: optional(ByteSchema), // might not be present in all receipts
  to: nullable(AddressSchema),
  blobGasUsed: optional(UintSchema), // only for blob transactions
  root: optional(Hash32Schema), // only for pre-Byzantium transactions
  status: optional(UintSchema), // only for post-Byzantium transactions
  blobGasPrice: optional(UintSchema), // only for blob transactions
  contractAddress: nullable(AddressSchema),
})
export type ReceiptInfo = InferOutput<
  typeof ReceiptInfoSchema
>
