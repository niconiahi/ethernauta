import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x([1-9a-f]+[0-9a-f]*|0)$/.test(input)
  )
}
export const UintSchema = pipe(
  custom<`0x${string}`>(isUint, "uint"),
  brand("Uint"),
)
export type Uint = InferOutput<typeof UintSchema>
