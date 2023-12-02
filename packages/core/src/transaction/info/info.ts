import { Address, Hash32, Uint, addressSchema, hash32Schema, uintSchema } from "../../base";
import { object } from 'valibot'

/**
 * Transaction information object.
 */
export interface TransactionInfo {
  blockHash: Hash32;
  blockNumber: Uint;
  from: Address;
  hash: Hash32;
  transactionIndex: Uint;
}

export const transactionInfoSchema = object({
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  hash: hash32Schema,
  transactionIndex: uintSchema
})
