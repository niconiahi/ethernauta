// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/output.go

import {
  Bytes32Schema,
  Hash32Schema,
} from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object, optional } from "valibot"

import { L2BlockRefSchema } from "./block-ref"
import { SyncStatusSchema } from "./sync-status"

// `Status *SyncStatus` is a pointer in Go but op-node always
// populates it for this RPC — kept optional defensively in
// case a future build elides it.
export const OutputResponseSchema = object({
  version: Bytes32Schema,
  outputRoot: Bytes32Schema,
  blockRef: L2BlockRefSchema,
  withdrawalStorageRoot: Hash32Schema,
  stateRoot: Hash32Schema,
  syncStatus: optional(SyncStatusSchema),
})
export type OutputResponse = InferOutput<
  typeof OutputResponseSchema
>
