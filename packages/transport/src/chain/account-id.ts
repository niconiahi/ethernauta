import type { InferOutput } from "valibot"
import { custom } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAccountId(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-:a-zA-Z0-9]{7,106}$/.test(input)
  )
}
export const accountIdSchema = custom<string>(isAccountId)
export type AccountId = InferOutput<typeof accountIdSchema>
