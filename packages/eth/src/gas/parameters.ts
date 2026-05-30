// https://eips.ethereum.org/EIPS/eip-1559

import type { InferOutput } from "valibot"
import {
  maxValue,
  minValue,
  number,
  object,
  pipe,
} from "valibot"

const PercentileSchema = pipe(
  number(),
  minValue(0),
  maxValue(100),
)
const MultiplierSchema = pipe(number(), minValue(1))

export const Estimate1559FeesParametersSchema = object({
  base_fee_multiplier: MultiplierSchema,
  priority_percentile: PercentileSchema,
})
export type Estimate1559FeesParameters = InferOutput<
  typeof Estimate1559FeesParametersSchema
>
