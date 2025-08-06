import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isHash32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{64}$/.test(input)
  )
}
export const Hash32Schema = custom<`0x${string}`>(isHash32)
export type Hash32 = InferOutput<typeof Hash32Schema>
