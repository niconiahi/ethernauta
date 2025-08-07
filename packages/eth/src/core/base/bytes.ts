import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isBytes(input: unknown): boolean {
  return (
    typeof input === "string" && /^0x[0-9a-f]*$/.test(input)
  )
}
export const bytesSchema = custom<`0x${string}`>(isBytes)
export type Bytes = InferOutput<typeof bytesSchema>
