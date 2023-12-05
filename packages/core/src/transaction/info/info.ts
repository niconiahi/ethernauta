import { object } from "valibot"
import type { Address, Hash32, Uint } from "../../base"
import { addressSchema, hash32Schema, uintSchema } from "../../base"

/**
 * Transaction information object.
 */
export interface TransactionInfo {
  blockHash: Hash32
  blockNumber: Uint
  from: Address
  hash: Hash32
  transactionIndex: Uint
}

export const transactionInfoSchema = object({
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: hash32Schema,
  transactionIndex: uintSchema,
})
