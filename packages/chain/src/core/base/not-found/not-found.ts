import type { InferOutput } from "valibot"
import { null_ } from "valibot"

export const notFoundSchema = null_()
export type NotFound = InferOutput<typeof notFoundSchema>
