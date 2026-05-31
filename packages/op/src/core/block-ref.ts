// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/blockref.go
// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/id.go

import { Hash32Schema, UintSchema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object } from "valibot"

// L2BlockRef / L1BlockRef custom-MarshalJSON: every numeric
// field is emitted as hexutil.Uint64 (`"0x..."` strings),
// and that custom marshaler controls every nested field too,
// including L1Origin.

export const L1OriginSchema = object({
  hash: Hash32Schema,
  number: UintSchema,
})
export type L1Origin = InferOutput<typeof L1OriginSchema>

export const L1BlockRefSchema = object({
  hash: Hash32Schema,
  number: UintSchema,
  parentHash: Hash32Schema,
  timestamp: UintSchema,
})
export type L1BlockRef = InferOutput<
  typeof L1BlockRefSchema
>

export const L2BlockRefSchema = object({
  hash: Hash32Schema,
  number: UintSchema,
  parentHash: Hash32Schema,
  timestamp: UintSchema,
  l1origin: L1OriginSchema,
  sequenceNumber: UintSchema,
})
export type L2BlockRef = InferOutput<
  typeof L2BlockRefSchema
>
