// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/fee_model.rs
// Return shape of `zks_getBatchFeeInput`. Snake-case on the wire
// (the upstream struct has no `rename_all` attribute) — the three
// inputs the chain's pubdata-independent fee model consumes.

import { Uint64Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object } from "valibot"

export const PubdataIndependentBatchFeeModelInputSchema =
  object({
    fair_l2_gas_price: Uint64Schema,
    fair_pubdata_price: Uint64Schema,
    l1_gas_price: Uint64Schema,
  })
export type PubdataIndependentBatchFeeModelInput =
  InferOutput<
    typeof PubdataIndependentBatchFeeModelInputSchema
  >
