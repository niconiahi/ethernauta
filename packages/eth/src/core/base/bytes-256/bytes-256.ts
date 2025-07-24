import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytes256(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{512}$/.test(input)
}
export const bytes256Schema = custom<`0x${string}`>(isBytes256)
export type Bytes256 = InferOutput<typeof bytes256Schema>
