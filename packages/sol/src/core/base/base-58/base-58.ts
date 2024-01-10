import type { Input } from "valibot"
import { special } from "valibot"

function isBase58(input: unknown): boolean {
  return typeof input === "string" && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input)
}
export const base58Schema = special<string>(isBase58)
export type Base58 = Input<typeof base58Schema>
