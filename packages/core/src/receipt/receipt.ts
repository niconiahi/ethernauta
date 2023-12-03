import { Address, Bytes, Hash32, Uint, Bytes32, Byte, byteSchema, hash32Schema, uintSchema, addressSchema, bytesSchema, bytes32Schema } from "../base";
import { Input, array, boolean, nullable, object, optional } from "valibot";

export interface Log {
  removed: boolean;
  logIndex: Uint;
  transactionIndex: Uint;
  transactionHash: Hash32;
  blockHash: Hash32;
  blockNumber: Uint;
  address: Address;
  data: Bytes;
  topics: Bytes32[];
}
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

export const receiptInfoSchema = object({
  type: optional(byteSchema), // Optional: might not be present in all receipts
  transactionHash: hash32Schema,
  transactionIndex: uintSchema,
  blockHash: hash32Schema,
  blockNumber: uintSchema,
  from: addressSchema,
  to: nullable(addressSchema),
  cumulativeGasUsed: uintSchema,
  gasUsed: uintSchema,
  blobGasUsed: optional(uintSchema), // Optional: only for blob transactions
  contractAddress: nullable(addressSchema),
  logs: array(logSchema),
  logsBloom: bytesSchema,
  root: optional(hash32Schema), // Optional: only for pre-Byzantium transactions
  status: optional(uintSchema), // Optional: only for post-Byzantium transactions
  effectiveGasPrice: uintSchema,
  blobGasPrice: optional(uintSchema) // Optional: only for blob transactions
})
export type ReceiptInfo = Input<typeof receiptInfoSchema>
