import type { Input } from "valibot"
import { special } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAssetId(input: unknown): boolean {
  return typeof input === "string" && /^[-:/a-zA-Z0-9]{13,148}$/.test(input)
}
export const assetIdSchema = special<string>(isAssetId)
export type AssetId = Input<typeof assetIdSchema>
