import type { Input } from "valibot"
import { special } from "valibot"

function isNamespace(input: unknown): boolean {
  return typeof input === "string" && /^[-a-z0-9]{3,8}$/.test(input)
}
const namespaceSchema = special<string>(isNamespace)
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
type Namespace = Input<typeof namespaceSchema>
