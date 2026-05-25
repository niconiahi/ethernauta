import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint128(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 128n) - 1n
}
export const uint128Schema = pipe(
  custom<`0x${string}`>(isUint128, "uint128"),
  brand("Uint128"),
)
export type Uint128 = InferOutput<typeof uint128Schema>
