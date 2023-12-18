import type { Input } from "valibot"
import { special } from "valibot"

function isBytesMax32(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9a-f]{0,64}$/.test(input)
}
export const bytesMax32Schema = special<`0x${string}`>(isBytesMax32)
export type BytesMax32 = Input<typeof bytesMax32Schema>
