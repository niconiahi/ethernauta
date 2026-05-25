import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isAddress(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9,a-f,A-F]{40}$/.test(input)
  )
}
export const addressSchema = pipe(
  custom<`0x${string}`>(isAddress),
  brand("Address"),
)
export type Address = InferOutput<typeof addressSchema>
