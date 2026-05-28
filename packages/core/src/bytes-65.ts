import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes65(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{130}$/.test(input)
  )
}
export const Bytes65Schema = pipe(
  custom<`0x${string}`>(isBytes65),
  brand("Bytes65"),
)
export type Bytes65 = InferOutput<typeof Bytes65Schema>
