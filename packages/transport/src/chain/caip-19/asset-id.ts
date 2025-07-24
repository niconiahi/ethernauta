import type { InferOutput } from "valibot"
import { custom } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAssetId(input: unknown): boolean {
  return typeof input === "string" && /^[-:/a-zA-Z0-9]{13,148}$/.test(input)
}
export const assetIdSchema = custom<string>(isAssetId)
export type AssetId = InferOutput<typeof assetIdSchema>
