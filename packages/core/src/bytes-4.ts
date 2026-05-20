import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytes4(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{8}$/.test(input)
  )
}
export const bytes4Schema = custom<`0x${string}`>(isBytes4)
export type Bytes4 = InferOutput<typeof bytes4Schema>
