import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isReference(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-a-zA-Z0-9]{1,32}$/.test(input)
  )
}
export const referenceSchema = custom<string>(isReference)
export type Reference = InferOutput<typeof referenceSchema>
