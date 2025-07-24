import type { InferOutput } from "valibot"
import { maxValue, minValue, number } from "valibot"

export const ratioSchema = number([minValue(0), maxValue(1)])
export type Ratio = InferOutput<typeof ratioSchema>
