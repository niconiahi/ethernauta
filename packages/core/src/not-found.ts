import type { InferOutput } from "valibot"
import { null_ } from "valibot"

export const NotFoundSchema = null_()
export type NotFound = InferOutput<typeof NotFoundSchema>
