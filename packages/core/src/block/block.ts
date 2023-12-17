import type { Input } from "valibot"
import { array, literal, object, optional, union } from "valibot"

import {
  addressSchema,
  bytes256Schema,
  bytes8Schema,
  bytesSchema,
  hash32Schema,
  uintSchema,
} from "../base"
import { transactionInfoSchema } from "../transaction"
import { withdrawalSchema } from "../withdrawal"

export const blockTagSchema = union([literal("earliest"), literal("finalized"), literal("safe"), literal("latest"), literal("pending")])
export type BlockTag = Input<typeof blockTagSchema>

export const blockNumberOrTagSchema = union([uintSchema, blockTagSchema])
export type BlockNumberOrTag = Input<typeof blockNumberOrTagSchema>

export const blockNumberOrTagOrHashSchema = union([uintSchema, blockTagSchema, hash32Schema])
export type BlockNumberOrTagOrHash = Input<typeof blockNumberOrTagOrHashSchema>

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
  rlp: bytesSchema,
})
export type BadBlock = Input<typeof badBlockSchema>
