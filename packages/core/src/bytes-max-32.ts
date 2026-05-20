import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytesMax32(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{0,64}$/.test(input)
  )
}
export const bytesMax32Schema =
  custom<`0x${string}`>(isBytesMax32)
export type BytesMax32 = InferOutput<
  typeof bytesMax32Schema
>
