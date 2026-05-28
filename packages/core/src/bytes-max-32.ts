import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isBytesMax32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{0,64}$/.test(input)
  )
}
export const BytesMax32Schema = pipe(
  custom<`0x${string}`>(isBytesMax32),
  brand("BytesMax32"),
)
export type BytesMax32 = InferOutput<
  typeof BytesMax32Schema
>
