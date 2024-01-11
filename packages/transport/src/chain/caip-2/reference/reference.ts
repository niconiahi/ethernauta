import type { Input } from "valibot"
import { special } from "valibot"

function isReference(input: unknown): boolean {
  return typeof input === "string" && /^[-a-zA-Z0-9]{1,32}$/.test(input)
}
export const caip2_referenceSchema = special<string>(isReference)
export type caip2_Reference = Input<typeof caip2_referenceSchema>
