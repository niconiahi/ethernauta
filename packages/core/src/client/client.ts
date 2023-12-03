import { uintSchema } from "../base";
import { Input, boolean, object, union } from "valibot";

export const syncingProgressSchema = object({
  startingBlock: uintSchema,
  currentBlock: uintSchema,
  highestBlock: uintSchema,
})
export type SyncingProgress = Input<typeof syncingProgressSchema>

export const syncingSchema = union([syncingProgressSchema, boolean()])
export type SyncingStatus = Input<typeof syncingSchema>
