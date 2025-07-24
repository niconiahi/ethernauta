import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint(input: unknown): boolean {
  return typeof input === "string" && /^0x([1-9a-f]+[0-9a-f]*|0)$/.test(input)
}
export const uintSchema = custom<`0x${string}`>(isUint)
export type Uint = InferOutput<typeof uintSchema>
