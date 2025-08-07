import type { InferOutput } from "valibot"
import { custom } from "valibot"

function isUint256(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x([1-9a-f]+[0-9a-f]{0,31})|0$/.test(input)
  )
}
export const uint256Schema =
  custom<`0x${string}`>(isUint256)
export type Uint256 = InferOutput<typeof uint256Schema>
