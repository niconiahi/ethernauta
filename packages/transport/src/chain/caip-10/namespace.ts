import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isNamespace(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-a-z0-9]{3,8}$/.test(input)
  )
}
const caip10_namespaceSchema = custom<string>(isNamespace)
// eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars
export type caip10_Namespace = InferOutput<
  typeof caip10_namespaceSchema
>
