import type { Input } from "valibot"
import { special } from "valibot"

function isBase64(input: unknown): boolean {
  return typeof input === "string" && /^[A-Za-z0-9+\/]+={0,2}$/.test(input)
}
export const base64Schema = special<string>(isBase64)
export type Base64 = Input<typeof base64Schema>
