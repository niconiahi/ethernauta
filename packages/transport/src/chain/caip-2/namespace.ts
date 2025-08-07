import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isNamespace(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-a-z0-9]{3,8}$/.test(input)
  )
}
export const caip2_namespaceSchema =
  custom<string>(isNamespace)
export type caip2_Namespace = InferOutput<
  typeof caip2_namespaceSchema
>
