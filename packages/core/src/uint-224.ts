import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint224(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 224n) - 1n
}
export const Uint224Schema = pipe(
  custom<`0x${string}`>(isUint224, "uint224"),
  brand("Uint224"),
)
export type Uint224 = InferOutput<typeof Uint224Schema>
