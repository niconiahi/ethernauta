import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isNamespace(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-a-z0-9]{3,8}$/.test(input)
  )
}
const Caip10_namespaceSchema = custom<string>(isNamespace)
export type caip10_Namespace = InferOutput<
  typeof Caip10_namespaceSchema
>
