import type { Input } from "valibot"
import { special } from "valibot"

// https://github.com/ChainAgnostic/caip-js/blob/master/src/spec.ts#L5
function isAssetName(input: unknown): boolean {
  return typeof input === "string" && /^[-:a-zA-Z0-9]{5,73}$/.test(input)
}
export const assetNameSchema = special<string>(isAssetName)
export type AssetName = Input<typeof assetNameSchema>
