// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/sync_status.go

import type { InferOutput } from "valibot"
import { object, optional } from "valibot"

import {
  L1BlockRefSchema,
  L2BlockRefSchema,
} from "./block-ref"

// pending_safe_l2, cross_unsafe_l2 and local_safe_l2 are
// interop-era additions; pre-interop op-node deployments
// omit them.
export const SyncStatusSchema = object({
  current_l1: L1BlockRefSchema,
  current_l1_finalized: L1BlockRefSchema,
  head_l1: L1BlockRefSchema,
  safe_l1: L1BlockRefSchema,
  finalized_l1: L1BlockRefSchema,
  unsafe_l2: L2BlockRefSchema,
  safe_l2: L2BlockRefSchema,
  finalized_l2: L2BlockRefSchema,
  pending_safe_l2: optional(L2BlockRefSchema),
  cross_unsafe_l2: optional(L2BlockRefSchema),
  local_safe_l2: optional(L2BlockRefSchema),
})
export type SyncStatus = InferOutput<
  typeof SyncStatusSchema
>
