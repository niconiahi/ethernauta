import type { Input } from "valibot"
import { special } from "valibot"

function isAddress(input: unknown): boolean {
  return typeof input === "string" && /^0x[0-9,a-f,A-F]{40}$/.test(input)
}
export const addressSchema = special<`0x${string}`>(isAddress)
export type Address = Input<typeof addressSchema>
