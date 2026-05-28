import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint16(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 16n) - 1n
}
export const Uint16Schema = pipe(
  custom<`0x${string}`>(isUint16, "uint16"),
  brand("Uint16"),
)
export type Uint16 = InferOutput<typeof Uint16Schema>
