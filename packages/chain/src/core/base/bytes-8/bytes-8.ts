import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytes8(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{16}$/.test(input)
}
export const bytes8Schema = custom<`0x${string}`>(isBytes8)
export type Bytes8 = InferOutput<typeof bytes8Schema>
