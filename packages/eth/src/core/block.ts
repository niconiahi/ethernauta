import type { InferOutput } from "valibot"
import {
  array,
  literal,
  object,
  optional,
  union,
} from "valibot"

import {
  addressSchema,
  bytes8Schema,
  bytes256Schema,
  bytesSchema,
  Hash32Schema,
  uintSchema,
} from "./base"
import { TransactionInfoSchema } from "./transaction"
import { withdrawalSchema } from "./withdrawal"

export const blockTagSchema = union([
  literal("earliest"),
  literal("finalized"),
  literal("safe"),
  literal("latest"),
  literal("pending"),
])
export type BlockTag = InferOutput<typeof blockTagSchema>

export const blockNumberOrTagSchema = union([
  uintSchema,
  blockTagSchema,
])
export type BlockNumberOrTag = InferOutput<
  typeof blockNumberOrTagSchema
>

export const blockNumberOrTagOrHashSchema = union([
  uintSchema,
  blockTagSchema,
  Hash32Schema,
])
export type BlockNumberOrTagOrHash = InferOutput<
  typeof blockNumberOrTagOrHashSchema
>

export const blockSchema = object({
  hash: Hash32Schema,
  parentHash: Hash32Schema,
  sha3Uncles: Hash32Schema,
  miner: addressSchema,
  stateRoot: Hash32Schema,
  transactionsRoot: Hash32Schema,
  receiptsRoot: Hash32Schema,
  logsBloom: bytes256Schema,
  difficulty: optional(uintSchema),
  number: uintSchema,
  gasLimit: uintSchema,
  gasUsed: uintSchema,
  timestamp: uintSchema,
  extraData: bytesSchema,
  mixHash: Hash32Schema,
  nonce: bytes8Schema,
  totalDifficulty: optional(uintSchema),
  baseFeePerGas: optional(uintSchema),
  withdrawalsRoot: optional(Hash32Schema),
  blobGasUsed: optional(uintSchema),
  excessBlobGas: optional(uintSchema),
  parentBeaconBlockRoot: optional(Hash32Schema),
  size: uintSchema,
  transactions: union([
    array(Hash32Schema),
    array(TransactionInfoSchema),
  ]),
  withdrawals: optional(array(withdrawalSchema)),
  uncles: array(Hash32Schema),
})
export type Block = InferOutput<typeof blockSchema>

export const badBlockSchema = object({
  block: blockSchema,
  hash: Hash32Schema,
  rlp: bytesSchema,
})
export type BadBlock = InferOutput<typeof badBlockSchema>
