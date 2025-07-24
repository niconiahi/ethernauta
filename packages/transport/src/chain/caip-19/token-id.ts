import type { InferOutput } from "valibot"
import { custom } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isTokenId(input: unknown): boolean {
  return typeof input === "string" && /^[-a-zA-Z0-9]{1,32}$/.test(input)
}
export const tokenIdSchema = custom<string>(isTokenId)
export type TokenId = InferOutput<typeof tokenIdSchema>
