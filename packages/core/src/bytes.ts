import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes(input: unknown): boolean {
  return (
    typeof input === "string" && /^0x[0-9a-f]*$/.test(input)
  )
}
export const bytesSchema = pipe(
  custom<`0x${string}`>(isBytes),
  brand("Bytes"),
)
export type Bytes = InferOutput<typeof bytesSchema>
