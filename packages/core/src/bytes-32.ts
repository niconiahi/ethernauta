import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytes32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{64}$/.test(input)
  )
}
export const bytes32Schema = pipe(
  custom<`0x${string}`>(isBytes32),
  brand("Bytes32"),
)
export type Bytes32 = InferOutput<typeof bytes32Schema>
