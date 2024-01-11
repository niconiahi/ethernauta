import type { Input } from "valibot"
import { special } from "valibot"

function isNamespace(input: unknown): boolean {
  return typeof input === "string" && /^[-a-z0-9]{3,8}$/.test(input)
}
export const caip2_namespaceSchema = special<string>(isNamespace)
export type caip2_Namespace = Input<typeof caip2_namespaceSchema>
