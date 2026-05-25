import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint24(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 24n) - 1n
}
export const uint24Schema = pipe(
  custom<`0x${string}`>(isUint24, "uint24"),
  brand("Uint24"),
)
export type Uint24 = InferOutput<typeof uint24Schema>
