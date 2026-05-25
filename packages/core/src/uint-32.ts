import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint32(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 32n) - 1n
}
export const uint32Schema = pipe(
  custom<`0x${string}`>(isUint32, "uint32"),
  brand("Uint32"),
)
export type Uint32 = InferOutput<typeof uint32Schema>
