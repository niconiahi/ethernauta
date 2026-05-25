import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes64(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{128}$/.test(input)
  )
}
export const bytes64Schema = pipe(
  custom<`0x${string}`>(isBytes64),
  brand("Bytes64"),
)
export type Bytes64 = InferOutput<typeof bytes64Schema>
