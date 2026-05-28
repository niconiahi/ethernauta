import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes48(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{96}$/.test(input)
  )
}
export const Bytes48Schema = pipe(
  custom<`0x${string}`>(isBytes48),
  brand("Bytes48"),
)
export type Bytes48 = InferOutput<typeof Bytes48Schema>
