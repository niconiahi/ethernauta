import type { InferOutput } from "valibot"
import { custom } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAssetName(input: unknown): boolean {
  return typeof input === "string" && /^[-:a-zA-Z0-9]{5,73}$/.test(input)
}
export const assetNameSchema = custom<string>(isAssetName)
export type AssetName = InferOutput<typeof assetNameSchema>
