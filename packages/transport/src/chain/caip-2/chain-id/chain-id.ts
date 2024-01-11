import type { Input } from "valibot"
import { special } from "valibot"

function isChainId(input: unknown): boolean {
  return typeof input === "string" && /^[-:a-zA-Z0-9]{5,41}$/.test(input)
}
export const chainIdSchema = special<string>(isChainId)
export type ChainId = Input<typeof chainIdSchema>
