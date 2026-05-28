import {
  AddressSchema,
  Bytes8Schema,
  Bytes256Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import {
  array,
  literal,
  object,
  optional,
  union,
} from "valibot"
import { TransactionInfoSchema } from "./transaction"
import { WithdrawalSchema } from "./withdrawal"

export const BlockTagSchema = union([
  literal("earliest"),
  literal("finalized"),
  literal("safe"),
  literal("latest"),
  literal("pending"),
])
export type BlockTag = InferOutput<typeof BlockTagSchema>

export const BlockNumberOrTagSchema = union([
  UintSchema,
  BlockTagSchema,
])
export type BlockNumberOrTag = InferOutput<
  typeof BlockNumberOrTagSchema
>

export const BlockNumberOrTagOrHashSchema = union([
  UintSchema,
  BlockTagSchema,
  Hash32Schema,
])
export type BlockNumberOrTagOrHash = InferOutput<
  typeof BlockNumberOrTagOrHashSchema
>

export const BlockSchema = object({
  hash: Hash32Schema,
  parentHash: Hash32Schema,
  sha3Uncles: Hash32Schema,
  miner: AddressSchema,
  stateRoot: Hash32Schema,
  transactionsRoot: Hash32Schema,
  receiptsRoot: Hash32Schema,
  logsBloom: Bytes256Schema,
  difficulty: optional(UintSchema),
  number: UintSchema,
  gasLimit: UintSchema,
  gasUsed: UintSchema,
  timestamp: UintSchema,
  extraData: BytesSchema,
  mixHash: Hash32Schema,
  nonce: Bytes8Schema,
  totalDifficulty: optional(UintSchema),
  baseFeePerGas: optional(UintSchema),
  withdrawalsRoot: optional(Hash32Schema),
  blobGasUsed: optional(UintSchema),
  excessBlobGas: optional(UintSchema),
  parentBeaconBlockRoot: optional(Hash32Schema),
  size: UintSchema,
  transactions: union([
    array(Hash32Schema),
    array(TransactionInfoSchema),
  ]),
  withdrawals: optional(array(WithdrawalSchema)),
  uncles: array(Hash32Schema),
})
export type Block = InferOutput<typeof BlockSchema>

export const BadBlockSchema = object({
  block: BlockSchema,
  hash: Hash32Schema,
  rlp: BytesSchema,
})
export type BadBlock = InferOutput<typeof BadBlockSchema>
