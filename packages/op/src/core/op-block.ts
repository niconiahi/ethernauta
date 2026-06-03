// https://github.com/ethereum/execution-apis/blob/main/src/eth/block.yaml
//
// OP-aware block schema. Field list mirrors `@ethernauta/eth`'s
// base `BlockSchema` — the only structural difference is the
// `transactions` union: the hydrated branch is
// `array(OpTransactionInfoSchema)` so deposit-tx entries
// surface their extra fields. valibot has no in-place "override
// one field" on an existing object schema, so the field list
// is duplicated rather than intersected (intersect would
// collapse the deposit-tx branch since the OP union is a
// superset of the base info schema).
//
// If the base block shape ever drifts, this file needs the
// same drift applied — the test suite catches drift indirectly
// by replaying a real op-mainnet block through both schemas.

import {
  AddressSchema,
  Bytes8Schema,
  Bytes256Schema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import { WithdrawalSchema } from "@ethernauta/eth"
import type { InferOutput } from "valibot"
import { array, object, optional, union } from "valibot"

import { OpTransactionInfoSchema } from "./op-transaction"

export const OpBlockSchema = object({
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
    array(OpTransactionInfoSchema),
  ]),
  withdrawals: optional(array(WithdrawalSchema)),
  uncles: array(Hash32Schema),
})
export type OpBlock = InferOutput<typeof OpBlockSchema>
