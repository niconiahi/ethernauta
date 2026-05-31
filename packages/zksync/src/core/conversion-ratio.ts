// https://github.com/matter-labs/zksync-era/blob/72a0b7c519a82b04fd72dd2bfb513f751bbad161/core/lib/types/src/fee_model.rs
// `BaseTokenConversionRatio` carries `{l1, sl}` sub-ratios for
// chains that pay gas in a non-ETH token. The flat `numerator` /
// `denominator` pair is deprecated upstream but still on the wire
// for backwards compatibility — keep both shapes.

import { Uint64Schema } from "@ethernauta/core"
import type { InferOutput } from "valibot"
import { nullable, object } from "valibot"

export const ConversionRatioSchema = object({
  numerator: Uint64Schema,
  denominator: Uint64Schema,
})
export type ConversionRatio = InferOutput<
  typeof ConversionRatioSchema
>

export const BaseTokenConversionRatioSchema = object({
  l1: nullable(ConversionRatioSchema),
  sl: nullable(ConversionRatioSchema),
  numerator: Uint64Schema,
  denominator: Uint64Schema,
})
export type BaseTokenConversionRatio = InferOutput<
  typeof BaseTokenConversionRatioSchema
>
