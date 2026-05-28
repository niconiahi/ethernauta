import type { InferOutput } from "valibot"
import { brand, custom, pipe } from "valibot"

function isUint256(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^0x[0-9a-f]{1,64}$/.test(input)
  )
}
export const Uint256Schema = pipe(
  custom<`0x${string}`>(isUint256, "uint256"),
  brand("Uint256"),
)
export type Uint256 = InferOutput<typeof Uint256Schema>
