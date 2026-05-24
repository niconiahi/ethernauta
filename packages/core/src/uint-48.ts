import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint48(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 48n) - 1n
}
export const uint48Schema = custom<`0x${string}`>(
  isUint48,
  "uint48",
)
export type Uint48 = InferOutput<typeof uint48Schema>
