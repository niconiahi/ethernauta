import {
  Address,
  Bytes,
  Hash32,
  Uint,
  Bytes256,
  Bytes8,
  uintSchema,
  hash32Schema,
  addressSchema,
  bytes256Schema,
  bytesSchema,
  bytes8Schema
} from "../base";
import { TransactionInfo, transactionInfoSchema } from "../transaction";
import { Withdrawal, withdrawalSchema } from "../withdrawal";
import { Input, array, literal, object, optional, union } from "valibot";

export const blockTagSchema = union([literal("earliest"), literal("finalized"), literal("safe"), literal("latest"), literal("pending")])
export type BlockTag = Input<typeof blockTagSchema>

export const blockNumberOrTag = union([uintSchema, blockTagSchema])
export type BlockNumberOrTag = Input<typeof blockNumberOrTag>

export const blockNumberOrTagOrHash = union([uintSchema, blockTagSchema, hash32Schema])
export type BlockNumberOrTagOrHash = Input<typeof blockNumberOrTagOrHash>

export const blockSchema = object({
  hash: hash32Schema,
  parentHash: hash32Schema,
  sha3Uncles: hash32Schema,
  miner: addressSchema,
  stateRoot: hash32Schema,
  transactionsRoot: hash32Schema,
  receiptsRoot: hash32Schema,
  logsBloom: bytes256Schema,
  difficulty: optional(uintSchema),
  number: uintSchema,
  gasLimit: uintSchema,
  gasUsed: uintSchema,
  timestamp: uintSchema,
  extraData: bytesSchema,
  mixHash: hash32Schema,
  nonce: bytes8Schema,
  totalDifficulty: optional(uintSchema),
  baseFeePerGas: optional(uintSchema),
  withdrawalsRoot: optional(hash32Schema),
  blobGasUsed: optional(uintSchema),
  excessBlobGas: optional(uintSchema),
  parentBeaconBlockRoot: optional(hash32Schema),
  size: uintSchema,
  transactions: union([array(hash32Schema), array(transactionInfoSchema)]),
  withdrawals: optional(array(withdrawalSchema)),
  uncles: array(hash32Schema),
})
export type Block = Input<typeof blockSchema>

export const badBlockSchema = object({
  block: blockSchema,
  hash: hash32Schema,
  rlp: bytesSchema
})
export type BadBlock = Input<typeof badBlockSchema>
