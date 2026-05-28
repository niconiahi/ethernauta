import type { InferOutput } from "valibot"
import { maxValue, minValue, number, pipe } from "valibot"

export const RatioSchema = pipe(
  number(),
  minValue(0),
  maxValue(1),
)
export type Ratio = InferOutput<typeof RatioSchema>
