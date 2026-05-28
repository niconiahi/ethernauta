import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint64(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 64n) - 1n
}
export const Uint64Schema = pipe(
  custom<`0x${string}`>(isUint64, "uint64"),
  brand("Uint64"),
)
export type Uint64 = InferOutput<typeof Uint64Schema>
