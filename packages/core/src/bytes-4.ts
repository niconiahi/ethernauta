import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes4(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{8}$/.test(input)
  )
}
export const Bytes4Schema = pipe(
  custom<`0x${string}`>(isBytes4),
  brand("Bytes4"),
)
export type Bytes4 = InferOutput<typeof Bytes4Schema>
