import type { Input } from "valibot"
import { null_ } from "valibot"

export const notFoundSchema = null_()
export type NotFound = Input<typeof notFoundSchema>
