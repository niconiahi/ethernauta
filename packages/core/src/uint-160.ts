import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint160(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 160n) - 1n
}
export const Uint160Schema = pipe(
  custom<`0x${string}`>(isUint160, "uint160"),
  brand("Uint160"),
)
export type Uint160 = InferOutput<typeof Uint160Schema>
