import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint96(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 96n) - 1n
}
export const Uint96Schema = pipe(
  custom<`0x${string}`>(isUint96, "uint96"),
  brand("Uint96"),
)
export type Uint96 = InferOutput<typeof Uint96Schema>
