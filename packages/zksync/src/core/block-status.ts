// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/api/mod.rs
// L2 block lifecycle on the settlement layer. `sealed` once the
// block is closed by the sequencer; `verified` once its containing
// L1 batch has been executed on L1.

import type { InferOutput } from "valibot"
import { picklist } from "valibot"

export const BlockStatusSchema = picklist([
  "sealed",
  "verified",
])
export type BlockStatus = InferOutput<
  typeof BlockStatusSchema
>
