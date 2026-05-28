import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes256(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{512}$/.test(input)
  )
}
export const Bytes256Schema = pipe(
  custom<`0x${string}`>(isBytes256),
  brand("Bytes256"),
)
export type Bytes256 = InferOutput<typeof Bytes256Schema>
