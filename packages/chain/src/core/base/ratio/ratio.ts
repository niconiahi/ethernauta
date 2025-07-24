import type { InferOutput } from "valibot"
import { maxValue, minValue, number, pipe } from "valibot"

export const ratioSchema = pipe(number(), minValue(0), maxValue(1))
export type Ratio = InferOutput<typeof ratioSchema>
