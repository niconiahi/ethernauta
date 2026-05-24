import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint192(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 192n) - 1n
}
export const uint192Schema = custom<`0x${string}`>(
  isUint192,
  "uint192",
)
export type Uint192 = InferOutput<typeof uint192Schema>
