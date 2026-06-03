// https://github.com/ethereum-optimism/optimism/blob/develop/op-service/eth/output.go
// type SafeHeadResponse struct {
//   L1Block  BlockID `json:"l1Block"`
//   SafeHead BlockID `json:"safeHead"`
// }
// BlockID is { hash, number } — same shape as L1Origin per
// op-service/eth/id.go.

import type { InferOutput } from "valibot"
import { object } from "valibot"

import { L1OriginSchema } from "./block-ref"

export const SafeHeadAtL1BlockSchema = object({
  l1Block: L1OriginSchema,
  safeHead: L1OriginSchema,
})
export type SafeHeadAtL1Block = InferOutput<
  typeof SafeHeadAtL1BlockSchema
>
