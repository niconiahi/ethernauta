import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint56(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 56n) - 1n
}
export const uint56Schema = custom<`0x${string}`>(
  isUint56,
  "uint56",
)
export type Uint56 = InferOutput<typeof uint56Schema>
