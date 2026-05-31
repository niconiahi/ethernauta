// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/fee_model.rs
// Return shape of `zks_getFeeParams`. Upstream uses serde's default
// external tagging on the `FeeParams` enum, so the wire emits either
// `{ "V1": { ... } }` or `{ "V2": { ... } }`.

import { Uint64Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { object, union } from "valibot"

import { BaseTokenConversionRatioSchema } from "./conversion-ratio"
import {
  FeeModelConfigV1Schema,
  FeeModelConfigV2Schema,
} from "./fee-model-config"

export const FeeParamsV1Schema = object({
  config: FeeModelConfigV1Schema,
  l1_gas_price: Uint64Schema,
})
export type FeeParamsV1 = InferOutput<
  typeof FeeParamsV1Schema
>

export const FeeParamsV2Schema = object({
  config: FeeModelConfigV2Schema,
  l1_gas_price: Uint64Schema,
  l1_pubdata_price: Uint64Schema,
  conversion_ratio: BaseTokenConversionRatioSchema,
})
export type FeeParamsV2 = InferOutput<
  typeof FeeParamsV2Schema
>

export const FeeParamsSchema = union([
  object({ V1: FeeParamsV1Schema }),
  object({ V2: FeeParamsV2Schema }),
])
export type FeeParams = InferOutput<typeof FeeParamsSchema>
