import type { InferOutput } from "valibot"
import { custom } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAssetType(input: unknown): boolean {
  return (
    typeof input === "string" &&
    /^[-:/a-zA-Z0-9]{11,115}$/.test(input)
  )
}
export const assetTypeSchema = custom<string>(isAssetType)
export type AssetType = InferOutput<typeof assetTypeSchema>
