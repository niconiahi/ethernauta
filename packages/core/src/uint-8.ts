import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint8(input: unknown): boolean {
  if (typeof input !== "string") return false
  if (!/^0x[0-9a-f]{1,64}$/.test(input)) return false
  return BigInt(input) <= (1n << 8n) - 1n
}
export const uint8Schema = custom<`0x${string}`>(
  isUint8,
  "uint8",
)
export type Uint8 = InferOutput<typeof uint8Schema>
