import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint8(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x([0-9a-fA-F]{2})$/.test(input)
  )
}
export const uint8Schema = custom<`0x${string}`>(isUint8)
export type Uint8 = InferOutput<typeof uint8Schema>
