import type { Input } from "valibot"
import { special } from "valibot"

function isBytes32(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{64}$/.test(input)
}
export const bytes32Schema = special<`0x${string}`>(isBytes32)
export type Bytes32 = Input<typeof bytes32Schema>
