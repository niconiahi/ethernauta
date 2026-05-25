import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isHash32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{64}$/.test(input)
  )
}
export const hash32Schema = pipe(
  custom<`0x${string}`>(isHash32),
  brand("Hash32"),
)
export type Hash32 = InferOutput<typeof hash32Schema>
