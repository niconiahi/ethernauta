import type { Input } from "valibot"
import { special } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isTokenId(input: unknown): boolean {
  return typeof input === "string" && /^[-a-zA-Z0-9]{1,32}$/.test(input)
}
export const tokenIdSchema = special<string>(isTokenId)
export type TokenId = Input<typeof tokenIdSchema>
