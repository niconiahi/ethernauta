import type { Input } from "valibot"
import { special } from "valibot"

function isBytes8(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{16}$/.test(input)
}
export const bytes8Schema = special<`0x${string}`>(isBytes8)
export type Bytes8 = Input<typeof bytes8Schema>
