// https://github.com/ethereum/execution-apis/blob/main/src/eth/transaction.yaml

import {
  addressSchema,
  byteSchema,
  bytes256Schema,
  bytes32Schema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  array,
  boolean,
  nullable,
  object,
  optional,
  picklist,
  safeParse,
} from "valibot"

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

// Post-Byzantium tightening of `receiptInfoSchema`: `status` is
// required and narrowed to `"0x0"` (reverted) or `"0x1"` (success)
// per the spec. Use via `is_post_byzantium(receipt)` to discriminate
// at the consumer boundary — the guard wraps a Valibot `safeParse`
// so the schema remains the single source of truth (no parallel
// hand-rolled predicate per R0.4).
export const postByzantiumReceiptSchema = object({
  ...receiptInfoSchema.entries,
  status: picklist(["0x0", "0x1"]),
})
export type PostByzantiumReceiptInfo = InferOutput<
  typeof postByzantiumReceiptSchema
>

export function is_post_byzantium(
  _receipt: ReceiptInfo,
): _receipt is PostByzantiumReceiptInfo {
  return safeParse(postByzantiumReceiptSchema, _receipt)
    .success
}
