import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isChainId(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-:a-zA-Z0-9]{5,41}$/.test(input)
  )
}
export const chainIdSchema = custom<string>(isChainId)
export type ChainId = InferOutput<typeof chainIdSchema>
