import type { Input } from "valibot"
import { special } from "valibot"

function isBytes256(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{512}$/.test(input)
}
export const bytes256Schema = special<`0x${string}`>(isBytes256)
export type Bytes256 = Input<typeof bytes256Schema>
