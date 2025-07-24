import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isNamespace(input: unknown): boolean {
  return typeof input === "string" && /^[-a-z0-9]{3,8}$/.test(input)
}
const namespaceSchema = custom<string>(isNamespace)
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
type Namespace = InferOutput<typeof namespaceSchema>
