// https://github.com/ethereum-optimism/op-geth/blob/optimism/core/types/deposit_tx.go
// https://github.com/ethereum-optimism/op-geth/blob/optimism/core/types/transaction_marshalling.go
//
// op-geth surfaces deposit transactions (type 0x7e) inside
// `block.transactions` with six extra fields the base
// `TransactionInfoSchema` strips: `sourceHash`, `mint`, plus
// post-Canyon `l1BlockNumber`, `l1Timestamp`, `depositNonce`,
// and `depositReceiptVersion`. Regular L2 txs (1559, 2930,
// 4844, 7702, legacy) carry none of these.
//
// The union order matters — `OpDepositTxInfoSchema` requires
// `sourceHash` so it short-circuits on regular txs and the
// parser falls through to `TransactionInfoSchema`. This keeps
// the deposit-only extras out of the regular-tx surface area
// without forking the base schema.

import {
  AddressSchema,
  ByteSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { TransactionInfoSchema } from "@ethernauta/eth"
import type { InferOutput } from "valibot"
import {
  boolean,
  nullable,
  object,
  optional,
  union,
} from "valibot"

export const OpDepositTxInfoSchema = object({
  type: ByteSchema,
  blockHash: Hash32Schema,
  blockNumber: UintSchema,
  from: AddressSchema,
  hash: Hash32Schema,
  transactionIndex: UintSchema,
  nonce: UintSchema,
  gas: UintSchema,
  value: UintSchema,
  input: BytesSchema,
  to: nullable(AddressSchema),
  gasPrice: optional(nullable(UintSchema)),
  maxFeePerGas: optional(nullable(UintSchema)),
  maxPriorityFeePerGas: optional(nullable(UintSchema)),
  chainId: optional(nullable(UintSchema)),
  v: optional(UintSchema),
  r: optional(UintSchema),
  s: optional(UintSchema),
  yParity: optional(UintSchema),
  sourceHash: Hash32Schema,
  mint: UintSchema,
  isSystemTx: optional(boolean()),
  l1BlockNumber: optional(UintSchema),
  l1Timestamp: optional(UintSchema),
  depositNonce: optional(UintSchema),
  depositReceiptVersion: optional(UintSchema),
})
export type OpDepositTxInfo = InferOutput<
  typeof OpDepositTxInfoSchema
>

export const OpTransactionInfoSchema = union([
  OpDepositTxInfoSchema,
  TransactionInfoSchema,
])
export type OpTransactionInfo = InferOutput<
  typeof OpTransactionInfoSchema
>
