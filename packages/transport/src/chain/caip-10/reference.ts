import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isReference(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-a-zA-Z0-9]{1,32}$/.test(input)
  )
}
const referenceSchema = custom<string>(isReference)
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
export type Reference = InferOutput<typeof referenceSchema>
