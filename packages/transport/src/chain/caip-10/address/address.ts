import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isAddress(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9,a-f,A-F]{40}$/.test(input)
}
export const addressSchema = custom<`0x${string}`>(isAddress)
export type Address = InferOutput<typeof addressSchema>
