import { uintSchema } from "../base";
import { Input, literal, object, union } from "valibot";

export const syncingProgressSchema = object({
  startingBlock: uintSchema,
  currentBlock: uintSchema,
  highestBlock: uintSchema,
})
export type SyncingProgress = Input<typeof syncingProgressSchema>

export const syncingStatusSchema = union([syncingProgressSchema, literal(false)])
export type SyncingStatus = Input<typeof syncingStatusSchema>
