// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/fee_model.rs
// Operator-chosen static fee-model knobs. V1 only knows about the
// L2 gas-price floor; V2 added the pubdata cost dimension and batch
// overhead split.

import { Uint64Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object, string, union } from "valibot"

export const FeeModelConfigV1Schema = object({
  minimal_l2_gas_price: Uint64Schema,
})
export type FeeModelConfigV1 = InferOutput<
  typeof FeeModelConfigV1Schema
>

// `compute_overhead_part` and `pubdata_overhead_part` are `f64` in
// Rust; serde emits them as JSON numbers, which arrive as either
// floating-point literals or stringified decimals depending on the
// node's serializer. Accept both shapes so the schema doesn't
// trip on either path.
export const FeeModelConfigV2Schema = object({
  minimal_l2_gas_price: Uint64Schema,
  compute_overhead_part: union([string(), Uint64Schema]),
  pubdata_overhead_part: union([string(), Uint64Schema]),
  batch_overhead_l1_gas: Uint64Schema,
  max_gas_per_batch: Uint64Schema,
  max_pubdata_per_batch: Uint64Schema,
})
export type FeeModelConfigV2 = InferOutput<
  typeof FeeModelConfigV2Schema
>
