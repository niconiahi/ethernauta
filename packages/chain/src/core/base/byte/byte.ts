import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isByte(input: unknown): boolean {
  return typeof input === "string" && /^0x([0-9,a-f,A-F]?){1,2}$/.test(input)
}
export const byteSchema = custom<`0x${string}`>(isByte)
export type Byte = InferOutput<typeof byteSchema>
