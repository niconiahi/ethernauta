import type { Input } from "valibot"
import { special } from "valibot"

function isAddress(input: unknown): boolean {
  return typeof input === "string" && /[1-9A-HJ-NP-Za-km-z]{32,44}/.test(input)
}
export const addressSchema = special<string>(isAddress)
export type Address = Input<typeof addressSchema>
