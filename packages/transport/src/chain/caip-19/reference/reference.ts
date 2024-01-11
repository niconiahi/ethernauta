import type { Input } from "valibot"
import { special } from "valibot"

function isReference(input: unknown): boolean {
  return typeof input === "string" && /^[-a-zA-Z0-9]{1,32}$/.test(input)
}
const referenceSchema = special<string>(isReference)
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
type Reference = Input<typeof referenceSchema>
