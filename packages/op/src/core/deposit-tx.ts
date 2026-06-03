// https://specs.optimism.io/protocol/deposits.html#the-deposited-transaction-type
//
// The eight-field user-deposit envelope (transaction type
// 0x7e). On the wire each numeric field is the JSON-RPC
// `0x`-prefixed hex (no leading zeroes) emitted by op-geth;
// `to` is the empty byte string for contract-creation deposits,
// surfaced here as `null` to keep the encoded zero-length
// `to` distinct from a zero-address deposit.

import {
  AddressSchema,
  BytesSchema,
  Hash32Schema,
  UintSchema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { boolean, nullable, object } from "valibot"

export const DepositTxSchema = object({
  source_hash: Hash32Schema,
  from: AddressSchema,
  to: nullable(AddressSchema),
  mint: UintSchema,
  value: UintSchema,
  gas: UintSchema,
  is_system_tx: boolean(),
  data: BytesSchema,
})
export type DepositTx = InferOutput<typeof DepositTxSchema>
