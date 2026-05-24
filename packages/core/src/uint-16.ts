import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint16(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 16n) - 1n
}
export const uint16Schema = custom<`0x${string}`>(
  isUint16,
  "uint16",
)
export type Uint16 = InferOutput<typeof uint16Schema>
