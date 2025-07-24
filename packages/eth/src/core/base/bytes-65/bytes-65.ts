import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytes65(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{130}$/.test(input)
}
export const bytes65Schema = custom<`0x${string}`>(isBytes65)
export type Bytes65 = InferOutput<typeof bytes65Schema>
