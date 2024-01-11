import type { Input } from "valibot"
import { special } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAccountId(input: unknown): boolean {
  return typeof input === "string" && /^[-:a-zA-Z0-9]{7,106}$/.test(input)
}
export const accountIdSchema = special<string>(isAccountId)
export type AccountId = Input<typeof accountIdSchema>
