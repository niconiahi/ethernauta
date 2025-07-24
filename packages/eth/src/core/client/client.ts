import type { InferOutput } from "valibot"
import { literal, object, union } from "valibot"

import { uintSchema } from "../base"

export const syncingProgressSchema = object({
  startingBlock: uintSchema,
  currentBlock: uintSchema,
  highestBlock: uintSchema,
})
export type SyncingProgress = InferOutput<typeof syncingProgressSchema>

export const syncingStatusSchema = union([syncingProgressSchema, literal(false)])
export type SyncingStatus = InferOutput<typeof syncingStatusSchema>
