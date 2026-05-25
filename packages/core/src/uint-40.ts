import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint40(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 40n) - 1n
}
export const uint40Schema = pipe(
  custom<`0x${string}`>(isUint40, "uint40"),
  brand("Uint40"),
)
export type Uint40 = InferOutput<typeof uint40Schema>
