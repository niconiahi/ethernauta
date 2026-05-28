import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes8(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{16}$/.test(input)
  )
}
export const Bytes8Schema = pipe(
  custom<`0x${string}`>(isBytes8),
  brand("Bytes8"),
)
export type Bytes8 = InferOutput<typeof Bytes8Schema>
