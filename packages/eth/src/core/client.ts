import { UintSchema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { literal, object, union } from "valibot"

export const SyncingProgressSchema = object({
  startingBlock: UintSchema,
  currentBlock: UintSchema,
  highestBlock: UintSchema,
})
export type SyncingProgress = InferOutput<
  typeof SyncingProgressSchema
>

export const SyncingStatusSchema = union([
  SyncingProgressSchema,
  literal(false),
])
export type SyncingStatus = InferOutput<
  typeof SyncingStatusSchema
>
